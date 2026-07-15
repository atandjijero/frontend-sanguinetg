import { useState } from 'react'
import { PencilIcon, PlusIcon, StethoscopeIcon, Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { useConfirm } from '../../../context/ConfirmContext'
import { Button } from '../../../components/ui-shadcn/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui-shadcn/ui/card'
import { Badge } from '../../../components/ui-shadcn/ui/badge'
import { Input } from '../../../components/ui-shadcn/ui/input'
import { Label } from '../../../components/ui-shadcn/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui-shadcn/ui/select'
import { DataState } from '../../../components/dashboard/DataState'
import { PaginationControls } from '../../../components/dashboard/PaginationControls'
import { useApiData } from '../../../hooks/useApiData'
import { useClientPagination } from '../../../hooks/useClientPagination'
import { useAuth } from '../../../context/AuthContext'
import { api, ApiError } from '../../../lib/api'
import { CATEGORIE_CONSEIL_LABELS } from '../../../lib/constants'
import type { CategorieConseil, ConseilSante } from '../../../lib/types'

export default function ConseilsPage() {
  const confirm = useConfirm()
  const { user } = useAuth()
  const peutPublier = user?.role === 'MEDECIN'
  const peutGerer = user?.role === 'MEDECIN' || user?.role === 'ADMIN' || user?.role === 'SUPERADMIN'
  const { data: conseils, isLoading, error, refetch } = useApiData<ConseilSante[]>('/conseils')
  const { page, setPage, totalPages, pageItems, total } = useClientPagination(conseils ?? [], 6)

  const [titre, setTitre] = useState('')
  const [contenu, setContenu] = useState('')
  const [categorie, setCategorie] = useState<CategorieConseil | ''>('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault()
    if (!titre || !contenu || !categorie) return
    setSubmitting(true)
    setFormError(null)
    try {
      await api.post('/conseils', { titre, contenu, categorie })
      setTitre('')
      setContenu('')
      setCategorie('')
      await refetch()
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Impossible de publier ce conseil')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!(await confirm({ description: 'Supprimer ce conseil santé ?' }))) return
    try {
      await api.delete(`/conseils/${id}`)
      await refetch()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Suppression impossible')
    }
  }

  return (
    <div className="space-y-6">
      {peutPublier && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" /> Publier un conseil santé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Titre</Label>
                  <Input value={titre} onChange={(e) => setTitre(e.target.value)} required minLength={5} />
                </div>
                <div className="space-y-1.5">
                  <Label>Catégorie</Label>
                  <Select value={categorie} onValueChange={(v) => setCategorie(v as CategorieConseil)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORIE_CONSEIL_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Contenu</Label>
                <textarea
                  className="flex min-h-24 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={contenu}
                  onChange={(e) => setContenu(e.target.value)}
                  required
                  minLength={10}
                />
              </div>
              <Button type="submit" disabled={submitting}>
                Publier
              </Button>
              {formError && <p className="text-sm text-destructive">{formError}</p>}
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StethoscopeIcon className="h-4 w-4" /> Conseils publiés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DataState isLoading={isLoading} error={error} isEmpty={!conseils?.length} emptyLabel="Aucun conseil publié.">
            <div className="space-y-4">
              {pageItems.map((conseil) =>
                editId === conseil.id ? (
                  <ConseilEditForm
                    key={conseil.id}
                    conseil={conseil}
                    onSaved={async () => {
                      setEditId(null)
                      await refetch()
                    }}
                    onCancel={() => setEditId(null)}
                  />
                ) : (
                  <div key={conseil.id} className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-medium">{conseil.titre}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{CATEGORIE_CONSEIL_LABELS[conseil.categorie]}</Badge>
                        {peutGerer && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => setEditId(conseil.id)}>
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(conseil.id)}>
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{conseil.contenu}</p>
                    {conseil.validePar && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Validé par Dr. {conseil.validePar.prenom} {conseil.validePar.nom}
                      </p>
                    )}
                  </div>
                ),
              )}
            </div>
            <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} total={total} label="conseils" />
          </DataState>
        </CardContent>
      </Card>
    </div>
  )
}

function ConseilEditForm({
  conseil,
  onSaved,
  onCancel,
}: {
  conseil: ConseilSante
  onSaved: () => void | Promise<void>
  onCancel: () => void
}) {
  const [titre, setTitre] = useState(conseil.titre)
  const [contenu, setContenu] = useState(conseil.contenu)
  const [categorie, setCategorie] = useState<CategorieConseil>(conseil.categorie)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await api.patch(`/conseils/${conseil.id}`, { titre, contenu, categorie })
      await onSaved()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Enregistrement impossible')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Titre</Label>
          <Input value={titre} onChange={(e) => setTitre(e.target.value)} required minLength={5} />
        </div>
        <div className="space-y-1.5">
          <Label>Catégorie</Label>
          <Select value={categorie} onValueChange={(v) => setCategorie(v as CategorieConseil)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORIE_CONSEIL_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Contenu</Label>
        <textarea
          className="flex min-h-24 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          required
          minLength={10}
        />
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={submitting}>
          Enregistrer
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Annuler
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  )
}
