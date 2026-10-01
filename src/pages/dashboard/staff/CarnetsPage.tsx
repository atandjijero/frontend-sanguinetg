import { useEffect, useState } from 'react'
import { BookHeartIcon, PlusIcon } from 'lucide-react'
import { Button } from '../../../components/ui-shadcn/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui-shadcn/ui/card'
import { Badge } from '../../../components/ui-shadcn/ui/badge'
import { Input } from '../../../components/ui-shadcn/ui/input'
import { Label } from '../../../components/ui-shadcn/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui-shadcn/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui-shadcn/ui/table'
import { DataState } from '../../../components/dashboard/DataState'
import { PaginationControls } from '../../../components/dashboard/PaginationControls'
import { useApiData } from '../../../hooks/useApiData'
import { useClientPagination } from '../../../hooks/useClientPagination'
import { useAuth } from '../../../context/AuthContext'
import { api, ApiError } from '../../../lib/api'
import { GROUPE_SANGUIN_LABELS, TYPE_RECOMPENSE_LABELS } from '../../../lib/constants'
import { T, useTraduction } from '../../../context/LanguageContext'
import type { CarnetDigital, CentreDon, Recompense, ReponseEnAttente, Utilisateur } from '../../../lib/types'

const SANS_ALERTE = '__sans_alerte__'

