import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { ImageIcon, UploadCloudIcon } from 'lucide-react'
import { Button } from '../../../components/ui-shadcn/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui-shadcn/ui/card'
import { useApiData } from '../../../hooks/useApiData'
import { api, ApiError } from '../../../lib/api'
import { T } from '../../../context/LanguageContext'
import type { CleImage, ImageAccueil } from '../../../lib/types'

interface Emplacement {
  cle: CleImage
  titre: string
  description: string
  fallback: string
}

const EMPLACEMENTS: Emplacement[] = [
  {
    cle: 'HERO',
    titre: "Bannière d'accueil",
    description: 'Image de fond de la section principale (Hero) de la page d’accueil.',
    fallback: '/images/donor-care.jpg',
  },
  {
    cle: 'INSTITUTIONAL_DOCTOR',
    titre: 'Institution — médecin',
    description: 'Première photo de la section institutionnelle.',
    fallback: '/images/institutional-doctor.jpg',
  },
  {
    cle: 'INSTITUTIONAL_VIALS',
    titre: 'Institution — matériel',
    description: 'Seconde photo de la section institutionnelle.',
    fallback: '/images/institutional-vials.jpg',
  },
  {
    cle: 'ABOUT_LABORATORY',
    titre: 'À propos — laboratoire',
    description: 'Photo de la section « Qui sommes-nous ».',
    fallback: '/images/about-laboratory.jpg',
  },
]

export default function ImagesPage() {
  const { data: images, isLoading, error, refetch } = useApiData<ImageAccueil[]>('/images')

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" /> <T>Images de la page d'accueil</T>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            <T>
              Remplacez les visuels affichés sur le site public. Les fichiers sont stockés sur Cloudinary ; tant
              qu'aucune image n'est envoyée, le visuel par défaut du site reste affiché.
            </T>
          </p>
          {error && (
            <p className="text-sm text-destructive mb-4">
              <T>{error}</T>
            </p>
          )}
          <div className="grid gap-6 sm:grid-cols-2">
            {EMPLACEMENTS.map((emplacement) => (
              <ImageSlot
                key={emplacement.cle}
                emplacement={emplacement}
                actuelle={images?.find((img) => img.cle === emplacement.cle)}
                isLoading={isLoading}
                onUploaded={refetch}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ImageSlot({
  emplacement,
  actuelle,
  isLoading,
  onUploaded,
}: {
  emplacement: Emplacement
  actuelle?: ImageAccueil
  isLoading: boolean
  onUploaded: () => void | Promise<void>
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      await api.upload(`/images/${emplacement.cle}`, formData)
      await onUploaded()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Envoi de l'image impossible")
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="border border-outline-variant rounded-2xl overflow-hidden">
      <div className="aspect-video bg-surface-container">
        {!isLoading && (
          <img
            src={actuelle?.url ?? emplacement.fallback}
            alt={emplacement.titre}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="p-4 space-y-3">
        <div>
          <p className="font-medium">
            <T>{emplacement.titre}</T>
          </p>
          <p className="text-sm text-muted-foreground">
            <T>{emplacement.description}</T>
          </p>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => inputRef.current?.click()}>
          <UploadCloudIcon className="h-4 w-4" />
          <T>{uploading ? 'Envoi en cours...' : "Remplacer l'image"}</T>
        </Button>
        {error && (
          <p className="text-sm text-destructive">
            <T>{error}</T>
          </p>
        )}
      </div>
    </div>
  )
}
