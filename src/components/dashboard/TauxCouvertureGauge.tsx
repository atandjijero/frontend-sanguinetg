import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../ui-shadcn/ui/card'
import { ChartContainer, type ChartConfig } from '../ui-shadcn/ui/chart'
import { SEQUENTIAL_BLUE } from '../../lib/chart-colors'
import { T } from '../../context/LanguageContext'

const chartConfig = { taux: { label: 'Taux de couverture' } } satisfies ChartConfig

export function TauxCouvertureGauge({ taux }: { taux: number | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <T>Alertes couvertes en moins d'1h</T>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {taux == null ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            <T>Pas encore de données de mobilisation.</T>
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="mx-auto aspect-square h-48 w-48">
            <RadialBarChart
              data={[{ name: 'taux', value: taux, fill: SEQUENTIAL_BLUE[450] }]}
              startAngle={90}
              endAngle={-270}
              innerRadius={70}
              outerRadius={95}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="value" background={{ fill: SEQUENTIAL_BLUE[100] }} cornerRadius={8} />
              <text x="50%" y="47%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-3xl font-semibold">
                {taux}%
              </text>
              <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-xs">
                <T>en moins d'1h</T>
              </text>
            </RadialBarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
