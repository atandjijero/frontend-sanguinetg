import { useState } from 'react'
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
import { TYPE_RECOMPENSE_LABELS } from '../../../lib/constants'
import type { CarnetDigital, CentreDon, Recompense, Utilisateur } from '../../../lib/types'

export default function CarnetsPage() {
  const { user } = useAuth()
  const peutVoirDonneurs = user?.role === 'SUPERADMIN' || user?.role === 'ADMIN' || user?.role === 'AGENT_CNTS'

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
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault()
    if (!donneurId || !dateDon || !centreDonId) return
    setSubmitting(true)
    setFormError(null)
    try {
      await api.post('/carnets', { donneurId, dateDon, centreDonId })
      setDonneurId('')
      await refetch()
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
              <PlusIcon className="h-4 w-4" /> Enregistrer un don (sans alerte préalable)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-4">
              <div className="space-y-1.5">
                <Label>Donneur</Label>
                <Select value={donneurId} onValueChange={setDonneurId}>
                  <SelectTrigger className="w-56">
                    <SelectValue placeholder="Sélectionner" />
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
              <div className="space-y-1.5">
                <Label>Date du don</Label>
                <Input type="date" value={dateDon} onChange={(e) => setDateDon(e.target.value)} required className="w-40" />
              </div>
              <div className="space-y-1.5">
                <Label>Centre de don</Label>
                <Select value={centreDonId} onValueChange={setCentreDonId}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {(centres ?? []).map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={submitting}>
                Enregistrer
              </Button>
              {formError && <p className="text-sm text-destructive w-full">{formError}</p>}
            </form>
            <p className="mt-3 text-xs text-muted-foreground">
              Pour un don faisant suite à une alerte, préférez « Enregistrer le don » depuis le détail de l'alerte
              (page Alertes) : il relie automatiquement la réponse du donneur au carnet.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookHeartIcon className="h-4 w-4" /> Carnets de don
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataState isLoading={isLoading} error={error} isEmpty={!carnets?.length} emptyLabel="Aucun don enregistré pour le moment.">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donneur</TableHead>
                  <TableHead>Date du don</TableHead>
                  <TableHead>Centre</TableHead>
                  <TableHead>Rappel prochain don</TableHead>
                  <TableHead>Récompense</TableHead>
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
