import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckIcon, MapPinIcon, MegaphoneIcon, XIcon } from 'lucide-react'
import { Button } from '../../../components/ui-shadcn/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui-shadcn/ui/card'
import { Badge } from '../../../components/ui-shadcn/ui/badge'
import { DataState } from '../../../components/dashboard/DataState'
import { useApiData } from '../../../hooks/useApiData'
import { useAuth } from '../../../context/AuthContext'
import { api, ApiError } from '../../../lib/api'
import { GROUPE_SANGUIN_LABELS } from '../../../lib/constants'
import { T } from '../../../context/LanguageContext'
import type { Alerte } from '../../../lib/types'
import { useNotifications } from '../../../context/NotificationsContext'

export default function MesAlertesPage() {
  const { user } = useAuth()
  const { data: alertes, isLoading, error, refetch } = useApiData<Alerte[]>('/alertes')
  const { notifyRefresh } = useNotifications()
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  async function repondre(alerteId: string, statut: 'JE_VIENS' | 'INDISPONIBLE') {
    setPendingId(alerteId)
    setActionError(null)
    try {
      await api.post(`/alertes/${alerteId}/reponses`, { statut })
      await refetch()
      notifyRefresh()
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Impossible d\'enregistrer votre réponse')
    } finally {
      setPendingId(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MegaphoneIcon className="h-4 w-4" /> <T>Alertes qui vous concernent</T>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {actionError && (
          <p className="text-sm text-destructive">
            <T>{actionError}</T>
          </p>
        )}
        <DataState
          isLoading={isLoading}
          error={error}
          isEmpty={!alertes?.length}
          emptyLabel="Aucune alerte compatible avec votre profil pour le moment."
        >
          <div className="space-y-3">
            {alertes?.map((alerte) => (
              <div key={alerte.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge>{GROUPE_SANGUIN_LABELS[alerte.groupeSanguinRequis]}</Badge>
                    <span className="font-medium">{alerte.quartier?.nom}</span>
                  </div>
                  {user?.groupeSanguin && user.groupeSanguin !== alerte.groupeSanguinRequis && (
                    <p className="text-xs text-tertiary mt-1">
                      <T>Vous êtes</T> {GROUPE_SANGUIN_LABELS[user.groupeSanguin]}, <T>compatible avec les receveurs</T>{' '}
                      {GROUPE_SANGUIN_LABELS[alerte.groupeSanguinRequis]}.
                    </p>
                  )}
                  {alerte.centreDon && (
                    <Link
                      to={`/espace-donneur/centres?centre=${alerte.centreDon.id}`}
                      className="text-xs flex items-center gap-1 mt-1 text-primary hover:underline w-fit"
                    >
                      <MapPinIcon className="h-3 w-3 shrink-0" />
                      <T>Rendez-vous au centre</T> <strong>{alerte.centreDon.nom}</strong>
                      {alerte.centreDon.adresse ? ` — ${alerte.centreDon.adresse}` : ''}
                    </Link>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(alerte.dateCreation).toLocaleString('fr-FR')}
                  </p>
                </div>
                {alerte.maReponse ? (
                  <Badge variant={alerte.maReponse === 'JE_VIENS' ? 'default' : 'secondary'}>
                    <T>{alerte.maReponse === 'JE_VIENS' ? 'Répondu' : 'Refusé'}</T>
                  </Badge>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={pendingId === alerte.id}
                      onClick={() => repondre(alerte.id, 'JE_VIENS')}
                    >
                      <CheckIcon className="h-4 w-4" /> <T>Je viens</T>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={pendingId === alerte.id}
                      onClick={() => repondre(alerte.id, 'INDISPONIBLE')}
                    >
                      <XIcon className="h-4 w-4" /> <T>Indisponible</T>
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </DataState>
      </CardContent>
    </Card>
  )
}
