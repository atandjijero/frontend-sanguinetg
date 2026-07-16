import { GiftIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui-shadcn/ui/card'
import { Badge } from '../../../components/ui-shadcn/ui/badge'
import { DataState } from '../../../components/dashboard/DataState'
import { useApiData } from '../../../hooks/useApiData'
import { TYPE_RECOMPENSE_LABELS } from '../../../lib/constants'
import { T } from '../../../context/LanguageContext'
import type { Recompense } from '../../../lib/types'

const STATUT_VARIANT: Record<Recompense['statut'], 'default' | 'secondary' | 'destructive'> = {
  ATTRIBUEE: 'default',
  UTILISEE: 'secondary',
  EXPIREE: 'destructive',
}

export default function MesRecompensesPage() {
  const { data: recompenses, isLoading, error } = useApiData<Recompense[]>('/recompenses')

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
            {recompenses?.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <div className="font-medium">
                    <T>{TYPE_RECOMPENSE_LABELS[r.type]}</T>
                  </div>
                  <div className="text-sm text-muted-foreground">{r.description}</div>
                </div>
                <Badge variant={STATUT_VARIANT[r.statut]}>{r.statut}</Badge>
              </div>
            ))}
          </div>
        </DataState>
      </CardContent>
    </Card>
  )
}
