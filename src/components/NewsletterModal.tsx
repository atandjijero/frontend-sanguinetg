import React, { useEffect, useState } from 'react'
import { Mail, X } from 'lucide-react'
import Button from './ui/Button'
import { api, ApiError } from '../lib/api'
import { T, useTraduction } from '../context/LanguageContext'

const DISMISS_KEY = 'sanguine-tg-newsletter-dismissed'

export function NewsletterModal() {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const placeholderNom = useTraduction('Nom')
  const placeholderEmail = useTraduction('Entrez votre adresse email')

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) return
    const timer = setTimeout(() => setOpen(true), 1200)
    return () => clearTimeout(timer)
  }, [])

  const close = () => {
    setOpen(false)
    sessionStorage.setItem(DISMISS_KEY, '1')
  }

  if (!open) return null

  return (
    <div
      id="newsletter-modal"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-inverse-surface/60 px-margin-mobile"
      onClick={close}
    >
      <div
        className="relative w-full max-w-md bg-surface-container-lowest rounded-3xl soft-shadow p-8 text-center"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Fermer"
          className="absolute top-4 right-4 text-secondary hover:text-primary transition-colors"
        >
          <X size={22} aria-hidden />
        </button>

        {submitted ? (
          <div className="py-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-success-mint/10 text-success-mint flex items-center justify-center mb-6">
              <Mail size={28} aria-hidden />
            </div>
            <h2 className="font-headline-md text-headline-md text-primary mb-3">
              <T>Merci pour votre inscription</T>
            </h2>
            <p className="text-secondary">
              <T>Vous recevrez désormais les actualités de Sanguine TG par email.</T>
            </p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
              <Mail size={28} aria-hidden />
            </div>
            <h2 className="font-headline-md text-headline-md mb-3">
              <T>Inscrivez-vous à notre Newsletter</T>
            </h2>
            <p className="text-secondary mb-6">
              <T>
                Recevez les alertes de don, les actualités du CNTS et nos conseils santé directement dans votre
                boîte mail.
              </T>
            </p>

            <form
              className="space-y-4 text-left"
              onSubmit={async (event) => {
                event.preventDefault()
                setSubmitting(true)
                setError(null)
                try {
                  await api.post('/newsletter', { nom, email })
                  setSubmitted(true)
                  sessionStorage.setItem(DISMISS_KEY, '1')
                } catch (err) {
                  setError(err instanceof ApiError ? err.message : 'Impossible de finaliser votre inscription, réessayez.')
                } finally {
                  setSubmitting(false)
                }
              }}
            >
              <input
                required
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder={placeholderNom}
                className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholderEmail}
                className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-caption text-secondary">
                <T>
                  En cochant cette case, vous acceptez de recevoir des emails de Sanguine TG, incluant des alertes de
                  don, des actualités et des conseils santé. Vous pourrez vous désinscrire à tout moment.
                </T>
              </p>
              <label className="flex items-start gap-2">
                <input required type="checkbox" className="mt-1 accent-primary" />
                <span className="text-body-md text-secondary">
                  <T>J'accepte de recevoir des communications de Sanguine TG par email.</T>
                </span>
              </label>
              {error && (
                <p className="text-sm text-error">
                  <T>{error}</T>
                </p>
              )}
              <Button type="submit" variant="primary" size="lg" className="w-full rounded-full" disabled={submitting}>
                <T>S'abonner</T>
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
