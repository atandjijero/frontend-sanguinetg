import { CentresDonExplorer } from '../../../components/CentresDonExplorer'

export default function CentresPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Trouver un centre de don</h2>
        <p className="text-sm text-muted-foreground">
          Localisez le centre de collecte le plus proche de vous et son itinéraire.
        </p>
      </div>

      <CentresDonExplorer />
    </div>
  )
}
