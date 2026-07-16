import { useState } from 'react'
import { GiftIcon, PlusIcon } from 'lucide-react'
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
import { T, useTraduction } from '../../../context/LanguageContext'
import type { Recompense, TypeRecompense, Utilisateur } from '../../../lib/types'

const STATUT_VARIANT: Record<Recompense['statut'], 'default' | 'secondary' | 'destructive'> = {
  ATTRIBUEE: 'default',
  UTILISEE: 'secondary',
  EXPIREE: 'destructive',
}

export default function RecompensesPage() {
  const { user } = useAuth()
  const peutAttribuer = user?.role === 'ADMIN' || user?.role === 'AGENT_CNTS'

  const { data: recompenses, isLoading, error, refetch } = useApiData<Recompense[]>('/recompenses')
  const { data: donneurs } = useApiData<Utilisateur[]>(peutAttribuer ? '/users?role=DONNEUR' : null)
  const { page, setPage, totalPages, pageItems, total } = useClientPagination(recompenses ?? [], 6)

  const [donneurId, setDonneurId] = useState('')
  const [type, setType] = useState<TypeRecompense | ''>('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const placeholderSelectionner = useTraduction('Sélectionner')
  const placeholderDescription = useTraduction('Kit de vivres (riz, huile, conserves)')

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault()
    if (!donneurId || !type || !description) return
    setSubmitting(true)
    setFormError(null)
    try {
      await api.post('/recompenses', { donneurId, type, description })
      setDonneurId('')
      setType('')
      setDescription('')
      await refetch()
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Impossible d\'attribuer cette récompense')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {peutAttribuer && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" /> <T>Attribuer une récompense</T>
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
              <div className="space-y-1.5">
                <Label>
                  <T>Type</T>
                </Label>
                <Select value={type} onValueChange={(v) => setType(v as TypeRecompense)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={placeholderSelectionner} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TYPE_RECOMPENSE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        <T>{label}</T>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>
                  <T>Description</T>
                </Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={placeholderDescription}
                  required
                  className="w-72"
                />
              </div>
              <Button type="submit" disabled={submitting}>
                <T>Attribuer</T>
              </Button>
              {formError && (
                <p className="text-sm text-destructive w-full">
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
            <GiftIcon className="h-4 w-4" /> <T>Récompenses attribuées</T>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataState isLoading={isLoading} error={error} isEmpty={!recompenses?.length} emptyLabel="Aucune récompense attribuée.">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <T>Donneur</T>
                  </TableHead>
                  <TableHead>
                    <T>Type</T>
                  </TableHead>
                  <TableHead>
                    <T>Description</T>
                  </TableHead>
                  <TableHead>
                    <T>Statut</T>
                  </TableHead>
                  <TableHead>
                    <T>Date</T>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">
                      {r.donneur ? `${r.donneur.prenom} ${r.donneur.nom}` : '—'}
                    </TableCell>
                    <TableCell>
                      <T>{TYPE_RECOMPENSE_LABELS[r.type]}</T>
                    </TableCell>
                    <TableCell>{r.description}</TableCell>
                    <TableCell>
                      <Badge variant={STATUT_VARIANT[r.statut]}>{r.statut}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(r.dateAttribution).toLocaleDateString('fr-FR')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} total={total} label="récompenses" />
          </DataState>
        </CardContent>
      </Card>
    </div>
  )
}
