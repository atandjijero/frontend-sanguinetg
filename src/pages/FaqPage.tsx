import React from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { FaqList } from '../components/sections/FaqList'

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Questions fréquentes"
        description="Tout ce qu'il faut savoir sur le fonctionnement et la portée de Sanguine TG."
      />

      <section className="py-20 px-margin-mobile md:px-margin-desktop">
        <FaqList />
      </section>
    </>
  )
}
