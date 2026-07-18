import type { ReactNode } from 'react'
import { ArrowDownIcon, ArrowUpIcon, type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '../ui-shadcn/ui/card'
import { cn } from '@/lib/shadcn-utils'

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  delta,
}: {
  label: ReactNode
  value: string | number
  icon: LucideIcon
  hint?: ReactNode
  /** Variation affichée en pastille à côté de la valeur, façon tableau de bord (ex: +15,5%). */
  delta?: { direction: 'up' | 'down'; label: string }
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {delta ? (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold',
                delta.direction === 'up' ? 'bg-tertiary/15 text-tertiary' : 'bg-destructive/15 text-destructive'
              )}
            >
              {delta.direction === 'up' ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
              {delta.label}
            </span>
          ) : null}
        </div>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  )
}
