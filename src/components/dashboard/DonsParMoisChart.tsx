import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '../ui-shadcn/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '../ui-shadcn/ui/card'
import { SEQUENTIAL_BLUE } from '../../lib/chart-colors'
import { T } from '../../context/LanguageContext'
import type { CarnetDigital } from '../../lib/types'

const MOIS_COURTS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']

const chartConfig = {
  dons: { label: 'Dons enregistrés', color: SEQUENTIAL_BLUE[450] },
} satisfies ChartConfig

export function DonsParMoisChart({ carnets }: { carnets: CarnetDigital[] }) {
  const data = useMemo(() => {
    const now = new Date()
    const buckets: { key: string; mois: string; dons: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, mois: MOIS_COURTS[d.getMonth()], dons: 0 })
    }
    const byKey = new Map(buckets.map((b) => [b.key, b]))
    for (const carnet of carnets) {
      const d = new Date(carnet.dateDon)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      const bucket = byKey.get(key)
      if (bucket) bucket.dons += 1
    }
    return buckets
  }, [carnets])

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <T>Dons enregistrés — 6 derniers mois</T>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-56 w-full">
          <BarChart data={data} margin={{ left: -12 }}>
            <CartesianGrid vertical={false} stroke="#e1e0d9" />
            <XAxis dataKey="mois" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} width={28} />
            <ChartTooltip content={<ChartTooltipContent hideLabel={false} labelKey="mois" />} />
            <Bar dataKey="dons" fill="var(--color-dons)" radius={[4, 4, 0, 0]} maxBarSize={24} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
