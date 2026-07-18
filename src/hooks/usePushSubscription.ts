import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api'

function urlBase64ToUint8Array(base64: string) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const base64Safe = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64Safe)
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}

function estSupporte() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
}

/** Abonnement aux notifications push (Web Push) pour le donneur connecté, appareil courant. */
export function usePushSubscription() {
  const [abonne, setAbonne] = useState(false)
  const [enCours, setEnCours] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)

  useEffect(() => {
    if (!estSupporte()) return
    navigator.serviceWorker.ready
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => setAbonne(!!subscription))
      .catch(() => undefined)
  }, [])

  const abonner = useCallback(async () => {
    if (!estSupporte()) {
      setErreur("Les notifications push ne sont pas prises en charge par ce navigateur.")
      return
    }
    setEnCours(true)
    setErreur(null)
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setErreur('Autorisation refusée. Activez les notifications dans les réglages du navigateur.')
        return
      }

      const { publicKey, configure } = await api.get<{ publicKey: string | null; configure: boolean }>(
        '/push/vapid-public-key',
      )
      if (!configure || !publicKey) {
        setErreur("Les notifications push ne sont pas encore configurées côté serveur.")
        return
      }

      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })

      const json = subscription.toJSON()
      await api.post('/push/subscribe', { endpoint: json.endpoint, keys: json.keys })
      setAbonne(true)
    } catch {
      setErreur("Impossible d'activer les notifications push.")
    } finally {
      setEnCours(false)
    }
  }, [])

  const desabonner = useCallback(async () => {
    setEnCours(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await api.delete(`/push/subscribe?endpoint=${encodeURIComponent(subscription.endpoint)}`)
        await subscription.unsubscribe()
      }
      setAbonne(false)
    } finally {
      setEnCours(false)
    }
  }, [])

  return { supporte: estSupporte(), abonne, enCours, erreur, abonner, desabonner }
}
