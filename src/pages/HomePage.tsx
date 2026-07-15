import { HeroSection } from '../components/sections/HeroSection'
import { StatsSection } from '../components/sections/StatsSection'
import { HowItWorksSection } from '../components/sections/HowItWorksSection'
import { InstitutionalSection } from '../components/sections/InstitutionalSection'
import { FinalCtaSection } from '../components/sections/FinalCtaSection'
import { AboutContent } from '../components/sections/AboutContent'
import { FaqList } from '../components/sections/FaqList'
import { ContactSection } from '../components/sections/ContactSection'
import { useApiData } from '../hooks/useApiData'
import type { CleImage, ImageAccueil } from '../lib/types'

export default function HomePage() {
  const { data: images } = useApiData<ImageAccueil[]>('/images')
  const imageUrl = (cle: CleImage) => images?.find((img) => img.cle === cle)?.url

  return (
    <>
      <HeroSection imageUrl={imageUrl('HERO')} />
      <StatsSection />
      <HowItWorksSection />
      <InstitutionalSection
        doctorImageUrl={imageUrl('INSTITUTIONAL_DOCTOR')}
        vialsImageUrl={imageUrl('INSTITUTIONAL_VIALS')}
      />
      <FinalCtaSection />
      <AboutContent laboratoryImageUrl={imageUrl('ABOUT_LABORATORY')} />
      <section className="py-20 bg-surface-alt border-y border-outline-variant" id="faq">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-12">
            <h2 className="font-headline-lg text-headline-lg mb-4">Questions fréquentes</h2>
            <p className="text-secondary max-w-2xl mx-auto">
              Tout ce qu'il faut savoir sur le fonctionnement et la portée de Sanguine TG.
            </p>
          </div>
          <FaqList />
        </div>
      </section>
      <ContactSection />
    </>
  )
}
