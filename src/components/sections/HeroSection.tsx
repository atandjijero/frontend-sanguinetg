import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Heart, PlayCircle } from 'lucide-react'
import Button from '../ui/Button'
import { T } from '../../context/LanguageContext'

export function HeroSection({ imageUrl }: { imageUrl?: string }) {
  return (
    <section className="relative overflow-hidden py-24 md:py-36 min-h-[560px] flex items-center">
      <img
        className="absolute inset-0 w-full h-full object-cover"
        alt="Prise en charge d'un donneur avant son don de sang"
        src={imageUrl ?? '/images/donor-care.jpg'}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />

      <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full">
        <div className="max-w-xl">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full mb-6 animate-fade-in-up"
            style={{ animationDelay: '0ms' }}
          >
            <span className="w-2 h-2 rounded-full bg-success-mint animate-pulse" />
            <span className="text-caption font-label-md uppercase tracking-wider">
              <T>Pilotage Lomé : Projet National</T>
            </span>
          </div>
          <h1
            className="font-display-lg text-display-lg text-white mb-6 leading-tight animate-fade-in-up"
            style={{ animationDelay: '100ms' }}
          >
            <T>Chaque seconde compte, votre</T>{' '}
            <span className="text-primary-fixed-dim">
              <T>don sauve des vies</T>
            </span>
            .
          </h1>
          <p
            className="font-body-lg text-body-lg text-white/90 text-justify mb-10 max-w-lg animate-fade-in-up"
            style={{ animationDelay: '200ms' }}
          >
            <T>
              Sanguine TG modernise la mobilisation des donneurs de sang au Togo. Recevez des alertes ciblées et
              agissez en un clic pour les urgences vitales à Lomé.
            </T>
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
            style={{ animationDelay: '300ms' }}
          >
            <Button
              variant="primary"
              asChild
              className="px-8 py-4 h-auto rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform font-headline-md text-base"
            >
              <Link to="/inscription">
                <T>Devenir donneur</T>
                <ChevronRight size={20} aria-hidden />
              </Link>
            </Button>
            <Link
              to="/fonctionnement"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-headline-md rounded-xl border border-white/30 hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              <PlayCircle size={20} aria-hidden />
              <T>Comment ça marche</T>
            </Link>
          </div>
        </div>
      </div>

      <div
        className="absolute z-10 top-8 right-6 md:right-16 hidden sm:block animate-fade-in-up"
        style={{ animationDelay: '350ms' }}
      >
        <div className="flex items-center gap-3 bg-surface-container-lowest/95 backdrop-blur-sm pl-2 pr-4 py-2 rounded-full soft-shadow border border-outline-variant">
          <div className="flex -space-x-2.5">
            {(['bg-primary', 'bg-tertiary', 'bg-secondary', 'bg-warning-amber'] as const).map((color) => (
              <span
                key={color}
                className={`h-8 w-8 rounded-full border-2 border-surface-container-lowest ${color} flex items-center justify-center text-white`}
              >
                <Heart size={13} aria-hidden fill="currentColor" />
              </span>
            ))}
          </div>
          <div>
            <p className="font-headline-md text-sm text-on-surface leading-none">+2 884</p>
            <p className="text-caption text-secondary mt-0.5">
              <T>Donneurs actifs</T>
            </p>
          </div>
        </div>
      </div>

      <div
        className="absolute z-10 bottom-8 right-6 md:right-16 max-w-[200px] hidden sm:block animate-fade-in-up"
        style={{ animationDelay: '450ms' }}
      >
        <div className="bg-surface-container-lowest p-6 rounded-2xl soft-shadow border border-outline-variant animate-bounce-subtle">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-success-mint/20 flex items-center justify-center text-success-mint">
              <Heart size={20} aria-hidden />
            </div>
            <span className="font-headline-md text-primary">+2.4k</span>
          </div>
          <p className="text-caption text-secondary">
            <T>Vies sauvées grâce aux dons ce mois-ci à Lomé.</T>
          </p>
        </div>
      </div>
    </section>
  )
}
