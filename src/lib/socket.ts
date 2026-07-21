import { io, type Socket } from 'socket.io-client'
import { API_URL, api, getAccessToken } from './api'

/**
 * Les tokens d'accès expirent en 15 min (voir JWT_ACCESS_EXPIRES_IN) : si l'onglet reste
 * ouvert plus longtemps et que la connexion tombe (coupure réseau, redéploiement backend...),
 * une simple reconnexion socket.io réutiliserait le token capturé au premier appel — expiré
 * entretemps — et échouerait silencieusement. `auth` en fonction est ré-évalué à chaque
 * (re)connexion, donc on en profite pour rafraîchir le token avant de (re)tenter la poignée
 * de main.
 */
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
