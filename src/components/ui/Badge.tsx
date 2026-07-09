import * as React from 'react'
import { cn } from '../../lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline'
}

const badgeVariants = {
  default: 'rounded-full bg-primary-container px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-on-primary',
  secondary: 'rounded-full bg-secondary-fixed px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-on-secondary',
  outline: 'rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-on-surface-variant',
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return <span className={cn(badgeVariants[variant], className)} {...props} />
}
