import { useState } from 'react'
import { DownloadIcon, GiftIcon, Loader2Icon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui-shadcn/ui/card'
import { Badge } from '../../../components/ui-shadcn/ui/badge'
import { Button } from '../../../components/ui-shadcn/ui/button'
import { DataState } from '../../../components/dashboard/DataState'
import { useApiData } from '../../../hooks/useApiData'
import { useAuth } from '../../../context/AuthContext'
import { TYPE_RECOMPENSE_LABELS } from '../../../lib/constants'
import { genererRecompensePdf } from '../../../lib/recompensePdf'
import { T } from '../../../context/LanguageContext'
import type { Recompense } from '../../../lib/types'

const STATUT_VARIANT: Record<Recompense['statut'], 'default' | 'secondary' | 'destructive'> = {
  ATTRIBUEE: 'default',
  UTILISEE: 'secondary',
  EXPIREE: 'destructive',
}

export default function MesRecompensesPage() {
  const { user } = useAuth()
  const { data: recompenses, isLoading, error } = useApiData<Recompense[]>('/recompenses')
  const [telechargementId, setTelechargementId] = useState<string | null>(null)

  function handleTelecharger(r: Recompense) {
    if (!user) return
    setTelechargementId(r.id)
    try {
      genererRecompensePdf(user, r)
    } finally {
      setTelechargementId(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GiftIcon className="h-4 w-4" /> <T>Mes récompenses</T>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DataState
          isLoading={isLoading}
          error={error}
          isEmpty={!recompenses?.length}
          emptyLabel="Pas encore de récompense — elles arrivent après votre premier don !"
        >
          <div className="space-y-3">
            {recompenses?.map((r) => {
              const telechargeable = r.type === 'BADGE' || r.type === 'CERTIFICAT'
              return (
                <div key={r.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-4">
                  <div className="min-w-0">
                    <div className="font-medium">
                      <T>{TYPE_RECOMPENSE_LABELS[r.type]}</T>
                    </div>
                    <div className="text-sm text-muted-foreground">{r.description}</div>
                    {r.critereAttribution && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        <T>Critère :</T> {r.critereAttribution}
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {telechargeable && (
                      <Button variant="outline" size="sm" onClick={() => handleTelecharger(r)} disabled={telechargementId === r.id}>
                        {telechargementId === r.id ? (
                          <Loader2Icon className="h-4 w-4 animate-spin" />
                        ) : (
                          <DownloadIcon className="h-4 w-4" />
                        )}
                        <T>Télécharger</T>
                      </Button>
                    )}
                    <Badge variant={STATUT_VARIANT[r.statut]}>{r.statut}</Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </DataState>
      </CardContent>
    </Card>
  )
}
