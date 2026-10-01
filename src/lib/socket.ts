import { io, type Socket } from 'socket.io-client'
import { API_URL, api, getAccessToken } from './api'

export function connecterMessagerie(): Socket {
  return io(`${API_URL}/messagerie`, {
    transports: ['websocket', 'polling'],
    auth: async (cb) => {
      try {
        await api.refresh()
      } catch {
        // Ignoré : si le rafraîchissement échoue, la connexion sera de toute façon
        // rejetée côté serveur avec le token existant (session réellement expirée).
      }
      cb({ token: getAccessToken() })
    },
  })
}
