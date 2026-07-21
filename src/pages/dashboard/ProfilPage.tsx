import { useEffect, useState } from 'react'
import { StarIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui-shadcn/ui/card'
import { Badge } from '../../components/ui-shadcn/ui/badge'
import { Button } from '../../components/ui-shadcn/ui/button'
import { useAuth } from '../../context/AuthContext'
import { T } from '../../context/LanguageContext'
import { api, ApiError } from '../../lib/api'
import { cn } from '@/lib/shadcn-utils'
import type { AvisDonneur } from '../../lib/types'

const GROUPE_LABELS: Record<string, string> = {
  A_POSITIF: 'A+',
  A_NEGATIF: 'A-',
  B_POSITIF: 'B+',
  B_NEGATIF: 'B-',
  AB_POSITIF: 'AB+',
  AB_NEGATIF: 'AB-',
  O_POSITIF: 'O+',
  O_NEGATIF: 'O-',
}

export default function ProfilPage() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <div className="space-y-6">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>
            <T>Mon profil</T>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            {user.role === 'DONNEUR' && (
              <div>
                <div className="text-muted-foreground">
                  <T>Groupe sanguin</T>
                </div>
                <div className="font-medium">
                  {user.groupeSanguin ? (
                    <Badge variant="outline">{GROUPE_LABELS[user.groupeSanguin]}</Badge>
                  ) : (
                    <T>Non renseigné</T>
                  )}
                </div>
              </div>
            )}
            <div>
              <div className="text-muted-foreground">
                <T>Statut</T>
              </div>
              <Badge variant={user.statut === 'ACTIF' ? 'default' : 'destructive'}>{user.statut}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      {user.role === 'DONNEUR' && <AvisSatisfactionCard />}
    </div>
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