export default function CarnetsPage() {
  const { user } = useAuth()
  const peutVoirDonneurs =
    user?.role === 'SUPERADMIN' || user?.role === 'ADMIN' || user?.role === 'AGENT_CNTS' || user?.role === 'MEDECIN'

  const { data: carnets, isLoading, error, refetch } = useApiData<CarnetDigital[]>('/carnets')
  const { page, setPage, totalPages, pageItems, total } = useClientPagination(carnets ?? [], 6)
  const { data: donneurs } = useApiData<Utilisateur[]>(peutVoirDonneurs ? '/users?role=DONNEUR' : null)
  const { data: centres } = useApiData<CentreDon[]>('/centres-don')
  const { data: recompenses } = useApiData<Recompense[]>('/recompenses')

  const recompensesParDonneur = new Map<string, Recompense[]>()
  for (const r of recompenses ?? []) {
    const liste = recompensesParDonneur.get(r.donneurId) ?? []
    liste.push(r)
    recompensesParDonneur.set(r.donneurId, liste)
  }

  const [donneurId, setDonneurId] = useState('')
  const [dateDon, setDateDon] = useState(() => new Date().toISOString().slice(0, 10))
  const [centreDonId, setCentreDonId] = useState('')
  const [reponseId, setReponseId] = useState(SANS_ALERTE)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const placeholderSelectionner = useTraduction('Sélectionner')
  const donneurSelectionne = (donneurs ?? []).find((donneur) => donneur.id === donneurId)
  const { data: reponsesEnAttente, refetch: refetchReponses } = useApiData<ReponseEnAttente[]>(
    donneurId ? `/alertes/donneurs/${donneurId}/reponses-en-attente` : null,
  )
  const reponsesDuDonneur = donneurId ? reponsesEnAttente ?? [] : []
  const reponseSelectionnee = reponsesDuDonneur.find((r) => r.id === reponseId)

  const centreDuQuartier = donneurSelectionne?.quartierId
    ? (centres ?? []).find((centre) => centre.quartierId === donneurSelectionne.quartierId)
    : undefined
  const centreAssocie = reponseSelectionnee?.alerte.centreDon ?? centreDuQuartier

  useEffect(() => {
    setReponseId(reponsesDuDonneur[0]?.id ?? SANS_ALERTE)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [donneurId, reponsesEnAttente])

  useEffect(() => {
    setCentreDonId(centreAssocie?.id ?? '')
  }, [centreAssocie?.id])

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault()
    if (!donneurId || !dateDon || !centreDonId) return
    setSubmitting(true)
    setFormError(null)
    try {
      await api.post('/carnets', {
        donneurId,
        dateDon,
        centreDonId,
        reponseId: reponseSelectionnee?.id,
      })
      setDonneurId('')
      await Promise.all([refetch(), refetchReponses()])
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Impossible d'enregistrer ce don")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {peutVoirDonneurs && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" /> <T>Enregistrer un don</T>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-4">
              <div className="space-y-1.5">
                <Label>
                  <T>Donneur</T>
                </Label>
                <Select value={donneurId} onValueChange={setDonneurId}>
                  <SelectTrigger className="w-56">
                    <SelectValue placeholder={placeholderSelectionner} />
                  </SelectTrigger>
                  <SelectContent>
                    {(donneurs ?? []).map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.prenom} {d.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {reponsesDuDonneur.length > 0 && (
                <div className="space-y-1.5">
                  <Label>
                    <T>Alerte concernée</T>
                  </Label>
                  <Select value={reponseId} onValueChange={setReponseId}>
                    <SelectTrigger className="w-72">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reponsesDuDonneur.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {GROUPE_SANGUIN_LABELS[r.alerte.groupeSanguinRequis]} · {r.alerte.centreDon?.nom ?? r.alerte.quartier?.nom ?? '—'} ·{' '}
                          {new Date(r.alerte.dateCreation).toLocaleDateString('fr-FR')}
                        </SelectItem>
                      ))}
                      <SelectItem value={SANS_ALERTE}>
                        <T>Aucune (don spontané)</T>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-1.5">
                <Label>
                  <T>Date du don</T>
                </Label>
                <Input
                  type="date"
                  value={dateDon}
                  onChange={(e) => setDateDon(e.target.value)}
                  max={new Date().toISOString().slice(0, 10)}
                  required
                  className="w-40"
                />
              </div>
              <div className="space-y-1.5">
                <Label>
                  <T>Centre de don associé</T>
                </Label>
                <div className="flex h-10 w-64 items-center rounded-md border border-input bg-muted px-3 text-sm">
                  {centreAssocie?.nom ?? <T>Sélectionnez d'abord un donneur avec un quartier associé</T>}
                </div>
              </div>
              <Button type="submit" disabled={submitting || !centreDonId}>
                <T>Enregistrer</T>
              </Button>
              {formError && (
                <p className="text-sm text-destructive w-full">
                  <T>{formError}</T>
                </p>
              )}
            </form>
            <p className="mt-3 text-xs text-muted-foreground">
              <T>
                Si le donneur a répondu « Je viens » à une alerte, elle est sélectionnée automatiquement : le centre de
                l'alerte est repris et le don est relié à sa réponse. Sinon, le centre de son quartier est utilisé.
              </T>
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookHeartIcon className="h-4 w-4" /> <T>Carnets de don</T>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataState isLoading={isLoading} error={error} isEmpty={!carnets?.length} emptyLabel="Aucun don enregistré pour le moment.">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <T>Donneur</T>
                  </TableHead>
                  <TableHead>
                    <T>Date du don</T>
                  </TableHead>
                  <TableHead>
                    <T>Centre</T>
                  </TableHead>
                  <TableHead>
                    <T>Rappel prochain don</T>
                  </TableHead>
                  <TableHead>
                    <T>Récompense</T>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((carnet) => {
                  const recompensesDonneur = recompensesParDonneur.get(carnet.donneurId) ?? []
                  return (
                    <TableRow key={carnet.id}>
                      <TableCell className="font-medium">
                        {carnet.donneur ? `${carnet.donneur.prenom} ${carnet.donneur.nom}` : '—'}
                      </TableCell>
                      <TableCell>{new Date(carnet.dateDon).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>{carnet.centreDon?.nom ?? '—'}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {carnet.rappelProchaineDate ? new Date(carnet.rappelProchaineDate).toLocaleDateString('fr-FR') : '—'}
                      </TableCell>
                      <TableCell className="space-x-1">
                        {recompensesDonneur.length > 0 ? (
                          recompensesDonneur.map((r) => (
                            <Badge key={r.id} variant="outline">
                              {TYPE_RECOMPENSE_LABELS[r.type]}
                            </Badge>
                          ))
                        ) : (
                          '—'
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} total={total} label="dons" />
          </DataState>
        </CardContent>
      </Card>
    </div>
  )
}
