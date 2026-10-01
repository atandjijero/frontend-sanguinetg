import { useMemo, useState } from 'react'
import { HeartHandshakeIcon, Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'
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
import { useConfirm } from '../../../context/ConfirmContext'
import { api, ApiError } from '../../../lib/api'
import { GROUPE_SANGUIN_LABELS, GROUPES_SANGUINS } from '../../../lib/constants'
import { calculerAge } from '../../../lib/date-format'
import { T, useTraduction } from '../../../context/LanguageContext'
import type { CarnetDigital, GroupeSanguin, Quartier, Utilisateur } from '../../../lib/types'

const TOUS_GROUPES = '__tous__'
const TOUS_QUARTIERS = '__tous__'

export default function DonneursPage() {
  const { user: moi } = useAuth()
  const confirm = useConfirm()
  const { data: utilisateurs, isLoading, error, refetch } = useApiData<Utilisateur[]>('/users')
  const { data: quartiers } = useApiData<Quartier[]>('/quartiers')
  const { data: carnets } = useApiData<CarnetDigital[]>('/carnets')
  const peutGererStatut = moi?.role === 'ADMIN' || moi?.role === 'SUPERADMIN'
  const peutSupprimer = moi?.role === 'SUPERADMIN'

  const historiqueParDonneur = useMemo(() => {
    const map = new Map<string, { count: number; dernier: string }>()
    for (const c of carnets ?? []) {
      const existant = map.get(c.donneurId)
      const dernier = existant && existant.dernier > c.dateDon ? existant.dernier : c.dateDon
      map.set(c.donneurId, { count: (existant?.count ?? 0) + 1, dernier })
    }
    return map
  }, [carnets])

  const [recherche, setRecherche] = useState('')
  const [groupeFiltre, setGroupeFiltre] = useState<GroupeSanguin | typeof TOUS_GROUPES>(TOUS_GROUPES)
  const [quartierFiltre, setQuartierFiltre] = useState(TOUS_QUARTIERS)
  const placeholderRecherche = useTraduction('Rechercher (nom, téléphone, email)')
  const placeholderGroupe = useTraduction('Groupe sanguin')
  const placeholderQuartier = useTraduction('Quartier')

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
      toast.error(err instanceof ApiError ? err.message : 'Impossible de modifier ce compte')
    }
  }

  async function changerGroupeSanguin(u: Utilisateur, groupeSanguin: GroupeSanguin) {
    if (groupeSanguin === u.groupeSanguin) return
    const description = u.groupeSanguin
      ? `Corriger le groupe sanguin de ${u.prenom} ${u.nom} : ${GROUPE_SANGUIN_LABELS[u.groupeSanguin]} → ${GROUPE_SANGUIN_LABELS[groupeSanguin]} ? Ce groupe détermine les alertes qu'il recevra.`
      : `Renseigner le groupe sanguin ${GROUPE_SANGUIN_LABELS[groupeSanguin]} pour ${u.prenom} ${u.nom} ? Ce groupe détermine les alertes qu'il recevra.`
    if (!(await confirm({ description }))) return
    try {
      await api.patch(`/users/${u.id}/groupe-sanguin`, { groupeSanguin })
      toast.success('Groupe sanguin enregistré')
      await refetch()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Impossible de modifier le groupe sanguin')
    }
  }

  async function supprimerDonneur(u: Utilisateur) {
    if (!(await confirm({ description: `Supprimer définitivement ${u.prenom} ${u.nom} ? Son carnet digital, ses réponses aux alertes et son historique seront aussi supprimés.` })))
      return
    try {
      await api.delete(`/users/${u.id}`)
      await refetch()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Suppression impossible')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HeartHandshakeIcon className="h-4 w-4" /> <T>Donneurs</T> ({total})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            placeholder={placeholderRecherche}
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
          <Select value={groupeFiltre} onValueChange={(v) => setGroupeFiltre(v as GroupeSanguin)}>
            <SelectTrigger>
              <SelectValue placeholder={placeholderGroupe} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TOUS_GROUPES}>
                <T>Tous les groupes</T>
              </SelectItem>
              {GROUPES_SANGUINS.map((g) => (
                <SelectItem key={g} value={g}>
                  {GROUPE_SANGUIN_LABELS[g]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={quartierFiltre} onValueChange={setQuartierFiltre}>
            <SelectTrigger>
              <SelectValue placeholder={placeholderQuartier} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TOUS_QUARTIERS}>
                <T>Tous les quartiers</T>
              </SelectItem>
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
                <TableHead>
                  <T>Nom</T>
                </TableHead>
                <TableHead>
                  <T>Âge</T>
                </TableHead>
                <TableHead>
                  <T>Groupe sanguin</T>
                </TableHead>
                <TableHead>
                  <T>Téléphone</T>
                </TableHead>
                <TableHead>
                  <T>Quartier</T>
                </TableHead>
                <TableHead>
                  <T>Dons</T>
                </TableHead>
                <TableHead>
                  <T>Dernier don</T>
                </TableHead>
                <TableHead>
                  <T>Statut</T>
                </TableHead>
                {(peutGererStatut || peutSupprimer) && (
                  <TableHead className="text-right">
                    <T>Action</T>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((u) => {
                const historique = historiqueParDonneur.get(u.id)
                return (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">
                    {u.prenom} {u.nom}
                  </TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {u.dateNaissance ? `${calculerAge(u.dateNaissance)} ans` : '—'}
                  </TableCell>
                  <TableCell>
                    <Select value={u.groupeSanguin ?? ''} onValueChange={(v) => changerGroupeSanguin(u, v as GroupeSanguin)}>
                      <SelectTrigger className="h-8 w-24" aria-label={`Groupe sanguin de ${u.prenom} ${u.nom}`}>
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        {GROUPES_SANGUINS.map((g) => (
                          <SelectItem key={g} value={g}>
                            {GROUPE_SANGUIN_LABELS[g]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.telephone ?? '—'}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.quartierId ? quartierParId.get(u.quartierId)?.nom ?? '—' : '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span>{historique?.count ?? 0}</span>
                      {historique && historique.count >= 2 && (
                        <Badge variant="outline" className="text-xs">
                          <T>Fidèle</T>
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {historique ? new Date(historique.dernier).toLocaleDateString('fr-FR') : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.statut === 'ACTIF' ? 'default' : 'destructive'}>{u.statut}</Badge>
                  </TableCell>
                  {(peutGererStatut || peutSupprimer) && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {peutGererStatut && (
                          <Button variant="outline" size="sm" onClick={() => toggleStatut(u)}>
                            <T>{u.statut === 'ACTIF' ? 'Désactiver' : 'Activer'}</T>
                          </Button>
                        )}
                        {peutSupprimer && (
                          <Button variant="destructive" size="sm" onClick={() => supprimerDonneur(u)}>
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} total={total} label="donneurs" />
        </DataState>
      </CardContent>
    </Card>
  )
}
