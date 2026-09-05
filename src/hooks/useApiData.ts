import { useCallback, useEffect, useState } from 'react'
import { api, ApiError } from '../lib/api'

export function useApiData<T>(path: string | null, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // silencieux=true : pour un rafraîchissement périodique en arrière-plan qui ne doit pas
  // remplacer le contenu déjà affiché par un spinner ni un message d'erreur transitoire.
  const refetch = useCallback(async (options?: { silencieux?: boolean }) => {
    if (!path) {
      setIsLoading(false)
      return
    }
    if (!options?.silencieux) {
      setIsLoading(true)
      setError(null)
    }
    try {
      const result = await api.get<T>(path)
      setData(result)
      if (!options?.silencieux) setError(null)
    } catch (err) {
      if (!options?.silencieux) {
        setError(err instanceof ApiError ? err.message : 'Une erreur est survenue')
      }
    } finally {
      if (!options?.silencieux) setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, ...deps])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, isLoading, error, refetch }
}
