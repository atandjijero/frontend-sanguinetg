import { Fragment, useState } from 'react'
import { MapPinIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { useConfirm } from '../../../context/ConfirmContext'
import { Button } from '../../../components/ui-shadcn/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui-shadcn/ui/card'
import { Input } from '../../../components/ui-shadcn/ui/input'
import { Label } from '../../../components/ui-shadcn/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui-shadcn/ui/table'
import { DataState } from '../../../components/dashboard/DataState'
import { PaginationControls } from '../../../components/dashboard/PaginationControls'
import { useApiData } from '../../../hooks/useApiData'
import { useClientPagination } from '../../../hooks/useClientPagination'
import { api, ApiError } from '../../../lib/api'
import { T } from '../../../context/LanguageContext'
import type { Quartier } from '../../../lib/types'

export default function QuartiersPage() {
  const confirm = useConfirm()
  const { data: quartiers, isLoading, error, refetch } = useApiData<Quartier[]>('/quartiers')
  const { page, setPage, totalPages, pageItems, total } = useClientPagination(quartiers ?? [], 6)
  const [nom, setNom] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault()
    if (!nom) return
    setSubmitting(true)
    setFormError(null)
    try {
      await api.post('/quartiers', { nom })
      setNom('')
      await refetch()
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Impossible de créer ce quartier')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!(await confirm({ description: 'Supprimer ce quartier ?' }))) return
    try {
      await api.delete(`/quartiers/${id}`)
      await refetch()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Suppression impossible')
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" /> <T>Ajouter un quartier</T>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="flex items-end gap-4">
            <div className="space-y-1.5">
              <Label>
                <T>Nom du quartier</T>
              </Label>
              <Input value={nom} onChange={(e) => setNom(e.target.value)} required minLength={2} className="w-64" />
            </div>
            <Button type="submit" disabled={submitting}>
              <T>Ajouter</T>
            </Button>
            {formError && (
              <p className="text-sm text-destructive">
                <T>{formError}</T>
              </p>
            )}
          </form>
          <p className="mt-3 text-xs text-muted-foreground">
            <T>Les coordonnées GPS sont détectées automatiquement si le quartier existe sur la carte de Lomé.</T>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4" /> <T>Quartiers de Lomé</T>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataState isLoading={isLoading} error={error} isEmpty={!quartiers?.length}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <T>Nom</T>
                  </TableHead>
                  <TableHead>
                    <T>Latitude</T>
                  </TableHead>
                  <TableHead>
                    <T>Longitude</T>
                  </TableHead>
                  <TableHead className="text-right">
                    <T>Actions</T>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((q) => (
                  <Fragment key={q.id}>
                    <TableRow>
                      <TableCell className="font-medium">{q.nom}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {q.latitude ?? <T>Non géolocalisé</T>}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{q.longitude ?? '—'}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setEditId(editId === q.id ? null : q.id)}>
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(q.id)}>
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    {editId === q.id && (
                      <TableRow>
                        <TableCell colSpan={4} className="bg-muted/30">
                          <QuartierEditForm
                            quartier={q}
                            onSaved={async () => {
                              setEditId(null)
                              await refetch()
                            }}
                            onCancel={() => setEditId(null)}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
            <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} total={total} label="quartiers" />
          </DataState>
        </CardContent>
      </Card>
    </div>
  )
}

function QuartierEditForm({
  quartier,
  onSaved,
  onCancel,
}: {
  quartier: Quartier
  onSaved: () => void | Promise<void>
  onCancel: () => void
}) {
  const [nom, setNom] = useState(quartier.nom)
  const [latitude, setLatitude] = useState(quartier.latitude?.toString() ?? '')
  const [longitude, setLongitude] = useState(quartier.longitude?.toString() ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await api.patch(`/quartiers/${quartier.id}`, {
        nom,
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
      })
      await onSaved()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Enregistrement impossible')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4 py-2">
      <div className="space-y-1.5">
        <Label>
          <T>Nom</T>
        </Label>
        <Input value={nom} onChange={(e) => setNom(e.target.value)} required minLength={2} className="w-48" />
      </div>
      <div className="space-y-1.5">
        <Label>
          <T>Latitude</T>
        </Label>
        <Input type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="w-32" />
      </div>
      <div className="space-y-1.5">
        <Label>
          <T>Longitude</T>
        </Label>
        <Input type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="w-32" />
      </div>
      <Button type="submit" disabled={submitting}>
        <T>Enregistrer</T>
      </Button>
      <Button type="button" variant="ghost" onClick={onCancel}>
        <T>Annuler</T>
      </Button>
      {error && (
        <p className="w-full text-sm text-destructive">
          <T>{error}</T>
        </p>
      )}
    </form>
  )
}
