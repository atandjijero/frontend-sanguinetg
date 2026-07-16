import React from 'react'
import { Award, HandHeart, MapPin, ShieldCheck } from 'lucide-react'
import { T } from '../../context/LanguageContext'

const values = [
  {
    icon: ShieldCheck,
    title: 'Sécurité',
    description: 'Des protocoles rigoureux à chaque étape, du prélèvement à la transfusion.',
  },
  {
    icon: HandHeart,
    title: 'Solidarité',
    description: 'Un don gratuit, volontaire et non rémunéré, au service de tous les patients togolais.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Des équipes formées en continu aux meilleures pratiques de la médecine transfusionnelle.',
  },
  {
    icon: MapPin,
    title: 'Proximité',
    description: "Une présence pensée pour rapprocher le don de sang des populations, à Lomé et au-delà.",
  },
]

const stats = [
  { value: '12,500', label: 'Donneurs mobilisables' },
  { value: '98%', label: 'Réussite en urgence' },
  { value: '100%', label: 'Don volontaire et non rémunéré' },
]

export function AboutContent({ laboratoryImageUrl }: { laboratoryImageUrl?: string }) {
  return (
    <>
      <section className="py-20" id="a-propos">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid gap-16 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <h2 className="font-headline-lg text-headline-lg">
              <T>Qui sommes-nous</T>
            </h2>
            <p className="text-body-md text-secondary text-justify">
              <T>
                Placé sous la tutelle du Ministère de la Santé, le Centre National de Transfusion Sanguine (CNTS) du
                Togo est l'organisme national de référence en matière de collecte, de qualification, de préparation
                et de distribution des produits sanguins.
              </T>
            </p>
            <p className="text-body-md text-secondary text-justify">
              <T>
                Sa mission s'inscrit dans une logique de santé publique : garantir à chaque patient togolais, où
                qu'il se trouve, un accès rapide à du sang sûr, en quantité suffisante, grâce à un réseau de donneurs
                volontaires fidélisés.
              </T>
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden aspect-[4/3] soft-shadow border-4 border-surface-container-lowest">
            <img
              className="w-full h-full object-cover bg-surface-container"
              alt="Analyse et qualification d'un échantillon au CNTS"
              src={laboratoryImageUrl ?? '/images/about-laboratory.jpg'}
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface-alt border-y border-outline-variant">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid gap-8 md:grid-cols-2">
          <div className="bg-surface p-8 rounded-2xl border border-outline-variant soft-shadow">
            <h3 className="font-headline-md text-headline-md mb-3 text-primary">
              <T>Notre mission</T>
            </h3>
            <p className="text-body-md text-secondary text-justify">
              <T>
                Assurer à tout patient togolais un accès rapide, sûr et équitable à des produits sanguins de qualité,
                en mobilisant un réseau de donneurs volontaires, non rémunérés et fidélisés. Cette fidélisation passe
                par une vraie prise en charge du donneur : conseil santé avant et après le don, remerciements
                officiels, et un soutien en vivres.
              </T>
            </p>
          </div>
          <div className="bg-surface p-8 rounded-2xl border border-outline-variant soft-shadow">
            <h3 className="font-headline-md text-headline-md mb-3 text-tertiary">
              <T>Notre vision</T>
            </h3>
            <p className="text-body-md text-secondary text-justify">
              <T>
                Faire de la transfusion sanguine au Togo un système résilient et digitalisé, où aucune vie n'est
                perdue faute de disponibilité en sang, à Lomé comme dans le reste du pays.
              </T>
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <h2 className="font-headline-lg text-headline-lg mb-12 text-center">
            <T>Nos valeurs</T>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon
              return (
                <div
                  key={value.title}
                  className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant text-center card-hover transition-all"
                >
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Icon size={26} aria-hidden />
                  </div>
                  <h3 className="font-bold text-on-surface mb-2">
                    <T>{value.title}</T>
                  </h3>
                  <p className="text-body-md text-secondary">
                    <T>{value.description}</T>
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary-container">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid gap-8 sm:grid-cols-3 text-center text-on-primary">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-display-lg font-bold">{stat.value}</div>
              <p className="text-label-md uppercase tracking-wide text-primary-fixed">
                <T>{stat.label}</T>
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
