import type { ReactNode } from 'react'
import { Loader2Icon } from 'lucide-react'
import { T } from '../../context/LanguageContext'

export function DataState({
  isLoading,
  error,
  isEmpty,
  emptyLabel = 'Aucun élément pour le moment.',
  children,
}: {
  isLoading: boolean
  error: string | null
  isEmpty?: boolean
  emptyLabel?: ReactNode
  children: ReactNode
}) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
        <Loader2Icon className="h-4 w-4 animate-spin" />
        <T>Chargement...</T>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-sm text-destructive py-8 text-center">
        <T>{error}</T>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="text-sm text-muted-foreground py-8 text-center">
        {typeof emptyLabel === 'string' ? <T>{emptyLabel}</T> : emptyLabel}
      </div>
    )
  }

  return <>{children}</>
}
