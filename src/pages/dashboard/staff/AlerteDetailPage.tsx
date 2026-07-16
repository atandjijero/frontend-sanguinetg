import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeftIcon, CheckCircle2Icon, GiftIcon } from 'lucide-react'
import { Button } from '../../../components/ui-shadcn/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui-shadcn/ui/card'
import { Badge } from '../../../components/ui-shadcn/ui/badge'
import { Input } from '../../../components/ui-shadcn/ui/input'
import { Label } from '../../../components/ui-shadcn/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui-shadcn/ui/select'
import { DataState } from '../../../components/dashboard/DataState'
import { useApiData } from '../../../hooks/useApiData'
import { useAuth } from '../../../context/AuthContext'
import { api, ApiError } from '../../../lib/api'
import { GROUPE_SANGUIN_LABELS, TYPE_RECOMPENSE_LABELS } from '../../../lib/constants'
import { T, useTraduction } from '../../../context/LanguageContext'
import type { Alerte, CarnetDigital, CentreDon, ReponseAvecDonneur, TypeRecompense } from '../../../lib/types'

type FormulaireOuvert = { type: 'don'; reponseId: string } | { type: 'recompense'; carnetId: string; donneurId: string } | null

export default function AlerteDetailPage() {
  const { user } = useAuth()
  const peutAttribuerRecompense = user?.role !== 'SUPERADMIN'
  const { id } = useParams<{ id: string }>()
  const { data: alerte, isLoading: loadingAlerte } = useApiData<Alerte>(id ? `/alertes/${id}` : null)
  const { data: reponses, isLoading: loadingReponses, refetch: refetchReponses } = useApiData<ReponseAvecDonneur[]>(
    id ? `/alertes/${id}/reponses` : null,
  )
  const { data: carnets, refetch: refetchCarnets } = useApiData<CarnetDigital[]>('/carnets')

  const carnetParReponse = useMemo(() => {
    const map = new Map<string, CarnetDigital>()
    for (const c of carnets ?? []) {
      if (c.reponseId) map.set(c.reponseId, c)
    }
    return map
  }, [carnets])

  const [formulaire, setFormulaire] = useState<FormulaireOuvert>(null)

  async function actualiser() {
    await Promise.all([refetchReponses(), refetchCarnets()])
    setFormulaire(null)
  }

  return (
    <div className="space-y-6">
      <Link to="/admin/alertes" className="inline-flex items-center gap-1 text-sm text-secondary hover:text-primary">
        <ArrowLeftIcon className="h-4 w-4" /> <T>Retour aux alertes</T>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>
            {loadingAlerte || !alerte ? (
              <T>Détail de l'alerte</T>
            ) : (
              `Alerte ${GROUPE_SANGUIN_LABELS[alerte.groupeSanguinRequis]} — ${alerte.quartier?.nom ?? ''}`
            )}
          </CardTitle>
        </CardHeader>
        {alerte && (
          <CardContent className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <Badge variant={alerte.statut === 'OUVERTE' ? 'default' : 'secondary'}>{alerte.statut}</Badge>
            <span>
              <T>Créée le</T> {new Date(alerte.dateCreation).toLocaleString('fr-FR')}
            </span>
            {alerte.centreDon && (
              <span>
                <T>Centre :</T> {alerte.centreDon.nom}
              </span>
            )}
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <T>Réponses des donneurs</T>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataState
            isLoading={loadingReponses}
            error={null}
            isEmpty={!reponses?.length}
            emptyLabel="Aucune réponse pour le moment."
          >
            <div className="space-y-3">
              {reponses?.map((reponse) => {
                const carnet = carnetParReponse.get(reponse.id)
                return (
                  <div key={reponse.id} className="rounded-lg border border-border p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="font-medium">
                          {reponse.donneur.prenom} {reponse.donneur.nom}
                          {reponse.donneur.groupeSanguin && (
                            <Badge variant="outline" className="ml-2">
                              {GROUPE_SANGUIN_LABELS[reponse.donneur.groupeSanguin]}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {reponse.donneur.telephone ?? <T>Téléphone non renseigné</T>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant={reponse.statut === 'JE_VIENS' ? 'default' : 'secondary'}>
                          <T>{reponse.statut === 'JE_VIENS' ? 'Vient' : 'Indisponible'}</T>
                        </Badge>

                        {reponse.statut === 'JE_VIENS' && !carnet && (
                          <Button size="sm" onClick={() => setFormulaire({ type: 'don', reponseId: reponse.id })}>
                            <T>Enregistrer le don</T>
                          </Button>
                        )}

                        {carnet && (
                          <span className="inline-flex items-center gap-1 text-sm text-tertiary">
                            <CheckCircle2Icon className="h-4 w-4" /> <T>Don enregistré</T>
                          </span>
                        )}

                        {carnet && !carnet.recompenseId && peutAttribuerRecompense && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setFormulaire({ type: 'recompense', carnetId: carnet.id, donneurId: reponse.donneur.id })}
                          >
                            <GiftIcon className="h-4 w-4" /> <T>Récompenser</T>
                          </Button>
                        )}
                      </div>
                    </div>

                    {formulaire?.type === 'don' && formulaire.reponseId === reponse.id && (
                      <EnregistrerDonForm
                        donneurId={reponse.donneur.id}
                        reponseId={reponse.id}
                        centreDonIdParDefaut={alerte?.centreDonId ?? undefined}
                        onAnnuler={() => setFormulaire(null)}
                        onEnregistre={actualiser}
                      />
                    )}
                    {formulaire?.type === 'recompense' && carnet && formulaire.carnetId === carnet.id && (
                      <AttribuerRecompenseForm
                        donneurId={formulaire.donneurId}
                        carnetId={formulaire.carnetId}
                        onAnnuler={() => setFormulaire(null)}
                        onAttribue={actualiser}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </DataState>
        </CardContent>
      </Card>
    </div>
  )
}

function EnregistrerDonForm({
  donneurId,
  reponseId,
  centreDonIdParDefaut,
  onAnnuler,
  onEnregistre,
}: {
  donneurId: string
  reponseId: string
  centreDonIdParDefaut?: string
  onAnnuler: () => void
  onEnregistre: () => void
}) {
  const { data: centres } = useApiData<CentreDon[]>('/centres-don')
  const [centreDonId, setCentreDonId] = useState(centreDonIdParDefaut ?? '')
  const [dateDon, setDateDon] = useState(() => new Date().toISOString().slice(0, 10))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const placeholderSelectionner = useTraduction('Sélectionner')

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!centreDonId) return
    setSubmitting(true)
    setError(null)
    try {
      await api.post('/carnets', { donneurId, reponseId, centreDonId, dateDon })
      onEnregistre()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Impossible d'enregistrer ce don")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-wrap items-end gap-3 border-t border-border pt-4">
      <div className="space-y-1.5">
        <Label>
          <T>Date du don</T>
        </Label>
        <Input type="date" value={dateDon} onChange={(e) => setDateDon(e.target.value)} required className="w-40" />
      </div>
      <div className="space-y-1.5">
        <Label>
          <T>Centre de don</T>
        </Label>
        <Select value={centreDonId} onValueChange={setCentreDonId}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder={placeholderSelectionner} />
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
      <Button type="submit" size="sm" disabled={submitting}>
        <T>Confirmer</T>
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={onAnnuler}>
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

function AttribuerRecompenseForm({
  donneurId,
  carnetId,
  onAnnuler,
  onAttribue,
}: {
  donneurId: string
  carnetId: string
  onAnnuler: () => void
  onAttribue: () => void
}) {
  const [type, setType] = useState<TypeRecompense | ''>('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const placeholderSelectionner = useTraduction('Sélectionner')
  const placeholderDescription = useTraduction('Kit de vivres (riz, huile, conserves)')

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!type || !description) return
    setSubmitting(true)
    setError(null)
    try {
      const recompense = await api.post<{ id: string }>('/recompenses', { donneurId, type, description })
      await api.patch(`/carnets/${carnetId}`, { recompenseId: recompense.id })
      onAttribue()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Impossible d'attribuer cette récompense")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-wrap items-end gap-3 border-t border-border pt-4">
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
      <Button type="submit" size="sm" disabled={submitting}>
        <T>Attribuer</T>
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={onAnnuler}>
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
