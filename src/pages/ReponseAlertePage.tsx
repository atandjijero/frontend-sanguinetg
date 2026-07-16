import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, HeartHandshake, LogIn, XCircle } from 'lucide-react'
import Button from '../components/ui/Button'
import { api, ApiError } from '../lib/api'
import { GROUPE_SANGUIN_LABELS } from '../lib/constants'
import { T } from '../context/LanguageContext'
import type { GroupeSanguin, StatutReponse } from '../lib/types'

interface Apercu {
  prenom: string
  groupeSanguinRequis: GroupeSanguin
  quartierNom: string
  centreNom: string | null
  centreAdresse: string | null
  alerteOuverte: boolean
  maReponse: StatutReponse | null
}

export default function ReponseAlertePage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const statutSuggere = searchParams.get('statut') as StatutReponse | null

  const [apercu, setApercu] = useState<Apercu | null>(null)
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState<string | null>(null)
  const [envoi, setEnvoi] = useState(false)
  const [reponseEnvoyee, setReponseEnvoyee] = useState<StatutReponse | null>(null)

  useEffect(() => {
    if (!token) {
      setErreur('Lien de réponse invalide.')
      setChargement(false)
      return
    }
    api
      .get<Apercu>(`/alertes/reponse-email/apercu?token=${encodeURIComponent(token)}`)
      .then((data) => setApercu(data))
      .catch((err) => setErreur(err instanceof ApiError ? err.message : 'Ce lien de réponse est invalide ou a expiré.'))
      .finally(() => setChargement(false))
  }, [token])

  async function repondre(statut: StatutReponse) {
    setEnvoi(true)
    setErreur(null)
    try {
      await api.post('/alertes/reponse-email', { token, statut })
      setReponseEnvoyee(statut)
    } catch (err) {
      setErreur(err instanceof ApiError ? err.message : 'Impossible d\'enregistrer votre réponse, réessayez.')
    } finally {
      setEnvoi(false)
    }
  }

  return (
    <section className="pt-16 pb-20">
      <div className="max-w-md mx-auto px-margin-mobile md:px-margin-desktop text-center mb-10">
        <h1 className="font-headline-lg text-headline-lg mb-3">
          <T>Réponse à l'alerte</T>
        </h1>
        <p className="text-secondary">
          <T>Merci de faire vivre la chaîne du don de sang au Togo.</T>
        </p>
      </div>

      <div className="max-w-md mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 soft-shadow text-center">
          {chargement && (
            <p className="text-secondary">
              <T>Chargement…</T>
            </p>
          )}

          {!chargement && erreur && !apercu && (
            <>
              <XCircle className="mx-auto mb-4 text-error" size={40} />
              <p className="text-on-surface font-medium mb-2">
                <T>{erreur}</T>
              </p>
              <p className="text-secondary text-body-md mb-6">
                <T>Connectez-vous à votre espace donneur pour répondre directement.</T>
              </p>
              <Button asChild variant="primary" size="lg" className="rounded-xl w-full">
                <Link to="/connexion">
                  <LogIn size={16} aria-hidden /> <T>Se connecter</T>
                </Link>
              </Button>
            </>
          )}

          {!chargement && apercu && reponseEnvoyee && (
            <>
              <CheckCircle2 className="mx-auto mb-4 text-primary" size={40} />
              <h2 className="font-headline-md text-headline-md mb-2">
                <T>{reponseEnvoyee === 'JE_VIENS' ? 'Merci, à bientôt !' : 'Réponse enregistrée'}</T>
              </h2>
              <p className="text-secondary">
                <T>
                  {reponseEnvoyee === 'JE_VIENS'
                    ? `Votre venue au centre${apercu.centreNom ? ` ${apercu.centreNom}` : ''} a bien été enregistrée.`
                    : 'Merci de nous avoir prévenus, ce sera pour une prochaine fois.'}
                </T>
              </p>
            </>
          )}

          {!chargement && apercu && !reponseEnvoyee && (
            <>
              <HeartHandshake className="mx-auto mb-4 text-primary" size={40} />
              <p className="text-caption uppercase tracking-widest text-secondary mb-1">
                <T>Alerte don de sang</T>
              </p>
              <h2 className="font-headline-md text-headline-md mb-3">
                <T>{`Besoin de ${GROUPE_SANGUIN_LABELS[apercu.groupeSanguinRequis]}`}</T>
              </h2>
              <p className="text-on-surface mb-1">
                <T>Bonjour</T> {apercu.prenom}, <T>un besoin a été signalé à</T> <strong>{apercu.quartierNom}</strong>.
              </p>
              {apercu.centreNom && (
                <p className="text-secondary text-body-md mb-4">
                  <T>Rendez-vous au centre</T> <strong>{apercu.centreNom}</strong>
                  {apercu.centreAdresse ? ` — ${apercu.centreAdresse}` : ''}
                </p>
              )}

              {!apercu.alerteOuverte ? (
                <p className="text-secondary text-body-md mt-4">
                  <T>Cette alerte est désormais fermée, merci de votre disponibilité.</T>
                </p>
              ) : (
                <>
                  {apercu.maReponse && (
                    <p className="text-secondary text-body-md mb-4">
                      <T>{`Réponse actuelle : ${apercu.maReponse === 'JE_VIENS' ? 'Je viens' : 'Indisponible'}`}</T>
                    </p>
                  )}
                  <div className="flex flex-col gap-3 mt-6">
                    <Button
                      variant="primary"
                      size="lg"
                      className="rounded-xl w-full"
                      disabled={envoi}
                      onClick={() => repondre('JE_VIENS')}
                      autoFocus={statutSuggere === 'JE_VIENS'}
                    >
                      ✅ <T>Je viens</T>
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="rounded-xl w-full"
                      disabled={envoi}
                      onClick={() => repondre('INDISPONIBLE')}
                    >
                      <T>Indisponible</T>
                    </Button>
                  </div>
                  {erreur && (
                    <p className="text-sm text-error mt-4">
                      <T>{erreur}</T>
                    </p>
                  )}
                </>
              )}

              <p className="text-secondary text-body-md mt-6">
                <T>Vous préférez répondre depuis votre espace ?</T>{' '}
                <Link to="/connexion" className="text-primary font-semibold hover:underline">
                  <T>Se connecter</T>
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
