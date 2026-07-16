import React from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { FaqList } from '../components/sections/FaqList'
import { T } from '../context/LanguageContext'

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title={<T>Questions fréquentes</T>}
        description={<T>Tout ce qu'il faut savoir sur le fonctionnement et la portée de Sanguine TG.</T>}
      />

      <section className="py-20 px-margin-mobile md:px-margin-desktop">
        <FaqList />
      </section>
    </>
  )
}
