import React from 'react'
import { BellRing, IdCard, MousePointerClick, Stethoscope } from 'lucide-react'
import { Card, CardContent, CardTitle, CardDescription } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { T } from '../../context/LanguageContext'

export function HowItWorksSection() {
  return (
    <section className="py-24" id="process">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="mb-16">
          <h2 className="font-headline-lg text-headline-lg mb-4">
            <T>Notre Solution Digitalisée</T>
          </h2>
          <p className="text-secondary max-w-xl">
            <T>Un écosystème conçu pour fluidifier le parcours du donneur et la gestion hospitalière.</T>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          <Card variant="interactive" className="md:col-span-7">
            <CardContent className="h-full flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BellRing size={28} aria-hidden />
                </div>
                <CardTitle>
                  1. <T>Alerte ciblée</T>
                </CardTitle>
                <CardDescription className="mt-4 text-justify">
                  <T>
                    Dès qu'un besoin urgent se présente, notre système identifie les donneurs compatibles les plus
                    proches et envoie une notification SMS et Push instantanée.
                  </T>
                </CardDescription>
              </div>
              <div className="mt-12 flex flex-wrap gap-2">
                <Badge variant="outline">
                  <T>SMS Prioritaire</T>
                </Badge>
                <Badge variant="outline">
                  <T>Géo-localisation</T>
                </Badge>
                <Badge variant="outline">
                  <T>Groupe Sanguin</T>
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card variant="interactive" className="md:col-span-5">
            <CardContent>
              <div className="w-14 h-14 rounded-2xl bg-success-mint/10 text-success-mint flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MousePointerClick size={28} aria-hidden />
              </div>
              <CardTitle>
                2. <T>Réponse rapide</T>
              </CardTitle>
              <CardDescription className="mt-4 text-justify">
                <T>
                  Confirmez votre disponibilité en un seul clic directement depuis l'application. Le centre de
                  transfusion reçoit votre réponse en temps réel.
                </T>
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="interactive" className="md:col-span-5">
            <CardContent>
              <div className="w-14 h-14 rounded-2xl bg-secondary-container text-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <IdCard size={28} aria-hidden />
              </div>
              <CardTitle>
                3. <T>Suivi digital</T>
              </CardTitle>
              <CardDescription className="mt-4 text-justify">
                <T>
                  Votre carte de donneur est toujours sur vous. Consultez votre historique de dons, vos analyses et
                  vos points de fidélité citoyenne.
                </T>
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="interactive" className="md:col-span-7">
            <CardContent className="flex items-start gap-8">
              <div className="hidden sm:flex shrink-0 w-24 h-24 rounded-full bg-tertiary-fixed/30 items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
                <Stethoscope size={40} aria-hidden />
              </div>
              <div>
                <CardTitle>
                  4. <T>Information santé</T>
                </CardTitle>
                <CardDescription className="mt-4 text-justify">
                  <T>
                    Recevez des conseils personnalisés pour préparer vos dons et suivez votre bilan de santé après
                    chaque intervention avec nos médecins partenaires.
                  </T>
                </CardDescription>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
