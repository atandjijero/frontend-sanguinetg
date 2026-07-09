import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { ApiError } from '../lib/api'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [identifiant, setIdentifiant] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const user = await login(identifiant, motDePasse)
      navigate(user.role === 'DONNEUR' ? '/espace-donneur' : '/admin', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Connexion impossible, réessayez.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <section className="pt-16 pb-20">
        <div className="max-w-md mx-auto px-margin-mobile md:px-margin-desktop text-center mb-10">
          <h1 className="font-headline-lg text-headline-lg mb-3">Accédez à votre espace</h1>
          <p className="text-secondary">Retrouvez vos alertes, votre carnet digital et vos remerciements du CNTS.</p>
        </div>
        <div className="max-w-md mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 soft-shadow">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block">
                <span className="text-label-md text-on-surface mb-2 block">Email ou téléphone</span>
                <input
                  required
                  type="text"
                  value={identifiant}
                  onChange={(e) => setIdentifiant(e.target.value)}
                  className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
              <label className="block">
                <span className="text-label-md text-on-surface mb-2 block">Mot de passe</span>
                <input
                  required
                  type="password"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
              {error && <p className="text-sm text-error">{error}</p>}
              <Button type="submit" variant="primary" size="lg" className="rounded-xl w-full" disabled={submitting}>
                Se connecter
                <LogIn size={16} aria-hidden />
              </Button>
              <p className="text-center text-body-md text-secondary">
                Pas encore de compte ?{' '}
                <Link to="/inscription" className="text-primary font-semibold hover:underline">
                  Devenir donneur
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
