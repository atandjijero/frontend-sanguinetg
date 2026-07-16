import React from 'react'
import { BellRing, IdCard, MousePointerClick, Stethoscope } from 'lucide-react'
import { Card, CardContent, CardTitle, CardDescription } from '../ui/Card'
import { Badge } from '../ui/Badge'

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
          <Card variant="interactive" className="md:col-span-7">
            <CardContent className="h-full flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BellRing size={28} aria-hidden />
                </div>
                <CardTitle>1. Alerte ciblée</CardTitle>
                <CardDescription className="mt-4 text-justify">
                  Dès qu'un besoin urgent se présente, notre système identifie les donneurs compatibles les plus
                  proches et envoie une notification SMS et Push instantanée.
                </CardDescription>
              </div>
              <div className="mt-12 flex flex-wrap gap-2">
                <Badge variant="outline">SMS Prioritaire</Badge>
                <Badge variant="outline">Géo-localisation</Badge>
                <Badge variant="outline">Groupe Sanguin</Badge>
              </div>
            </CardContent>
          </Card>

          <Card variant="interactive" className="md:col-span-5">
            <CardContent>
              <div className="w-14 h-14 rounded-2xl bg-success-mint/10 text-success-mint flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MousePointerClick size={28} aria-hidden />
              </div>
              <CardTitle>2. Réponse rapide</CardTitle>
              <CardDescription className="mt-4 text-justify">
                Confirmez votre disponibilité en un seul clic directement depuis l'application. Le centre de
                transfusion reçoit votre réponse en temps réel.
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="interactive" className="md:col-span-5">
            <CardContent>
              <div className="w-14 h-14 rounded-2xl bg-secondary-container text-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <IdCard size={28} aria-hidden />
              </div>
              <CardTitle>3. Suivi digital</CardTitle>
              <CardDescription className="mt-4 text-justify">
                Votre carte de donneur est toujours sur vous. Consultez votre historique de dons, vos analyses et vos
                points de fidélité citoyenne.
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="interactive" className="md:col-span-7">
            <CardContent className="flex items-start gap-8">
              <div className="hidden sm:flex shrink-0 w-24 h-24 rounded-full bg-tertiary-fixed/30 items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
                <Stethoscope size={40} aria-hidden />
              </div>
              <div>
                <CardTitle>4. Information santé</CardTitle>
                <CardDescription className="mt-4 text-justify">
                  Recevez des conseils personnalisés pour préparer vos dons et suivez votre bilan de santé après
                  chaque intervention avec nos médecins partenaires.
                </CardDescription>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
