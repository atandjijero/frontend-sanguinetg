import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, KeyRound } from 'lucide-react'
import Button from '../components/ui/Button'
import { api, ApiError } from '../lib/api'
import { T } from '../context/LanguageContext'

export default function ReinitialiserMotDePassePage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const navigate = useNavigate()

  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('')
  const [confirmationNouveauMotDePasse, setConfirmationNouveauMotDePasse] = useState('')
  const [reussi, setReussi] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await api.post('/auth/reinitialiser-mot-de-passe', {
        token,
        nouveauMotDePasse,
        confirmationNouveauMotDePasse,
      })
      setReussi(true)
      setTimeout(() => navigate('/connexion', { replace: true }), 2000)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Impossible de réinitialiser le mot de passe.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="pt-16 pb-20">
      <div className="max-w-md mx-auto px-margin-mobile md:px-margin-desktop text-center mb-10">
        <h1 className="font-headline-lg text-headline-lg mb-3">
          <T>Choisir un nouveau mot de passe</T>
        </h1>
      </div>

      <div className="max-w-md mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 soft-shadow text-center">
          {!token ? (
            <p className="text-sm text-error">
              <T>Ce lien de réinitialisation est invalide.</T>
            </p>
          ) : reussi ? (
            <>
              <CheckCircle2 className="mx-auto mb-4 text-primary" size={40} />
              <h2 className="font-headline-md text-headline-md mb-2">
                <T>Mot de passe mis à jour</T>
              </h2>
              <p className="text-secondary">
                <T>Vous allez être redirigé vers la page de connexion.</T>
              </p>
            </>
          ) : (
            <form className="space-y-5 text-left" onSubmit={handleSubmit}>
              <label className="block">
                <span className="text-label-md text-on-surface mb-2 block">
                  <T>Nouveau mot de passe</T>
                </span>
                <input
                  required
                  type="password"
                  minLength={8}
                  value={nouveauMotDePasse}
                  onChange={(e) => setNouveauMotDePasse(e.target.value)}
                  className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
              <label className="block">
                <span className="text-label-md text-on-surface mb-2 block">
                  <T>Confirmer le mot de passe</T>
                </span>
                <input
                  required
                  type="password"
                  value={confirmationNouveauMotDePasse}
                  onChange={(e) => setConfirmationNouveauMotDePasse(e.target.value)}
                  className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
              {error && (
                <p className="text-sm text-error">
                  <T>{error}</T>
                </p>
              )}
              <Button type="submit" variant="primary" size="lg" className="rounded-xl w-full" disabled={submitting}>
                <T>Réinitialiser</T>
                <KeyRound size={16} aria-hidden />
              </Button>
            </form>
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
