import { useMemo } from 'react'
import { Cell, Pie, PieChart } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../ui-shadcn/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '../ui-shadcn/ui/card'
import { CATEGORICAL_LIGHT } from '../../lib/chart-colors'
import { GROUPES_SANGUINS, GROUPE_SANGUIN_LABELS } from '../../lib/constants'
import type { Utilisateur } from '../../lib/types'

export function DonneurGroupeDonut({ donneurs }: { donneurs: Utilisateur[] }) {
  const { data, config, total } = useMemo(() => {
    const counts = new Map<string, number>()
    for (const groupe of GROUPES_SANGUINS) counts.set(groupe, 0)
    for (const d of donneurs) {
      if (d.groupeSanguin) counts.set(d.groupeSanguin, (counts.get(d.groupeSanguin) ?? 0) + 1)
    }

    const cfg: ChartConfig = {}
    GROUPES_SANGUINS.forEach((groupe, i) => {
      cfg[groupe] = { label: GROUPE_SANGUIN_LABELS[groupe], color: CATEGORICAL_LIGHT[i] }
    })

    const rows = GROUPES_SANGUINS.filter((g) => (counts.get(g) ?? 0) > 0).map((groupe) => ({
      groupe,
      label: GROUPE_SANGUIN_LABELS[groupe],
      value: counts.get(groupe) ?? 0,
      fill: `var(--color-${groupe})`,
    }))

    return { data: rows, config: cfg, total: donneurs.filter((d) => d.groupeSanguin).length }
  }, [donneurs])

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Répartition des donneurs par groupe sanguin</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground py-8 text-center">
            Aucun donneur avec un groupe sanguin renseigné pour le moment.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition des donneurs par groupe sanguin</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ChartContainer config={config} className="mx-auto aspect-square h-56 w-56 shrink-0">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="groupe" />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="groupe"
                innerRadius={62}
                outerRadius={90}
                paddingAngle={2}
                strokeWidth={2}
                stroke="#ffffff"
              >
                {data.map((entry) => (
                  <Cell key={entry.groupe} fill={entry.fill} />
                ))}
              </Pie>
              <text
                x="50%"
                y="47%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground text-3xl font-semibold"
              >
                {total}
              </text>
              <text
                x="50%"
                y="60%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-xs"
              >
                donneurs
              </text>
            </PieChart>
          </ChartContainer>

          {/* Légende = vue tabulaire accessible (relief requis par la palette pour les teintes sous 3:1) */}
          <ul className="w-full space-y-1.5 text-sm">
            {data.map((entry) => (
              <li key={entry.groupe} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-secondary">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: entry.fill }}
                  />
                  {entry.label}
                </span>
                <span className="font-medium tabular-nums">
                  {entry.value} · {Math.round((entry.value / total) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
