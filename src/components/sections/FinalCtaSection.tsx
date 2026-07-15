import React from 'react'
import { Link } from 'react-router-dom'

export function FinalCtaSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary-container opacity-95" />
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 text-center text-on-primary">
        <h2 className="font-display-lg text-display-lg mb-6">Rejoignez le réseau national de solidarité.</h2>
        <p className="font-body-lg text-body-lg mb-10 max-w-2xl mx-auto text-primary-fixed">
          Votre inscription ne prend que 2 minutes, mais elle peut offrir des décennies à quelqu'un d'autre. Soyez le
          héros qu'attend un patient aujourd'hui.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            to="/inscription"
            className="px-10 py-5 bg-surface text-primary font-headline-md rounded-2xl shadow-xl hover:bg-surface-container-low transition-all active:scale-95"
          >
            Créer mon compte donneur
          </Link>
          <Link
            to="/lieux-de-collecte"
            className="px-10 py-5 bg-primary border-2 border-on-primary text-on-primary font-headline-md rounded-2xl hover:bg-primary/90 transition-all"
          >
            Consulter les lieux de collecte
          </Link>
        </div>
      </div>
    </section>
  )
}
