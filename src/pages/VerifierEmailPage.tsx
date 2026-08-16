import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import Button from '../components/ui/Button'
import { api, ApiError } from '../lib/api'
import { T } from '../context/LanguageContext'

export default function VerifierEmailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') ?? ''

  const [statut, setStatut] = useState<'en-cours' | 'reussi' | 'echec'>(token ? 'en-cours' : 'echec')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    let cancelled = false
    async function verifier() {
      try {
        await api.post('/auth/verifier-email', { token })
        if (!cancelled) setStatut('reussi')
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Impossible de vérifier votre email.")
          setStatut('echec')
        }
      }
    }
    verifier()
    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <section className="pt-16 pb-20">
      <div className="max-w-md mx-auto px-margin-mobile md:px-margin-desktop text-center mb-10">
        <h1 className="font-headline-lg text-headline-lg mb-3">
          <T>Vérification de votre email</T>
        </h1>
      </div>

      <div className="max-w-md mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 soft-shadow text-center">
          {statut === 'en-cours' && (
            <>
              <Loader2 className="mx-auto mb-4 text-primary animate-spin" size={40} />
              <p className="text-secondary">
                <T>Vérification en cours...</T>
              </p>
            </>
          )}
          {statut === 'reussi' && (
            <>
              <CheckCircle2 className="mx-auto mb-4 text-primary" size={40} />
              <h2 className="font-headline-md text-headline-md mb-2">
                <T>Email vérifié</T>
              </h2>
              <p className="text-secondary mb-6">
                <T>Votre compte est activé, vous pouvez maintenant vous connecter.</T>
              </p>
              <Button variant="primary" size="lg" onClick={() => navigate('/connexion')}>
                <T>Se connecter</T>
              </Button>
            </>
          )}
          {statut === 'echec' && (
            <>
              <XCircle className="mx-auto mb-4 text-error" size={40} />
              <p className="text-sm text-error">
                <T>{error ?? 'Ce lien de vérification est invalide.'}</T>
              </p>
            </>
          )}
          <p className="mt-6 text-center text-body-md text-secondary">
            <Link to="/connexion" className="text-primary font-semibold hover:underline">
              <T>Retour à la connexion</T>
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
