import React from 'react'

export function StatsSection() {
  return (
    <section className="py-20 bg-surface-container-lowest border-y border-surface-container-highest">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-headline-lg mb-4">Urgence &amp; Impact en Temps Réel</h2>
          <p className="text-secondary max-w-2xl mx-auto">
            Notre objectif : transformer la réponse aux besoins de sang d'une attente incertaine en une intervention
            immédiate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="bg-surface p-8 rounded-2xl border border-outline-variant soft-shadow col-span-1 md:col-span-2">
            <h3 className="font-headline-md mb-8">Délai de mobilisation moyen</h3>
            <div className="space-y-8">
              <div className="relative">
                <div className="flex justify-between mb-2">
                  <span className="text-label-md text-secondary">Délai Actuel (Traditionnel)</span>
                  <span className="font-bold text-on-surface">3h+</span>
                </div>
                <div className="w-full h-4 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-secondary transition-all duration-1000 w-full" />
                </div>
              </div>
              <div className="relative">
                <div className="flex justify-between mb-2">
                  <span className="text-label-md text-success-mint font-bold">Objectif Plateforme Sanguine</span>
                  <span className="font-bold text-success-mint">-30 min</span>
                </div>
                <div className="w-full h-4 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-success-mint animate-progress" style={{ '--progress-width': '15%' } as React.CSSProperties} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-surface p-6 rounded-2xl border border-outline-variant flex flex-col items-center justify-center text-center">
              <span className="text-display-lg text-primary font-bold">12,500</span>
              <p className="text-label-md text-secondary uppercase tracking-tight">Donneurs Actifs</p>
            </div>
            <div className="bg-tertiary/10 p-6 rounded-2xl border border-tertiary-fixed-dim/50 flex flex-col items-center justify-center text-center">
              <span className="text-display-lg text-tertiary font-bold">98%</span>
              <p className="text-label-md text-tertiary uppercase tracking-tight">Réussite Urgence</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
