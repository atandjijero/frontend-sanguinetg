import { CentresDonExplorer } from '../../../components/CentresDonExplorer'
import { T } from '../../../context/LanguageContext'

export default function CentresPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">
          <T>Trouver un centre de don</T>
        </h2>
        <p className="text-sm text-muted-foreground">
          <T>Localisez le centre de collecte le plus proche de vous et son itinéraire.</T>
        </p>
      </div>

      <CentresDonExplorer />
    </div>
  )
}
