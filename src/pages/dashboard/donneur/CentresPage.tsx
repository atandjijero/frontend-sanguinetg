import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Building2Icon, NavigationIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui-shadcn/ui/card'
import { DataState } from '../../../components/dashboard/DataState'
import { CentresMap } from '../../../components/maps/CentresMap'
import { ItineraireMap, type ItineraireInfo } from '../../../components/maps/ItineraireMap'
import { useApiData } from '../../../hooks/useApiData'
import { distanceKm, type Coordonnees } from '../../../lib/geo'
import type { CentreDon } from '../../../lib/types'

type CentreGeolocalise = CentreDon & { latitude: number; longitude: number }

export default function CentresPage() {
  const { data: centres, isLoading, error } = useApiData<CentreDon[]>('/centres-don')
  const [searchParams] = useSearchParams()
  const [position, setPosition] = useState<Coordonnees | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get('centre'))
  const [itineraire, setItineraire] = useState<ItineraireInfo | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }, [])

  const centresGeolocalises = useMemo<CentreGeolocalise[]>(
    () => (centres ?? []).filter((c): c is CentreGeolocalise => c.latitude !== null && c.longitude !== null),
    [centres],
  )

  const centresTries = useMemo(() => {
    if (!position) return centresGeolocalises
    return [...centresGeolocalises].sort(
      (a, b) =>
        distanceKm(position, { lat: a.latitude, lng: a.longitude }) -
        distanceKm(position, { lat: b.latitude, lng: b.longitude }),
    )
  }, [centresGeolocalises, position])

  const destination = centresTries.find((c) => c.id === selectedId) ?? centresTries[0] ?? null

  useEffect(() => {
    setItineraire(null)
  }, [destination?.id, position])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Trouver un centre de don</h2>
        <p className="text-sm text-muted-foreground">
          Localisez le centre de collecte le plus proche de vous et son itinéraire.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardContent className="p-4">
            <DataState isLoading={isLoading} error={error} isEmpty={!centresGeolocalises.length}>
              {position && destination ? (
                <ItineraireMap
                  className="w-full h-96 rounded-xl"
                  origine={position}
                  destination={{ lat: destination.latitude, lng: destination.longitude, nom: destination.nom }}
                  onItineraireCalcule={setItineraire}
                />
              ) : (
                <CentresMap
                  className="w-full h-96 rounded-xl"
                  marqueurs={centresGeolocalises.map((c) => ({ id: c.id, nom: c.nom, latitude: c.latitude, longitude: c.longitude }))}
                  selectedId={destination?.id ?? null}
                />
              )}
            </DataState>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2Icon className="h-4 w-4" /> Centres {position ? 'les plus proches' : 'de collecte'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <DataState isLoading={isLoading} error={error} isEmpty={!centresTries.length}>
              {centresTries.map((c) => {
                const distanceVolOiseau = position ? distanceKm(position, { lat: c.latitude, lng: c.longitude }) : null
                const estSelectionne = destination?.id === c.id
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    className={`w-full text-left rounded-lg border p-3 transition ${
                      estSelectionne ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{c.nom}</span>
                      {distanceVolOiseau !== null && (
                        <span className="text-xs text-muted-foreground shrink-0">{distanceVolOiseau.toFixed(1)} km</span>
                      )}
                    </div>
                    {c.adresse && <p className="text-xs text-muted-foreground mt-1">{c.adresse}</p>}
                    {estSelectionne && itineraire && (
                      <p className="text-xs text-primary mt-2 flex items-center gap-1">
                        <NavigationIcon className="h-3 w-3" /> {itineraire.distanceTexte} · {itineraire.dureeTexte} en voiture
                      </p>
                    )}
                  </button>
                )
              })}
            </DataState>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
