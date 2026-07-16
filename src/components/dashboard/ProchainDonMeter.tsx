import { useMemo } from 'react'
import { RadialBar, RadialBarChart, PolarAngleAxis } from 'recharts'
import { CheckCircle2Icon, HeartHandshakeIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui-shadcn/ui/card'
import { ChartContainer, type ChartConfig } from '../ui-shadcn/ui/chart'
import { SEQUENTIAL_BLUE, STATUS } from '../../lib/chart-colors'
import { T } from '../../context/LanguageContext'
import type { CarnetDigital } from '../../lib/types'

const chartConfig = { progression: { label: 'Progression' } } satisfies ChartConfig

export function ProchainDonMeter({ carnets }: { carnets: CarnetDigital[] }) {
  const etat = useMemo(() => {
    if (carnets.length === 0) return { statut: 'jamais-donne' as const }

    const dernier = [...carnets].sort((a, b) => new Date(b.dateDon).getTime() - new Date(a.dateDon).getTime())[0]
    if (!dernier.rappelProchaineDate) return { statut: 'jamais-donne' as const }

    const debut = new Date(dernier.dateDon).getTime()
    const fin = new Date(dernier.rappelProchaineDate).getTime()
    const maintenant = Date.now()

    if (maintenant >= fin) return { statut: 'disponible' as const }

    const progres = Math.min(100, Math.max(0, ((maintenant - debut) / (fin - debut)) * 100))
    const joursRestants = Math.ceil((fin - maintenant) / (1000 * 60 * 60 * 24))
    return { statut: 'en-attente' as const, progres, joursRestants }
  }, [carnets])

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <T>Prochain don possible</T>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {etat.statut === 'jamais-donne' && (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <HeartHandshakeIcon className="h-10 w-10 text-primary" />
            <p className="text-sm font-medium">
              <T>Prêt(e) pour votre premier don</T>
            </p>
            <p className="text-xs text-muted-foreground">
              <T>Répondez à une alerte compatible pour commencer.</T>
            </p>
          </div>
        )}

        {etat.statut === 'disponible' && (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <CheckCircle2Icon className="h-10 w-10" style={{ color: STATUS.good }} />
            <p className="text-sm font-medium" style={{ color: STATUS.good }}>
              <T>Vous pouvez donner dès maintenant</T>
            </p>
            <p className="text-xs text-muted-foreground">
              <T>Le délai réglementaire de 90 jours est écoulé.</T>
            </p>
          </div>
        )}

        {etat.statut === 'en-attente' && (
          <ChartContainer config={chartConfig} className="mx-auto aspect-square h-48 w-48">
            <RadialBarChart
              data={[{ name: 'progression', value: etat.progres, fill: SEQUENTIAL_BLUE[450] }]}
              startAngle={90}
              endAngle={-270}
              innerRadius={70}
              outerRadius={95}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="value" background={{ fill: SEQUENTIAL_BLUE[100] }} cornerRadius={8} />
              <text x="50%" y="47%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-3xl font-semibold">
                {etat.joursRestants}
              </text>
              <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-xs">
                <T>{`jour${etat.joursRestants > 1 ? 's' : ''} restant${etat.joursRestants > 1 ? 's' : ''}`}</T>
              </text>
            </RadialBarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
