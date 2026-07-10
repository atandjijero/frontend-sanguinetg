import { useEffect, useMemo, useState } from 'react'
import { GoogleMap, InfoWindowF, MarkerF, useJsApiLoader } from '@react-google-maps/api'

const LOME_CENTER = { lat: 6.1319, lng: 1.2228 }

export interface CarteMarqueur {
  id: string
  nom: string
  latitude: number
  longitude: number
}

interface CentresMapProps {
  marqueurs: CarteMarqueur[]
  selectedId?: string | null
  className?: string
  zoom?: number
}

export function CentresMap({ marqueurs, selectedId = null, className = 'w-full h-full', zoom = 12 }: CentresMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-maps-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  })
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [ouvertId, setOuvertId] = useState<string | null>(null)

  const center = useMemo(() => {
    if (marqueurs.length === 0) return LOME_CENTER
    if (marqueurs.length === 1) return { lat: marqueurs[0].latitude, lng: marqueurs[0].longitude }
    const somme = marqueurs.reduce(
      (acc, m) => ({ lat: acc.lat + m.latitude, lng: acc.lng + m.longitude }),
      { lat: 0, lng: 0 },
    )
    return { lat: somme.lat / marqueurs.length, lng: somme.lng / marqueurs.length }
  }, [marqueurs])

  useEffect(() => {
    if (!map || !selectedId) return
    const marqueur = marqueurs.find((m) => m.id === selectedId)
    if (!marqueur) return
    map.panTo({ lat: marqueur.latitude, lng: marqueur.longitude })
    map.setZoom(15)
    setOuvertId(selectedId)
  }, [map, selectedId, marqueurs])

  if (loadError) {
    return (
      <div className={`${className} flex items-center justify-center bg-surface-container-lowest text-secondary text-sm rounded-2xl`}>
        Impossible de charger la carte.
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className={`${className} flex items-center justify-center bg-surface-container-lowest text-secondary text-sm rounded-2xl animate-pulse`}>
        Chargement de la carte…
      </div>
    )
  }

  return (
    <GoogleMap mapContainerClassName={className} center={center} zoom={zoom} onLoad={setMap}>
      {marqueurs.map((m) => (
        <MarkerF
          key={m.id}
          position={{ lat: m.latitude, lng: m.longitude }}
          title={m.nom}
          onClick={() => setOuvertId(m.id)}
          zIndex={m.id === selectedId ? 999 : undefined}
        >
          {ouvertId === m.id && (
            <InfoWindowF onCloseClick={() => setOuvertId(null)}>
              <span className="text-sm font-medium text-gray-900">{m.nom}</span>
            </InfoWindowF>
          )}
        </MarkerF>
      ))}
    </GoogleMap>
  )
}
