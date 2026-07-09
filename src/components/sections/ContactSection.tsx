import React, { useState } from 'react'
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react'
import Button from '../ui/Button'

const contactInfo = [
  { icon: MapPin, label: 'Adresse', value: 'Centre National de Transfusion Sanguine, Lomé, Togo' },
  { icon: Phone, label: 'Téléphone', value: '(+228) 22 21 00 00' },
  { icon: Mail, label: 'Email', value: 'contact@cnts.tg' },
  { icon: Clock, label: 'Horaires', value: 'Lundi – Samedi, 7h30 – 17h30' },
]

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false)

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
                src="https://www.google.com/maps?q=Centre+National+de+Transfusion+Sanguine,+Lom%C3%A9,+Togo&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
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
              <form
                className="space-y-5"
                onSubmit={(event) => {
                  event.preventDefault()
                  setSubmitted(true)
                }}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-label-md text-on-surface mb-2 block">Nom complet</span>
                    <input
                      required
                      type="text"
                      className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </label>
                  <label className="block">
                    <span className="text-label-md text-on-surface mb-2 block">Email</span>
                    <input
                      required
                      type="email"
                      className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="text-label-md text-on-surface mb-2 block">Sujet</span>
                  <input
                    required
                    type="text"
                    className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
                <label className="block">
                  <span className="text-label-md text-on-surface mb-2 block">Message</span>
                  <textarea
                    required
                    rows={5}
                    className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
                <Button type="submit" variant="primary" size="lg" className="rounded-xl">
                  Envoyer le message
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
