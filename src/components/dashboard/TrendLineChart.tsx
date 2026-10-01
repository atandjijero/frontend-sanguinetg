import type { ReactNode } from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '../ui-shadcn/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '../ui-shadcn/ui/card'

export interface TrendSeries {
  key: string
  label: string
  color: string
}

export function TrendLineChart({
  title,
  data,
  series,
  xKey = 'label',
}: {
  title: ReactNode
  data: Record<string, string | number>[]
  series: TrendSeries[]
  xKey?: string
}) {
  const config: ChartConfig = Object.fromEntries(
    series.map((s) => [s.key, { label: s.label, color: s.color }])
  )

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 p-4 pb-2">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        {series.length > 1 && (
          <ul className="flex flex-wrap items-center gap-3">
            {series.map((s) => (
              <li key={s.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: s.color }} />
                {s.label}
              </li>
            ))}
          </ul>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <ChartContainer config={config} className="aspect-auto h-32 w-full">
          <LineChart data={data} margin={{ right: 8, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={6} interval="preserveStartEnd" />
            <YAxis tickLine={false} axisLine={false} tickMargin={4} width={28} allowDecimals={false} />
            <ChartTooltip cursor={{ stroke: 'var(--border)' }} content={<ChartTooltipContent labelKey={xKey} />} />
            {series.map((s) => (
              <Line
                key={s.key}
                dataKey={s.key}
                type="monotone"
                stroke={`var(--color-${s.key})`}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
