import { Link } from 'react-router-dom'
import { MessageCircleQuestionIcon, StethoscopeIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui-shadcn/ui/card'
import { Badge } from '../../../components/ui-shadcn/ui/badge'
import { Button } from '../../../components/ui-shadcn/ui/button'
import { DataState } from '../../../components/dashboard/DataState'
import { useApiData } from '../../../hooks/useApiData'
import { CATEGORIE_CONSEIL_LABELS } from '../../../lib/constants'
import { T } from '../../../context/LanguageContext'
import type { ConseilSante } from '../../../lib/types'

export default function ConseilsSantePage() {
  const { data: conseils, isLoading, error } = useApiData<ConseilSante[]>('/conseils')

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="flex items-center gap-2">
          <StethoscopeIcon className="h-4 w-4" /> <T>Conseils santé du CNTS</T>
        </CardTitle>
        <Button asChild variant="outline" size="sm">
          <Link to="/espace-donneur/messagerie">
            <MessageCircleQuestionIcon className="h-4 w-4" />
            <T>Une question ?</T>
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <DataState isLoading={isLoading} error={error} isEmpty={!conseils?.length} emptyLabel="Aucun conseil publié pour le moment.">
          <div className="space-y-4">
            {conseils?.map((conseil) => (
              <div key={conseil.id} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium">
                    <T>{conseil.titre}</T>
                  </h3>
                  <Badge variant="outline">
                    <T>{CATEGORIE_CONSEIL_LABELS[conseil.categorie]}</T>
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  <T>{conseil.contenu}</T>
                </p>
              </div>
            ))}
          </div>
        </DataState>
      </CardContent>
    </Card>
  )
}
