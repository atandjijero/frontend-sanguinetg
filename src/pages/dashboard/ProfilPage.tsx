import { useEffect, useState } from 'react'
import { PencilIcon, StarIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui-shadcn/ui/card'
import { Badge } from '../../components/ui-shadcn/ui/badge'
import { Button } from '../../components/ui-shadcn/ui/button'
import { Input } from '../../components/ui-shadcn/ui/input'
import { Label } from '../../components/ui-shadcn/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui-shadcn/ui/select'
import { useAuth } from '../../context/AuthContext'
import { T, useTraduction } from '../../context/LanguageContext'
import { useApiData } from '../../hooks/useApiData'
import { api, ApiError } from '../../lib/api'
import { AGE_MAX_DON, AGE_MIN_DON, GROUPE_SANGUIN_LABELS } from '../../lib/constants'
import { calculerAge, dateIlYA } from '../../lib/date-format'
import { cn } from '@/lib/shadcn-utils'
import type { AvisDonneur, Quartier, Utilisateur } from '../../lib/types'

export default function ProfilPage() {
  const { user } = useAuth()
  const [edition, setEdition] = useState(false)
  const { data: quartiers } = useApiData<Quartier[]>('/quartiers')
  if (!user) return null

  const estDonneur = user.role === 'DONNEUR'
  const quartierNom = quartiers?.find((q) => q.id === user.quartierId)?.nom

  return (
    <div className="space-y-6">
      <Card className="max-w-xl">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
          <CardTitle>
            <T>Mon profil</T>
          </CardTitle>
          {!edition && (
            <Button variant="outline" size="sm" onClick={() => setEdition(true)}>
              <PencilIcon />
              <T>Modifier</T>
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {edition ? (
            <ModifierProfilForm user={user} estDonneur={estDonneur} quartiers={quartiers ?? []} onTermine={() => setEdition(false)} />
          ) : (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">
                  <T>Nom</T>
                </div>
                <div className="font-medium">
                  {user.prenom} {user.nom}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">
                  <T>Rôle</T>
                </div>
                <div className="font-medium">{user.role}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Email</div>
                <div className="font-medium">{user.email ?? '—'}</div>
              </div>
              <div>
                <div className="text-muted-foreground">
                  <T>Téléphone</T>
                </div>
                <div className="font-medium">{user.telephone ?? '—'}</div>
              </div>
              <div>
                <div className="text-muted-foreground">
                  <T>Date de naissance</T>
                </div>
                <div className="font-medium">
                  {user.dateNaissance ? (
                    `${new Date(user.dateNaissance).toLocaleDateString('fr-FR', { timeZone: 'UTC' })} (${calculerAge(user.dateNaissance)} ans)`
                  ) : (
                    <T>Non renseignée</T>
                  )}
                </div>
              </div>
              {estDonneur && (
                <>
                  <div>
                    <div className="text-muted-foreground">
                      <T>Groupe sanguin</T>
                    </div>
                    <div className="font-medium">
                      {user.groupeSanguin ? (
                        <Badge variant="outline">{GROUPE_SANGUIN_LABELS[user.groupeSanguin]}</Badge>
                      ) : (
                        <span className="text-muted-foreground"><T>Non renseigné, il sera saisi par le CNTS</T></span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">
                      <T>Zone à Lomé</T>
                    </div>
                    <div className="font-medium">{quartierNom ?? <T>Non renseignée</T>}</div>
                  </div>
                </>
              )}
              <div>
                <div className="text-muted-foreground">
                  <T>Statut</T>
                </div>
                <Badge variant={user.statut === 'ACTIF' ? 'default' : 'destructive'}>{user.statut}</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {estDonneur && <AvisSatisfactionCard />}
    </div>
  )
}

type ProfilField = 'nom' | 'prenom' | 'telephone' | 'dateNaissance' | 'quartierId'

function ModifierProfilForm({
  user,
  estDonneur,
  quartiers,
  onTermine,
}: {
  user: Utilisateur
  estDonneur: boolean
  quartiers: Quartier[]
  onTermine: () => void
}) {
  const { refreshUser } = useAuth()
  const [nom, setNom] = useState(user.nom)
  const [prenom, setPrenom] = useState(user.prenom)
  const [telephone, setTelephone] = useState(user.telephone ?? '')
  const [dateNaissance, setDateNaissance] = useState(user.dateNaissance?.slice(0, 10) ?? '')
  const [quartierId, setQuartierId] = useState(user.quartierId ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<ProfilField, string[]>>>({})
  const placeholderSelectionner = useTraduction('Sélectionner')

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setFormError(null)

    const erreurs: Partial<Record<ProfilField, string[]>> = {}
    if (!dateNaissance) {
      erreurs.dateNaissance = ['La date de naissance est obligatoire']
    } else {
      const age = calculerAge(dateNaissance)
      if (Number.isNaN(age) || age < AGE_MIN_DON) {
        erreurs.dateNaissance = [`Vous devez avoir au moins ${AGE_MIN_DON} ans`]
      } else if (estDonneur && age > AGE_MAX_DON) {
        erreurs.dateNaissance = [`Le don de sang est ouvert aux personnes de ${AGE_MIN_DON} à ${AGE_MAX_DON} ans`]
      }
    }
    if (!/^(\+228)?[0-9]{8}$/.test(telephone)) {
      erreurs.telephone = ['Le numéro de téléphone doit être un numéro togolais valide (8 chiffres, préfixe +228 optionnel)']
    }
    setFieldErrors(erreurs)
    if (Object.keys(erreurs).length > 0) return

    setSubmitting(true)
    try {
      await api.patch('/users/me', {
        nom,
        prenom,
        telephone,
        dateNaissance,
        quartierId: estDonneur ? quartierId || undefined : undefined,
      })
      await refreshUser()
      toast.success('Profil mis à jour')
      onTermine()
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors as Partial<Record<ProfilField, string[]>>)
        setFormError(Object.keys(err.fieldErrors).length ? null : err.message)
      } else {
        setFormError('Impossible de mettre à jour votre profil')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const erreursDe = (champ: ProfilField) =>
    fieldErrors[champ]?.map((message) => (
      <p key={message} className="text-sm text-destructive">
        <T>{message}</T>
      </p>
    ))

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label>
          <T>Nom</T>
        </Label>
        <Input value={nom} onChange={(e) => setNom(e.target.value)} required minLength={2} aria-invalid={Boolean(fieldErrors.nom?.length)} />
        {erreursDe('nom')}
      </div>
      <div className="space-y-1.5">
        <Label>
          <T>Prénom</T>
        </Label>
        <Input value={prenom} onChange={(e) => setPrenom(e.target.value)} required minLength={2} aria-invalid={Boolean(fieldErrors.prenom?.length)} />
        {erreursDe('prenom')}
      </div>
      <div className="space-y-1.5">
        <Label>
          <T>Téléphone</T>
        </Label>
        <Input
          type="tel"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          required
          placeholder="+22890123456"
          aria-invalid={Boolean(fieldErrors.telephone?.length)}
        />
        {erreursDe('telephone')}
      </div>
      <div className="space-y-1.5">
        <Label>
          <T>Date de naissance</T>
        </Label>
        <Input
          type="date"
          value={dateNaissance}
          onChange={(e) => setDateNaissance(e.target.value)}
          required
          min={estDonneur ? dateIlYA(AGE_MAX_DON + 1) : undefined}
          max={dateIlYA(AGE_MIN_DON)}
          aria-invalid={Boolean(fieldErrors.dateNaissance?.length)}
        />
        {erreursDe('dateNaissance')}
      </div>
      {estDonneur && (
        <div className="space-y-1.5">
          <Label>
            <T>Zone à Lomé</T>
          </Label>
          <Select value={quartierId} onValueChange={setQuartierId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholderSelectionner} />
            </SelectTrigger>
            <SelectContent>
              {quartiers.map((q) => (
                <SelectItem key={q.id} value={q.id}>
                  {q.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {erreursDe('quartierId')}
        </div>
      )}
      <p className="sm:col-span-2 text-xs text-muted-foreground">
        <T>
          {estDonneur
            ? "L'adresse email et le groupe sanguin ne peuvent pas être modifiés ici."
            : "L'adresse email et le rôle ne peuvent pas être modifiés ici."}
        </T>
      </p>
      <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={submitting}>
          <T>Enregistrer</T>
        </Button>
        <Button type="button" variant="outline" onClick={onTermine} disabled={submitting}>
          <T>Annuler</T>
        </Button>
        {formError && (
          <p className="text-sm text-destructive">
            <T>{formError}</T>
          </p>
        )}
      </div>
    </form>
  )
}

function AvisSatisfactionCard() {
  const [note, setNote] = useState(0)
  const [survol, setSurvol] = useState(0)
  const [commentaire, setCommentaire] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api
      .get<AvisDonneur | null>('/avis/moi')
      .then((avis) => {
        if (avis) {
          setNote(avis.note)
          setCommentaire(avis.commentaire ?? '')
        }
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (note === 0) return
    setSubmitting(true)
    try {
      await api.post('/avis', { note, commentaire: commentaire || undefined })
      toast.success('Merci pour votre avis !')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Impossible d'enregistrer votre avis")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>
          <T>Votre avis compte</T>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            <T>Que pensez-vous des informations et du suivi reçus depuis votre espace donneur ?</T>
          </p>
          <div className="flex gap-1" onMouseLeave={() => setSurvol(0)}>
            {[1, 2, 3, 4, 5].map((valeur) => (
              <button
                key={valeur}
                type="button"
                aria-label={`${valeur} étoile(s)`}
                onClick={() => setNote(valeur)}
                onMouseEnter={() => setSurvol(valeur)}
                className="p-0.5 transition-transform hover:scale-110"
              >
                <StarIcon
                  className={cn(
                    'h-7 w-7 transition-colors',
                    valeur <= (survol || note) ? 'fill-primary text-primary' : 'text-muted-foreground',
                  )}
                />
              </button>
            ))}
          </div>
          <textarea
            className="flex min-h-20 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Un commentaire (optionnel)"
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            maxLength={1000}
          />
          <Button type="submit" disabled={submitting || note === 0}>
            <T>Envoyer mon avis</T>
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
