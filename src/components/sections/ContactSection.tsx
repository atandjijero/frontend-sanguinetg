import React, { useState } from 'react'
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react'
import Button from '../ui/Button'
import { api, ApiError } from '../../lib/api'

const contactInfo = [
  { icon: MapPin, label: 'Adresse', value: 'Centre National de Transfusion Sanguine, Lomé, Togo' },
  { icon: Phone, label: 'Téléphone', value: '(+228) 22 21 00 00' },
  { icon: Mail, label: 'Email', value: 'contact@cnts.tg' },
  { icon: Clock, label: 'Horaires', value: 'Lundi – Samedi, 7h30 – 17h30' },
]

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false)
  const [nomComplet, setNomComplet] = useState('')
  const [email, setEmail] = useState('')
  const [sujet, setSujet] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await api.post('/contact', { nomComplet, email, sujet, message })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Impossible d'envoyer le message, réessayez.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="py-20" id="contact">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-headline-lg mb-4">Contactez le CNTS</h2>
          <p className="text-secondary max-w-2xl mx-auto">
            Une question sur le don de sang, une urgence ou un partenariat ? Écrivez-nous.
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-6">
            {contactInfo.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon size={20} aria-hidden />
                  </div>
                  <div>
                    <p className="text-caption uppercase tracking-widest text-secondary">{item.label}</p>
                    <p className="text-on-surface font-medium">{item.value}</p>
                  </div>
                </div>
              )
            })}

            <div className="rounded-2xl overflow-hidden border border-outline-variant soft-shadow aspect-video">
              <iframe
                title="Localisation du CNTS à Lomé"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.7859578858383!2d1.2150570747632858!3d6.159414893827767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1023e205cd0c04eb%3A0xbc440c536632797d!2sCENTRE%20NATIONAL%20DE%20TRANSFUSION%20SANGUINE!5e0!3m2!1sfr!2stg!4v1783685780110!5m2!1sfr!2stg"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 soft-shadow">
            {submitted ? (
              <div className="text-center py-12">
                <h3 className="font-headline-md text-headline-md text-primary mb-3">Message envoyé</h3>
                <p className="text-secondary">Merci, le CNTS reviendra vers vous dans les meilleurs délais.</p>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-label-md text-on-surface mb-2 block">Nom complet</span>
                    <input
                      required
                      type="text"
                      value={nomComplet}
                      onChange={(e) => setNomComplet(e.target.value)}
                      className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </label>
                  <label className="block">
                    <span className="text-label-md text-on-surface mb-2 block">Email</span>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="text-label-md text-on-surface mb-2 block">Sujet</span>
                  <input
                    required
                    type="text"
                    value={sujet}
                    onChange={(e) => setSujet(e.target.value)}
                    className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
                <label className="block">
                  <span className="text-label-md text-on-surface mb-2 block">Message</span>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
                {error && <p className="text-sm text-error">{error}</p>}
                <Button type="submit" variant="primary" size="lg" className="rounded-xl" disabled={submitting}>
                  {submitting ? 'Envoi...' : 'Envoyer le message'}
                  <Send size={16} aria-hidden />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
