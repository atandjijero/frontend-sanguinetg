import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2Icon, MegaphoneIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { useConfirm } from '../../../context/ConfirmContext'
import { Button } from '../../../components/ui-shadcn/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui-shadcn/ui/card'
import { Badge } from '../../../components/ui-shadcn/ui/badge'
import { Checkbox } from '../../../components/ui-shadcn/ui/checkbox'
import { Input } from '../../../components/ui-shadcn/ui/input'
import { Label } from '../../../components/ui-shadcn/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui-shadcn/ui/table'
import { DataState } from '../../../components/dashboard/DataState'
import { PaginationControls } from '../../../components/dashboard/PaginationControls'
import { useApiData } from '../../../hooks/useApiData'
import { useClientPagination } from '../../../hooks/useClientPagination'
import { useAuth } from '../../../context/AuthContext'
import { api, ApiError } from '../../../lib/api'
import { GROUPES_SANGUINS, GROUPE_SANGUIN_LABELS } from '../../../lib/constants'
import { T, useTraduction } from '../../../context/LanguageContext'
import type { Alerte, CentreDon, GroupeSanguin, Quartier } from '../../../lib/types'

function toggle<T>(liste: T[], valeur: T): T[] {
  return liste.includes(valeur) ? liste.filter((v) => v !== valeur) : [...liste, valeur]
}

