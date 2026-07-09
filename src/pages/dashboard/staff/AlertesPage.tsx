import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MegaphoneIcon, PlusIcon } from 'lucide-react'
import { Button } from '../../../components/ui-shadcn/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui-shadcn/ui/card'
import { Badge } from '../../../components/ui-shadcn/ui/badge'
import { Checkbox } from '../../../components/ui-shadcn/ui/checkbox'
import { Label } from '../../../components/ui-shadcn/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui-shadcn/ui/table'
import { DataState } from '../../../components/dashboard/DataState'
import { PaginationControls } from '../../../components/dashboard/PaginationControls'
import { useApiData } from '../../../hooks/useApiData'
import { useClientPagination } from '../../../hooks/useClientPagination'
import { useAuth } from '../../../context/AuthContext'
import { api, ApiError } from '../../../lib/api'
import { GROUPES_SANGUINS, GROUPE_SANGUIN_LABELS } from '../../../lib/constants'
import type { Alerte, GroupeSanguin, Quartier } from '../../../lib/types'

function toggle<T>(liste: T[], valeur: T): T[] {
  return liste.includes(valeur) ? liste.filter((v) => v !== valeur) : [...liste, valeur]
}

export default function AlertesPage() {
  const { user } = useAuth()
  const peutLancerAlertes = user?.role !== 'SUPERADMIN'
  const { data: alertes, isLoading, error, refetch } = useApiData<Alerte[]>('/alertes')
  const { data: quartiers } = useApiData<Quartier[]>('/quartiers')
  const { page, setPage, totalPages, pageItems, total } = useClientPagination(alertes ?? [], 6)

  const [groupes, setGroupes] = useState<GroupeSanguin[]>([])
  const [quartierIds, setQuartierIds] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [succes, setSucces] = useState<string | null>(null)

  const nbCombinaisons = groupes.length * quartierIds.length

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault()
    if (groupes.length === 0 || quartierIds.length === 0) return
    setSubmitting(true)
    setFormError(null)
    setSucces(null)
    try {
      const crees = await api.post<Alerte[]>('/alertes', { groupesSanguinsRequis: groupes, quartierIds })
      const totalNotifies = crees.reduce((total, a) => total + (a.donneursNotifies ?? 0), 0)
      setSucces(`${crees.length} alerte(s) créée(s), ${totalNotifies} donneur(s) notifié(s) au total.`)
      setGroupes([])
      setQuartierIds([])
      await refetch()
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Impossible de créer les alertes")
    } finally {
      setSubmitting(false)
    }
  }

  async function toggleStatut(alerte: Alerte) {
    const nouveauStatut = alerte.statut === 'OUVERTE' ? 'FERMEE' : 'OUVERTE'
    await api.patch(`/alertes/${alerte.id}/statut`, { statut: nouveauStatut })
    refetch()
  }

  return (
    <div className="space-y-6">
      {peutLancerAlertes && (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" /> Nouvelle(s) alerte(s)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Groupes sanguins requis</Label>
                <div className="grid grid-cols-2 gap-2 rounded-md border border-border p-3">
                  {GROUPES_SANGUINS.map((g) => (
                    <label key={g} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={groupes.includes(g)}
                        onCheckedChange={() => setGroupes((prev) => toggle(prev, g))}
                      />
                      {GROUPE_SANGUIN_LABELS[g]}
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Quartiers ciblés</Label>
                <div className="grid grid-cols-2 gap-2 rounded-md border border-border p-3 max-h-48 overflow-y-auto">
                  {(quartiers ?? []).map((q) => (
                    <label key={q.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={quartierIds.includes(q.id)}
                        onCheckedChange={() => setQuartierIds((prev) => toggle(prev, q.id))}
                      />
                      {q.nom}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button type="submit" disabled={submitting || nbCombinaisons === 0}>
                {nbCombinaisons > 1 ? `Envoyer ${nbCombinaisons} alertes` : "Envoyer l'alerte"}
              </Button>
              {nbCombinaisons > 0 && (
                <p className="text-sm text-muted-foreground">
                  {groupes.length} groupe(s) × {quartierIds.length} quartier(s) = {nbCombinaisons} alerte(s)
                </p>
              )}
            </div>
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            {succes && <p className="text-sm text-tertiary">{succes}</p>}
          </form>
        </CardContent>
      </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MegaphoneIcon className="h-4 w-4" /> Alertes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataState isLoading={isLoading} error={error} isEmpty={!alertes?.length} emptyLabel="Aucune alerte pour le moment.">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Groupe</TableHead>
                  <TableHead>Quartier</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Réponses</TableHead>
                  <TableHead>Créée le</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((alerte) => (
                  <TableRow key={alerte.id}>
                    <TableCell className="font-medium">{GROUPE_SANGUIN_LABELS[alerte.groupeSanguinRequis]}</TableCell>
                    <TableCell>{alerte.quartier?.nom ?? '—'}</TableCell>
                    <TableCell>
                      <Badge variant={alerte.statut === 'OUVERTE' ? 'default' : 'secondary'}>{alerte.statut}</Badge>
                    </TableCell>
                    <TableCell>{alerte._count?.reponses ?? 0}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(alerte.dateCreation).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/admin/alertes/${alerte.id}`}>Voir les réponses</Link>
                      </Button>
                      {peutLancerAlertes && (
                        <Button variant="outline" size="sm" onClick={() => toggleStatut(alerte)}>
                          {alerte.statut === 'OUVERTE' ? 'Fermer' : 'Rouvrir'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} total={total} label="alertes" />
          </DataState>
        </CardContent>
      </Card>
    </div>
  )
}
