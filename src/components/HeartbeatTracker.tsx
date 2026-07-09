import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { api } from '../lib/api'

const SESSION_STORAGE_KEY = 'sanguine_session_id'
const INTERVAL_MS = 60_000

function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_STORAGE_KEY)
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem(SESSION_STORAGE_KEY, sessionId)
  }
  return sessionId
}

/**
 * Signale la présence du visiteur (connecté ou non) toutes les 60s et à chaque
 * changement de page, pour alimenter les statistiques de fréquentation en temps
 * réel du SUPERADMIN. Ne rend rien visuellement.
 */
export function HeartbeatTracker() {
  const location = useLocation()

  useEffect(() => {
    const sessionId = getOrCreateSessionId()

    function envoyer() {
      api.post('/analytics/heartbeat', { sessionId, chemin: location.pathname }).catch(() => {
        // best-effort : un heartbeat manqué n'a pas d'impact fonctionnel
      })
    }

    envoyer()
    const interval = setInterval(envoyer, INTERVAL_MS)
    return () => clearInterval(interval)
  }, [location.pathname])

  return null
}
