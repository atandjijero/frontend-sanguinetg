import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MailCheck, SendHorizontal } from 'lucide-react'
import Button from '../components/ui/Button'
import { api, ApiError } from '../lib/api'
import { T } from '../context/LanguageContext'

export default function MotDePasseOubliePage() {
  const [identifiant, setIdentifiant] = useState('')
  const [envoye, setEnvoye] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await api.post('/auth/mot-de-passe-oublie', { identifiant })
      setEnvoye(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Impossible de traiter votre demande, réessayez.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="pt-16 pb-20">
      <div className="max-w-md mx-auto px-margin-mobile md:px-margin-desktop text-center mb-10">
        <h1 className="font-headline-lg text-headline-lg mb-3">
          <T>Mot de passe oublié</T>
        </h1>
        <p className="text-secondary">
          <T>Indiquez votre email ou téléphone, nous vous envoyons un lien de réinitialisation.</T>
        </p>
      </div>

      <div className="max-w-md mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 soft-shadow text-center">
          {envoye ? (
            <>
              <MailCheck className="mx-auto mb-4 text-primary" size={40} />
              <h2 className="font-headline-md text-headline-md mb-2">
                <T>Vérifiez votre boîte mail</T>
              </h2>
              <p className="text-secondary">
                <T>
                  Si un compte est associé à cet identifiant, un email avec un lien de réinitialisation vient de
                  vous être envoyé.
                </T>
              </p>
            </>
          ) : (
            <form className="space-y-5 text-left" onSubmit={handleSubmit}>
              <label className="block">
                <span className="text-label-md text-on-surface mb-2 block">
                  <T>Email ou téléphone</T>
                </span>
                <input
                  required
                  type="text"
                  value={identifiant}
                  onChange={(e) => setIdentifiant(e.target.value)}
                  className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
              {error && (
                <p className="text-sm text-error">
                  <T>{error}</T>
                </p>
              )}
              <Button type="submit" variant="primary" size="lg" className="rounded-xl w-full" disabled={submitting}>
                <T>Envoyer le lien</T>
                <SendHorizontal size={16} aria-hidden />
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