export default function AlertesPage() {
  const { user } = useAuth()
  const confirm = useConfirm()
  const peutLancerAlertes = user?.role !== 'SUPERADMIN'
  const { data: alertes, isLoading, error, refetch } = useApiData<Alerte[]>('/alertes')
  const { data: quartiers } = useApiData<Quartier[]>('/quartiers')
  const { data: centres } = useApiData<CentreDon[]>('/centres-don')
  const { page, setPage, totalPages, pageItems, total } = useClientPagination(alertes ?? [], 6)
  const placeholderTous = useTraduction('Tous')

  const [groupes, setGroupes] = useState<GroupeSanguin[]>([])
  const [quartierIds, setQuartierIds] = useState<string[]>([])
  const [centreDonIds, setCentreDonIds] = useState<string[]>([])
  const [nombreDonneursMaxParQuartier, setNombreDonneursMaxParQuartier] = useState<Record<string, string>>({})
  const [rayonKm, setRayonKm] = useState('10')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const nbCombinaisons = groupes.length * quartierIds.length * centreDonIds.length
  const quartiersParId = new Map((quartiers ?? []).map((q) => [q.id, q.nom]))
  const centresParId = new Map((centres ?? []).map((c) => [c.id, c.nom]))

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault()
    if (groupes.length === 0 || quartierIds.length === 0 || centreDonIds.length === 0) return
    setSubmitting(true)
    setFormError(null)
    try {
      const nombreDonneursMaxNumerique: Record<string, number> = {}
      for (const qId of quartierIds) {
        const valeur = nombreDonneursMaxParQuartier[qId]
        if (valeur) nombreDonneursMaxNumerique[qId] = Number(valeur)
      }
      const crees = await api.post<Alerte[]>('/alertes', {
        groupesSanguinsRequis: groupes,
        quartierIds,
        centreDonIds,
        rayonKm: rayonKm ? Number(rayonKm) : undefined,
        nombreDonneursMaxParQuartier: Object.keys(nombreDonneursMaxNumerique).length ? nombreDonneursMaxNumerique : undefined,
      })
      const totalNotifies = crees.reduce((total, a) => total + (a.donneursNotifies ?? 0), 0)
      toast.success(`${crees.length} alerte(s) créée(s), ${totalNotifies} donneur(s) notifié(s) au total.`)
      setGroupes([])
      setQuartierIds([])
      setCentreDonIds([])
      setNombreDonneursMaxParQuartier({})
      setRayonKm('10')
      await refetch()
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Impossible de créer les alertes"
      setFormError(message)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  async function fermer(alerte: Alerte) {
    await api.patch(`/alertes/${alerte.id}/statut`, { statut: 'FERMEE' })
    refetch()
  }

  async function relancer(alerte: Alerte) {
    try {
      const relancee = await api.post<Alerte>(`/alertes/${alerte.id}/relancer`)
      toast.success(`Alerte relancée, ${relancee.donneursNotifies ?? 0} donneur(s) renotifié(s).`)
      await refetch()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Relance impossible')
    }
  }

  async function handleDelete(id: string) {
    if (!(await confirm({ description: 'Supprimer cette alerte ? Les réponses des donneurs liées seront aussi supprimées.' })))
      return
    try {
      await api.delete(`/alertes/${id}`)
      await refetch()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Suppression impossible')
    }
  }

  return (
    <div className="space-y-6">
      {peutLancerAlertes && (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" /> <T>Nouvelle(s) alerte(s)</T>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>
                  <T>Groupes sanguins requis</T>
                </Label>
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
                <Label>
                  <T>Quartiers ciblés</T>
                </Label>
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

            <div className="space-y-2">
              <Label>
                <T>Centres de collecte</T>
              </Label>
              <div className="grid grid-cols-2 gap-2 rounded-md border border-border p-3 max-h-48 overflow-y-auto sm:max-w-sm">
                {(centres ?? []).map((c) => (
                  <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={centreDonIds.includes(c.id)}
                      onCheckedChange={() => setCentreDonIds((prev) => toggle(prev, c.id))}
                    />
                    {c.nom}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2 sm:max-w-xs">
              <Label>
                <T>Rayon autour du centre le plus proche (km)</T>
              </Label>
              <Input
                type="number"
                min={1}
                max={50}
                value={rayonKm}
                onChange={(e) => setRayonKm(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                <T>Seuls les donneurs géolocalisés dans ce rayon sont ciblés (les autres restent inclus par défaut).</T>
              </p>
            </div>

            {quartierIds.length > 0 && (
              <div className="space-y-2">
                <Label>
                  <T>Nombre de donneurs à cibler par quartier (optionnel)</T>
                </Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {quartierIds.map((qId) => (
                    <div key={qId} className="flex items-center gap-2">
                      <span className="text-sm w-32 shrink-0 truncate">{quartiersParId.get(qId) ?? qId}</span>
                      <Input
                        type="number"
                        min={1}
                        value={nombreDonneursMaxParQuartier[qId] ?? ''}
                        onChange={(e) =>
                          setNombreDonneursMaxParQuartier((prev) => ({ ...prev, [qId]: e.target.value }))
                        }
                        placeholder={placeholderTous}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {nbCombinaisons > 0 && (
              <div className="rounded-md border border-border p-3">
                <p className="text-sm font-medium mb-2">
                  <T>
                    {nbCombinaisons > 1
                      ? `${nbCombinaisons} alertes distinctes seront créées (une par combinaison groupe × quartier × centre, pour un suivi et une fermeture indépendants) :`
                      : "L'alerte suivante sera créée :"}
                  </T>
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {groupes.flatMap((g) =>
                    quartierIds.flatMap((qId) =>
                      centreDonIds.map((cId) => (
                        <li key={`${g}-${qId}-${cId}`}>
                          {GROUPE_SANGUIN_LABELS[g]} · {quartiersParId.get(qId) ?? qId} · {centresParId.get(cId) ?? cId}
                        </li>
                      )),
                    ),
                  )}
                </ul>
              </div>
            )}

            <div className="flex items-center gap-4">
              <Button type="submit" disabled={submitting || nbCombinaisons === 0} className="min-w-40">
                {submitting ? (
                  <>
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                    <T>Envoi en cours...</T>
                  </>
                ) : (
                  <T>{nbCombinaisons > 1 ? `Envoyer ${nbCombinaisons} alertes` : "Envoyer l'alerte"}</T>
                )}
              </Button>
            </div>
            {formError && (
              <p className="text-sm text-destructive">
                <T>{formError}</T>
              </p>
            )}
          </form>
        </CardContent>
      </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MegaphoneIcon className="h-4 w-4" /> <T>Alertes</T>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataState isLoading={isLoading} error={error} isEmpty={!alertes?.length} emptyLabel="Aucune alerte pour le moment.">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <T>Groupe</T>
                  </TableHead>
                  <TableHead>
                    <T>Quartier</T>
                  </TableHead>
                  <TableHead>
                    <T>Centre</T>
                  </TableHead>
                  <TableHead>
                    <T>Statut</T>
                  </TableHead>
                  <TableHead>
                    <T>Réponses</T>
                  </TableHead>
                  <TableHead>
                    <T>Créée le</T>
                  </TableHead>
                  <TableHead className="text-right">
                    <T>Action</T>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((alerte) => (
                  <TableRow key={alerte.id}>
                    <TableCell className="font-medium">{GROUPE_SANGUIN_LABELS[alerte.groupeSanguinRequis]}</TableCell>
                    <TableCell>{alerte.quartier?.nom ?? '—'}</TableCell>
                    <TableCell>{alerte.centreDon?.nom ?? '—'}</TableCell>
                    <TableCell>
                      <Badge variant={alerte.statut === 'OUVERTE' ? 'default' : 'secondary'}>{alerte.statut}</Badge>
                    </TableCell>
                    <TableCell>
                      {alerte._count?.reponses ?? 0}
                      {!!alerte._count?.notifications && (
                        <span className="text-muted-foreground">
                          {' '}
                          / {alerte._count.notifications} (
                          {Math.round(((alerte._count.reponses ?? 0) / alerte._count.notifications) * 100)}%)
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(alerte.dateCreation).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/admin/alertes/${alerte.id}`}>
                          <T>Voir les réponses</T>
                        </Link>
                      </Button>
                      {peutLancerAlertes && alerte.statut === 'OUVERTE' && (
                        <Button variant="outline" size="sm" onClick={() => fermer(alerte)}>
                          <T>Fermer</T>
                        </Button>
                      )}
                      {peutLancerAlertes && alerte.statut === 'FERMEE' && (
                        <Button variant="outline" size="sm" onClick={() => relancer(alerte)}>
                          <T>Relancer</T>
                        </Button>
                      )}
                      {peutLancerAlertes && (
                        <Button variant="outline" size="sm" onClick={() => handleDelete(alerte.id)}>
                          <Trash2Icon className="h-4 w-4" />
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
