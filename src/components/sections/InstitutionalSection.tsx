import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { T } from '../../context/LanguageContext'

export function InstitutionalSection({
  doctorImageUrl,
  vialsImageUrl,
}: {
  doctorImageUrl?: string
  vialsImageUrl?: string
}) {
  return (
    <section className="py-24 bg-surface-alt" id="about">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="font-display-lg text-display-lg">
              <T>L'Institution au service du Peuple</T>
            </h2>
            <div className="w-20 h-1.5 bg-primary rounded-full" />
            <p className="font-body-lg text-body-lg text-on-surface text-justify">
              <T>
                Le Centre National de Transfusion Sanguine (CNTS) du Togo s'engage dans une transformation digitale
                d'envergure. Sous l'impulsion du Ministère de la Santé, la plateforme Sanguine TG représente l'avenir
                de la solidarité nationale.
              </T>
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-success-mint shrink-0 mt-0.5" size={22} aria-hidden />
                <div>
                  <p className="font-bold">
                    <T>Sécurité Maximale</T>
                  </p>
                  <p className="text-secondary text-body-md">
                    <T>Des protocoles médicaux rigoureux appliqués à chaque étape du don.</T>
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-success-mint shrink-0 mt-0.5" size={22} aria-hidden />
                <div>
                  <p className="font-bold">
                    <T>Transparence Totale</T>
                  </p>
                  <p className="text-secondary text-body-md">
                    <T>Traçabilité complète des dons du prélèvement à la transfusion.</T>
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="lg:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden aspect-[3/4] soft-shadow">
                <img
                  className="w-full h-full object-cover bg-surface-container"
                  alt="Médecin souriant en blouse blanche dans un laboratoire médical"
                  src={doctorImageUrl ?? '/images/institutional-doctor.jpg'}
                />
              </div>
              <div className="pt-12">
                <div className="rounded-2xl overflow-hidden aspect-[3/4] soft-shadow">
                  <img
                    className="w-full h-full object-cover bg-surface-container"
                    alt="Fioles et équipement de logistique médicale stérile"
                    src={vialsImageUrl ?? '/images/institutional-vials.jpg'}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
