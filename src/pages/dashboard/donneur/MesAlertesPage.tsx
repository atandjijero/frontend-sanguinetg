import { useState } from 'react'
import { CheckIcon, MegaphoneIcon, XIcon } from 'lucide-react'
import { Button } from '../../../components/ui-shadcn/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui-shadcn/ui/card'
import { Badge } from '../../../components/ui-shadcn/ui/badge'
import { DataState } from '../../../components/dashboard/DataState'
import { useApiData } from '../../../hooks/useApiData'
import { api, ApiError } from '../../../lib/api'
import { GROUPE_SANGUIN_LABELS } from '../../../lib/constants'
import type { Alerte } from '../../../lib/types'

export default function MesAlertesPage() {
  const { data: alertes, isLoading, error, refetch } = useApiData<Alerte[]>('/alertes')
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  async function repondre(alerteId: string, statut: 'JE_VIENS' | 'INDISPONIBLE') {
    setPendingId(alerteId)
    setActionError(null)
    try {
      await api.post(`/alertes/${alerteId}/reponses`, { statut })
      await refetch()
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
          <MegaphoneIcon className="h-4 w-4" /> Alertes qui vous concernent
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {actionError && <p className="text-sm text-destructive">{actionError}</p>}
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
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(alerte.dateCreation).toLocaleString('fr-FR')}
                  </p>
                </div>
                {alerte.maReponse ? (
                  <Badge variant={alerte.maReponse === 'JE_VIENS' ? 'default' : 'secondary'}>
                    {alerte.maReponse === 'JE_VIENS' ? 'Vous venez' : 'Indisponible'}
                  </Badge>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={pendingId === alerte.id}
                      onClick={() => repondre(alerte.id, 'JE_VIENS')}
                    >
                      <CheckIcon className="h-4 w-4" /> Je viens
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={pendingId === alerte.id}
                      onClick={() => repondre(alerte.id, 'INDISPONIBLE')}
                    >
                      <XIcon className="h-4 w-4" /> Indisponible
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
