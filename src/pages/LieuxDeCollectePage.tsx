import { CentresDonExplorer } from '../components/CentresDonExplorer'
import { T } from '../context/LanguageContext'

export default function LieuxDeCollectePage() {
  return (
    <>
      <div className="pt-16 pb-4 max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop text-center">
        <h1 className="font-headline-lg text-headline-lg mb-3">
          <T>Les lieux de collecte du CNTS à Lomé</T>
        </h1>
        <p className="text-secondary">
          <T>Localisez le centre de don le plus proche de vous et calculez votre itinéraire — sans créer de compte.</T>
        </p>
      </div>

      <section className="py-12">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <CentresDonExplorer />
        </div>
      </section>
    </>
  )
}
