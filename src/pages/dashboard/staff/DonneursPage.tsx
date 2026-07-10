import { useMemo, useState } from 'react'
import { HeartHandshakeIcon } from 'lucide-react'
import { Badge } from '../../../components/ui-shadcn/ui/badge'
import { Button } from '../../../components/ui-shadcn/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui-shadcn/ui/card'
import { Input } from '../../../components/ui-shadcn/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui-shadcn/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui-shadcn/ui/table'
import { DataState } from '../../../components/dashboard/DataState'
import { PaginationControls } from '../../../components/dashboard/PaginationControls'
import { useApiData } from '../../../hooks/useApiData'
import { useClientPagination } from '../../../hooks/useClientPagination'
import { useAuth } from '../../../context/AuthContext'
import { api, ApiError } from '../../../lib/api'
import { GROUPE_SANGUIN_LABELS, GROUPES_SANGUINS } from '../../../lib/constants'
import type { GroupeSanguin, Quartier, Utilisateur } from '../../../lib/types'

const TOUS_GROUPES = '__tous__'
const TOUS_QUARTIERS = '__tous__'

export default function DonneursPage() {
  const { user: moi } = useAuth()
  const { data: utilisateurs, isLoading, error, refetch } = useApiData<Utilisateur[]>('/users')
  const { data: quartiers } = useApiData<Quartier[]>('/quartiers')
  const peutGererStatut = moi?.role === 'ADMIN' || moi?.role === 'SUPERADMIN'

  const [recherche, setRecherche] = useState('')
  const [groupeFiltre, setGroupeFiltre] = useState<GroupeSanguin | typeof TOUS_GROUPES>(TOUS_GROUPES)
  const [quartierFiltre, setQuartierFiltre] = useState(TOUS_QUARTIERS)

  const quartierParId = useMemo(() => new Map((quartiers ?? []).map((q) => [q.id, q])), [quartiers])

  const donneurs = useMemo(() => {
    const termeRecherche = recherche.trim().toLowerCase()
    return (utilisateurs ?? []).filter((u) => {
      if (u.role !== 'DONNEUR') return false
      if (groupeFiltre !== TOUS_GROUPES && u.groupeSanguin !== groupeFiltre) return false
      if (quartierFiltre !== TOUS_QUARTIERS && u.quartierId !== quartierFiltre) return false
      if (termeRecherche) {
        const cible = `${u.nom} ${u.prenom} ${u.telephone ?? ''} ${u.email ?? ''}`.toLowerCase()
        if (!cible.includes(termeRecherche)) return false
      }
      return true
    })
  }, [utilisateurs, recherche, groupeFiltre, quartierFiltre])

  const { page, setPage, totalPages, pageItems, total } = useClientPagination(donneurs, 8)

  async function toggleStatut(u: Utilisateur) {
    const nouveauStatut = u.statut === 'ACTIF' ? 'INACTIF' : 'ACTIF'
    try {
      await api.patch(`/users/${u.id}/statut`, { statut: nouveauStatut })
      await refetch()
    } catch (err) {
      window.alert(err instanceof ApiError ? err.message : 'Impossible de modifier ce compte')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HeartHandshakeIcon className="h-4 w-4" /> Donneurs ({total})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            placeholder="Rechercher (nom, téléphone, email)"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
          <Select value={groupeFiltre} onValueChange={(v) => setGroupeFiltre(v as GroupeSanguin)}>
            <SelectTrigger>
              <SelectValue placeholder="Groupe sanguin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TOUS_GROUPES}>Tous les groupes</SelectItem>
              {GROUPES_SANGUINS.map((g) => (
                <SelectItem key={g} value={g}>
                  {GROUPE_SANGUIN_LABELS[g]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={quartierFiltre} onValueChange={setQuartierFiltre}>
            <SelectTrigger>
              <SelectValue placeholder="Quartier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TOUS_QUARTIERS}>Tous les quartiers</SelectItem>
              {(quartiers ?? []).map((q) => (
                <SelectItem key={q.id} value={q.id}>
                  {q.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DataState isLoading={isLoading} error={error} isEmpty={!donneurs.length} emptyLabel="Aucun donneur ne correspond à ces critères.">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Groupe sanguin</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Quartier</TableHead>
                <TableHead>Statut</TableHead>
                {peutGererStatut && <TableHead className="text-right">Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">
                    {u.prenom} {u.nom}
                  </TableCell>
                  <TableCell>
                    {u.groupeSanguin ? <Badge variant="outline">{GROUPE_SANGUIN_LABELS[u.groupeSanguin]}</Badge> : '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.telephone ?? '—'}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.quartierId ? quartierParId.get(u.quartierId)?.nom ?? '—' : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.statut === 'ACTIF' ? 'default' : 'destructive'}>{u.statut}</Badge>
                  </TableCell>
                  {peutGererStatut && (
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => toggleStatut(u)}>
                        {u.statut === 'ACTIF' ? 'Désactiver' : 'Activer'}
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} total={total} label="donneurs" />
        </DataState>
      </CardContent>
    </Card>
  )
}
