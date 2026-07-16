import { Fragment, useState } from 'react'
import { Building2Icon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { useConfirm } from '../../../context/ConfirmContext'
import { Button } from '../../../components/ui-shadcn/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui-shadcn/ui/card'
import { Input } from '../../../components/ui-shadcn/ui/input'
import { Label } from '../../../components/ui-shadcn/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui-shadcn/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui-shadcn/ui/table'
import { DataState } from '../../../components/dashboard/DataState'
import { PaginationControls } from '../../../components/dashboard/PaginationControls'
import { useApiData } from '../../../hooks/useApiData'
import { useClientPagination } from '../../../hooks/useClientPagination'
import { api, ApiError } from '../../../lib/api'
import { T, useTraduction } from '../../../context/LanguageContext'
import type { CentreDon, Quartier } from '../../../lib/types'

const AUCUN_QUARTIER = '__aucun__'

export default function CentresDonPage() {
  const confirm = useConfirm()
  const { data: centres, isLoading, error, refetch } = useApiData<CentreDon[]>('/centres-don')
  const { data: quartiers } = useApiData<Quartier[]>('/quartiers')
  const { page, setPage, totalPages, pageItems, total } = useClientPagination(centres ?? [], 6)

  const [editId, setEditId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!(await confirm({ description: 'Supprimer ce centre de don ?' }))) return
    try {
      await api.delete(`/centres-don/${id}`)
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
            <PlusIcon className="h-4 w-4" /> <T>Ajouter un centre de collecte</T>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CentreDonForm quartiers={quartiers ?? []} onSaved={refetch} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2Icon className="h-4 w-4" /> <T>Centres de collecte</T>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataState isLoading={isLoading} error={error} isEmpty={!centres?.length}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <T>Nom</T>
                  </TableHead>
                  <TableHead>
                    <T>Quartier</T>
                  </TableHead>
                  <TableHead>
                    <T>Coordonnées</T>
                  </TableHead>
                  <TableHead className="text-right">
                    <T>Actions</T>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((centre) => (
                  <Fragment key={centre.id}>
                    <TableRow>
                      <TableCell className="font-medium">{centre.nom}</TableCell>
                      <TableCell>{centre.quartier?.nom ?? '—'}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {centre.latitude && centre.longitude ? (
                          `${centre.latitude.toFixed(4)}, ${centre.longitude.toFixed(4)}`
                        ) : (
                          <T>Non géolocalisé</T>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditId(editId === centre.id ? null : centre.id)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(centre.id)}>
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    {editId === centre.id && (
                      <TableRow>
                        <TableCell colSpan={4} className="bg-muted/30">
                          <CentreDonForm
                            quartiers={quartiers ?? []}
                            centre={centre}
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
            <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} total={total} label="centres" />
          </DataState>
        </CardContent>
      </Card>
    </div>
  )
}

function CentreDonForm({
  quartiers,
  centre,
  onSaved,
  onCancel,
}: {
  quartiers: Quartier[]
  centre?: CentreDon
  onSaved: () => void | Promise<void>
  onCancel?: () => void
}) {
  const [nom, setNom] = useState(centre?.nom ?? '')
  const [adresse, setAdresse] = useState(centre?.adresse ?? '')
  const [quartierId, setQuartierId] = useState(centre?.quartierId ?? AUCUN_QUARTIER)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!nom) return
    setSubmitting(true)
    setError(null)
    const payload = {
      nom,
      adresse: adresse || undefined,
      quartierId: quartierId === AUCUN_QUARTIER ? undefined : quartierId,
    }
    try {
      if (centre) {
        await api.patch(`/centres-don/${centre.id}`, payload)
      } else {
        await api.post('/centres-don', payload)
        setNom('')
        setAdresse('')
        setQuartierId(AUCUN_QUARTIER)
      }
      await onSaved()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Enregistrement impossible')
    } finally {
      setSubmitting(false)
    }
  }

  const placeholderSelectionner = useTraduction('Sélectionner')

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4 py-2">
      <div className="space-y-1.5">
        <Label>
          <T>Nom du centre</T>
        </Label>
        <Input value={nom} onChange={(e) => setNom(e.target.value)} required minLength={2} className="w-64" />
      </div>
      <div className="space-y-1.5">
        <Label>
          <T>Adresse (optionnel)</T>
        </Label>
        <Input value={adresse} onChange={(e) => setAdresse(e.target.value)} className="w-64" />
      </div>
      <div className="space-y-1.5">
        <Label>
          <T>Quartier (optionnel)</T>
        </Label>
        <Select value={quartierId} onValueChange={setQuartierId}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder={placeholderSelectionner} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={AUCUN_QUARTIER}>
              <T>Aucun</T>
            </SelectItem>
            {quartiers.map((q) => (
              <SelectItem key={q.id} value={q.id}>
                {q.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={submitting}>
        <T>{centre ? 'Enregistrer' : 'Ajouter'}</T>
      </Button>
      {onCancel && (
        <Button type="button" variant="ghost" onClick={onCancel}>
          <T>Annuler</T>
        </Button>
      )}
      {error && (
        <p className="w-full text-sm text-destructive">
          <T>{error}</T>
        </p>
      )}
      {!centre && (
        <p className="w-full text-xs text-muted-foreground">
          <T>
            Les coordonnées GPS sont détectées automatiquement (nom + quartier, Lomé) si elles existent sur la
            carte.
          </T>
        </p>
      )}
    </form>
  )
}
