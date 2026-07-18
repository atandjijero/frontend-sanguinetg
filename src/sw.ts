/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'

declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: Array<{ url: string; revision: string | null }> }

precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()
self.skipWaiting()
self.addEventListener('activate', () => self.clients.claim())

interface PushPayload {
  title: string
  body: string
  url?: string
  badgeCount?: number
}

self.addEventListener('push', (event) => {
  let payload: PushPayload = { title: 'Sanguine TG', body: 'Nouvelle notification' }
  try {
    if (event.data) payload = event.data.json()
  } catch {
    // corps non-JSON : on garde le texte brut par défaut
  }

  event.waitUntil(
    (async () => {
      await self.registration.showNotification(payload.title, {
        body: payload.body,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        data: { url: payload.url ?? '/' },
      })

      if (typeof payload.badgeCount === 'number' && 'setAppBadge' in navigator) {
        if (payload.badgeCount > 0) {
          await navigator.setAppBadge(payload.badgeCount)
        } else {
          await navigator.clearAppBadge()
        }
      }
    })(),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data as { url?: string } | undefined)?.url ?? '/'

  event.waitUntil(
    (async () => {
      const clientsList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      const existant = clientsList.find((client) => client.url.includes(url))
      if (existant) {
        await existant.focus()
        return
      }
      await self.clients.openWindow(url)
    })(),
  )
})
