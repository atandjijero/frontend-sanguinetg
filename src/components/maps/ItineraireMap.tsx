import { useCallback, useEffect, useState } from 'react'
import { DirectionsRenderer, DirectionsService, GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import type { Coordonnees } from '../../lib/geo'

export interface ItineraireInfo {
  distanceTexte: string
  dureeTexte: string
}

interface ItineraireMapProps {
  origine: Coordonnees
  destination: Coordonnees & { nom: string }
  onItineraireCalcule?: (info: ItineraireInfo | null) => void
  className?: string
}

export function ItineraireMap({ origine, destination, onItineraireCalcule, className = 'w-full h-full' }: ItineraireMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-maps-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  })
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
  const [demandeEnvoyee, setDemandeEnvoyee] = useState(false)

  useEffect(() => {
    setDirections(null)
    setDemandeEnvoyee(false)
  }, [origine.lat, origine.lng, destination.lat, destination.lng])

  const handleDirections = useCallback(
    (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
      setDemandeEnvoyee(true)
      if (status === 'OK' && result) {
        setDirections(result)
        const trajet = result.routes[0]?.legs[0]
        onItineraireCalcule?.(
          trajet ? { distanceTexte: trajet.distance?.text ?? '', dureeTexte: trajet.duration?.text ?? '' } : null,
        )
      } else {
        onItineraireCalcule?.(null)
      }
    },
    [onItineraireCalcule],
  )

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
    <GoogleMap mapContainerClassName={className} center={origine} zoom={13}>
      {!directions && !demandeEnvoyee && (
        <DirectionsService
          options={{ origin: origine, destination, travelMode: google.maps.TravelMode.DRIVING }}
          callback={handleDirections}
        />
      )}
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  )
}
