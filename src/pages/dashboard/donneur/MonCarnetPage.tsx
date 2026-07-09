import { BookHeartIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui-shadcn/ui/card'
import { Badge } from '../../../components/ui-shadcn/ui/badge'
import { DataState } from '../../../components/dashboard/DataState'
import { useApiData } from '../../../hooks/useApiData'
import { TYPE_RECOMPENSE_LABELS } from '../../../lib/constants'
import type { CarnetDigital } from '../../../lib/types'

export default function MonCarnetPage() {
  const { data: carnets, isLoading, error } = useApiData<CarnetDigital[]>('/carnets')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookHeartIcon className="h-4 w-4" /> Mon carnet de don
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DataState
          isLoading={isLoading}
          error={error}
          isEmpty={!carnets?.length}
          emptyLabel="Vous n'avez pas encore de don enregistré. Merci de vous manifester lors de votre prochain passage au CNTS !"
        >
          <div className="space-y-3">
            {carnets?.map((carnet) => (
              <div key={carnet.id} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{new Date(carnet.dateDon).toLocaleDateString('fr-FR')}</span>
                  {carnet.recompense && (
                    <Badge variant="outline">{TYPE_RECOMPENSE_LABELS[carnet.recompense.type]}</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{carnet.centreDon}</p>
                {carnet.messageRemerciement && (
                  <p className="text-sm mt-2 italic">"{carnet.messageRemerciement}"</p>
                )}
                {carnet.rappelProchaineDate && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Prochain don possible à partir du {new Date(carnet.rappelProchaineDate).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </DataState>
      </CardContent>
    </Card>
  )
}
