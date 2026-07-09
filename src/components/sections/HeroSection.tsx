import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Heart, PlayCircle } from 'lucide-react'
import Button from '../ui/Button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden gradient-mesh py-16 md:py-28">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-caption font-label-md uppercase tracking-wider">Pilotage Lomé : Projet National</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-6 leading-tight">
            Chaque seconde compte, votre <span className="text-primary">don sauve des vies</span>.
          </h1>
          <p className="font-body-lg text-body-lg text-secondary text-justify mb-10 max-w-lg">
            Sanguine TG modernise la mobilisation des donneurs de sang au Togo. Recevez des alertes ciblées et agissez
            en un clic pour les urgences vitales à Lomé.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="primary"
              asChild
              className="px-8 py-4 h-auto rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform font-headline-md text-base"
            >
              <Link to="/inscription">
                Devenir donneur
                <ChevronRight size={20} aria-hidden />
              </Link>
            </Button>
            <Link
              to="/fonctionnement"
              className="px-8 py-4 bg-surface-container text-on-surface font-headline-md rounded-xl border border-outline-variant hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2"
            >
              <PlayCircle size={20} aria-hidden />
              Comment ça marche
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-square rounded-3xl overflow-hidden soft-shadow border-4 border-surface-container-lowest">
            <img
              className="w-full h-full object-cover bg-surface-container"
              alt="Prise en charge d'un donneur avant son don de sang"
              src="/images/donor-care.jpg"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-surface-container-lowest p-6 rounded-2xl soft-shadow border border-outline-variant max-w-[200px] animate-bounce-subtle">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-success-mint/20 flex items-center justify-center text-success-mint">
                <Heart size={20} aria-hidden />
              </div>
              <span className="font-headline-md text-primary">+2.4k</span>
            </div>
            <p className="text-caption text-secondary">Vies sauvées grâce aux dons ce mois-ci à Lomé.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
