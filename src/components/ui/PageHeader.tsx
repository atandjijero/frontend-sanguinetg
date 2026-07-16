import * as React from 'react'

export interface PageHeaderProps {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  backgroundImage?: string
}

export function PageHeader({ eyebrow, title, description, backgroundImage }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-outline-variant py-20 md:py-28">
      {backgroundImage ? (
        <>
          <img src={backgroundImage} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-surface/80 via-surface/90 to-surface" />
          <div className="absolute inset-0 bg-gradient-to-r from-surface/60 via-transparent to-surface/60" />
        </>
      ) : (
        <div className="absolute inset-0 gradient-mesh" />
      )}
      <div className="relative max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
        {eyebrow ? (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full mb-6">
            <span className="text-caption font-label-md uppercase tracking-wider">{eyebrow}</span>
          </div>
        ) : null}
        <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface mb-4">{title}</h1>
        {description ? (
          <p className="font-body-lg text-body-lg text-secondary max-w-2xl mx-auto">{description}</p>
        ) : null}
      </div>
    </section>
  )
}
