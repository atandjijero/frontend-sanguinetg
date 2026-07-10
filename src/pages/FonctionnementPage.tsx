import React from 'react'
import { BellRing, BookHeart, MousePointerClick, Stethoscope } from 'lucide-react'

const steps = [
  {
    icon: BellRing,
    title: '1. Alerte ciblée par groupe sanguin et zone',
    description:
      "Lorsqu'un besoin se présente, le CNTS envoie une alerte géolocalisée. Seuls les donneurs dont le groupe sanguin correspond et qui se trouvent dans la zone concernée la reçoivent — pas de diffusion large et non ciblée comme sur Facebook, la radio ou la télévision.",
    accent: 'bg-primary/10 text-primary',
  },
  {
    icon: MousePointerClick,
    title: '2. Réponse en un clic',
    description:
      'Chaque donneur sollicité répond directement « Je viens » ou « Indisponible ». Le CNTS sait en temps réel combien de donneurs sont mobilisés, sans attendre un retour par téléphone ou sur les réseaux sociaux.',
    accent: 'bg-success-mint/10 text-success-mint',
  },
  {
    icon: BookHeart,
    title: '3. Suivi et carnet digital',
    description:
      "Un carnet digital garde l'historique des dons de chaque donneur, ses remerciements officiels, et peut orienter vers une aide de soutien en vivres — pour encourager la disponibilité des donneurs sur la durée. Ce carnet reste un outil de rappel, sans valeur médicale officielle.",
    accent: 'bg-secondary-container text-secondary',
  },
  {
    icon: Stethoscope,
    title: '4. Espace conseil santé',
    description:
      "Un espace d'information validé par le CNTS regroupe les conseils avant le don, après le don, et les critères d'éligibilité — pour que chaque donneur soit mieux informé, sans remplacer un avis médical.",
    accent: 'bg-tertiary-fixed/30 text-tertiary',
  },
]

export default function FonctionnementPage() {
  return (
    <>
      <div className="pt-16 pb-4 max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop text-center">
        <h1 className="font-headline-lg text-headline-lg mb-3">Comment Sanguine TG accélère la mobilisation des donneurs</h1>
        <p className="text-secondary">
          Une plateforme centrée sur quatre fonctions simples, pensées pour réduire le délai entre un besoin urgent de
          sang et l'arrivée d'un donneur compatible à Lomé.
        </p>
      </div>

      <section className="py-20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid gap-8 md:grid-cols-2">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <div
                  key={step.title}
                  className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant card-hover transition-all"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${step.accent}`}>
                    <Icon size={28} aria-hidden />
                  </div>
                  <h2 className="font-headline-md text-headline-md mb-4 text-on-surface">{step.title}</h2>
                  <p className="text-body-md text-secondary text-justify">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
