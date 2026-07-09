import React from 'react'
import { Link } from 'react-router-dom'
import { AboutContent } from '../components/sections/AboutContent'

export default function AProposPage() {
  return (
    <>
      <div className="pt-16 pb-4 max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop text-center">
        <h1 className="font-headline-lg text-headline-lg mb-3">Le CNTS, engagé pour la sécurité transfusionnelle au Togo</h1>
        <p className="text-secondary">
          Le Centre National de Transfusion Sanguine est l'institution publique togolaise chargée de garantir, sur
          tout le territoire, un accès sûr et suffisant à des produits sanguins de qualité.
        </p>
      </div>

      <AboutContent />

      <section className="py-20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <h2 className="font-headline-lg text-headline-lg mb-4">Sanguine TG, notre plateforme numérique</h2>
          <p className="text-secondary max-w-2xl mx-auto mb-8">
            Pour tenir cette mission face à l'urgence, le CNTS déploie Sanguine TG : un outil numérique dédié à la
            mobilisation rapide des donneurs de sang, actuellement en phase pilote à Lomé.
          </p>
          <Link
            to="/fonctionnement"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-on-primary font-headline-md rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
          >
            Découvrir son fonctionnement
          </Link>
        </div>
      </section>
    </>
  )
}
