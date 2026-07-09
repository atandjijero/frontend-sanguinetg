import React from 'react'
import { BellRing, IdCard, MousePointerClick, Stethoscope } from 'lucide-react'

export function HowItWorksSection() {
  return (
    <section className="py-24" id="process">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="mb-16">
          <h2 className="font-headline-lg text-headline-lg mb-4">Notre Solution Digitalisée</h2>
          <p className="text-secondary max-w-xl">
            Un écosystème conçu pour fluidifier le parcours du donneur et la gestion hospitalière.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          <div className="md:col-span-7 bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant card-hover transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BellRing size={28} aria-hidden />
              </div>
              <h3 className="font-headline-md mb-4 text-on-surface">1. Alerte ciblée</h3>
              <p className="text-body-md text-secondary text-justify">
                Dès qu'un besoin urgent se présente, notre système identifie les donneurs compatibles les plus
                proches et envoie une notification SMS et Push instantanée.
              </p>
            </div>
            <div className="mt-12 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-surface rounded-full border border-outline-variant text-caption">
                SMS Prioritaire
              </span>
              <span className="px-3 py-1 bg-surface rounded-full border border-outline-variant text-caption">
                Géo-localisation
              </span>
              <span className="px-3 py-1 bg-surface rounded-full border border-outline-variant text-caption">
                Groupe Sanguin
              </span>
            </div>
          </div>

          <div className="md:col-span-5 bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant card-hover transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-success-mint/10 text-success-mint flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MousePointerClick size={28} aria-hidden />
            </div>
            <h3 className="font-headline-md mb-4">2. Réponse rapide</h3>
            <p className="text-body-md text-secondary text-justify">
              Confirmez votre disponibilité en un seul clic directement depuis l'application. Le centre de
              transfusion reçoit votre réponse en temps réel.
            </p>
          </div>

          <div className="md:col-span-5 bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant card-hover transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-secondary-container text-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <IdCard size={28} aria-hidden />
            </div>
            <h3 className="font-headline-md mb-4">3. Suivi digital</h3>
            <p className="text-body-md text-secondary text-justify">
              Votre carte de donneur est toujours sur vous. Consultez votre historique de dons, vos analyses et vos
              points de fidélité citoyenne.
            </p>
          </div>

          <div className="md:col-span-7 bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant card-hover transition-all group flex items-start gap-8">
            <div className="hidden sm:flex shrink-0 w-24 h-24 rounded-full bg-tertiary-fixed/30 items-center justify-center text-tertiary">
              <Stethoscope size={40} aria-hidden />
            </div>
            <div>
              <h3 className="font-headline-md mb-4">4. Information santé</h3>
              <p className="text-body-md text-secondary text-justify">
                Recevez des conseils personnalisés pour préparer vos dons et suivez votre bilan de santé après chaque
                intervention avec nos médecins partenaires.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
