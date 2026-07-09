import React from 'react'
import {
  AlertTriangle,
  BellRing,
  BookHeart,
  CheckCircle2,
  MapPin,
  MousePointerClick,
  ShieldCheck,
  Stethoscope,
  Target,
  WifiOff,
} from 'lucide-react'

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

const scope = [
  {
    icon: Target,
    title: 'Mobilisation et prise en charge des donneurs',
    description:
      "L'application porte uniquement sur la mobilisation rapide des donneurs de sang et leur suivi. Elle ne couvre pas la logistique interne du CNTS ni la gestion médicale des poches de sang.",
  },
  {
    icon: MapPin,
    title: 'Déploiement pilote à Lomé',
    description:
      "Le déploiement pilote se limite à la ville de Lomé, avant une éventuelle extension à l'échelle nationale du Togo.",
  },
]

const limits = [
  {
    icon: ShieldCheck,
    title: 'Sécurité de base',
    description:
      "L'application se limite aux mesures de base : authentification, chiffrement, contrôle d'accès — sans test d'intrusion (pentest) ni audit de sécurité complet.",
  },
  {
    icon: AlertTriangle,
    title: 'Pas de gestion du transport',
    description:
      'La plateforme alerte les donneurs et les oriente vers le centre de transfusion, mais ne gère pas leur transport physique jusqu’au centre.',
  },
  {
    icon: CheckCircle2,
    title: 'Groupe sanguin non vérifié automatiquement',
    description:
      "Le groupe sanguin déclaré lors de l'inscription n'est pas vérifié par la plateforme : sa confirmation officielle se fait directement au centre de transfusion.",
  },
  {
    icon: WifiOff,
    title: 'Dépendance à la connexion internet',
    description: 'En cas de coupure totale du réseau, les alertes ne peuvent pas être transmises aux donneurs.',
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

      <section className="py-20 bg-surface-alt border-y border-outline-variant">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <h2 className="font-headline-lg text-headline-lg mb-12 text-center">Portée du projet</h2>
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="rounded-3xl overflow-hidden aspect-[4/3] soft-shadow border-4 border-surface-container-lowest order-2 lg:order-1">
              <img
                className="w-full h-full object-cover bg-surface-container"
                alt="Contrôle de tension artérielle avant un don, étape de la prise en charge du donneur"
                src="/images/donor-care.jpg"
              />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              {scope.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="bg-surface p-8 rounded-2xl border border-outline-variant soft-shadow">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                      <Icon size={26} aria-hidden />
                    </div>
                    <h3 className="font-headline-md text-headline-md mb-3">{item.title}</h3>
                    <p className="text-body-md text-secondary text-justify">{item.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <h2 className="font-headline-lg text-headline-lg mb-4 text-center">Limites actuelles</h2>
          <p className="text-secondary max-w-2xl mx-auto text-center mb-12">
            Par souci de transparence, voici ce que la plateforme ne couvre pas dans sa version pilote.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {limits.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="flex items-start gap-4 p-6 rounded-2xl border border-outline-variant bg-surface-container-lowest"
                >
                  <div className="w-11 h-11 rounded-xl bg-surface-container text-secondary flex items-center justify-center shrink-0">
                    <Icon size={20} aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface mb-1">{item.title}</h3>
                    <p className="text-body-md text-secondary text-justify">{item.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
