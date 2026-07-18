import { Card, CardContent, CardHeader, CardTitle } from '../ui-shadcn/ui/card'
import { Badge } from '../ui-shadcn/ui/badge'
import { GROUPE_SANGUIN_LABELS } from '../../lib/constants'
import { T } from '../../context/LanguageContext'
import type { Alerte } from '../../lib/types'

export function DernieresAlertesTable({ alertes }: { alertes: Alerte[] }) {
  const recentes = [...alertes]
    .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <T>Dernières alertes</T>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentes.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            <T>Aucune alerte pour le moment.</T>
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {recentes.map((alerte) => (
              <li key={alerte.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {GROUPE_SANGUIN_LABELS[alerte.groupeSanguinRequis]} · {alerte.quartier?.nom ?? '—'}
                  </p>
                  <p className="text-xs text-muted-foreground">{new Date(alerte.dateCreation).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {alerte.resume ? (
                    <span className="text-xs text-muted-foreground">
                      {alerte.resume.jeViens} <T>réponses</T>
                    </span>
                  ) : null}
                  <Badge variant={alerte.statut === 'OUVERTE' ? 'default' : 'secondary'}>{alerte.statut}</Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
