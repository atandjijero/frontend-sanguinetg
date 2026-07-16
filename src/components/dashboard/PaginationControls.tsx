import type { ReactNode } from 'react'
import { Button } from '../ui-shadcn/ui/button'
import { T } from '../../context/LanguageContext'

export function PaginationControls({
  page,
  totalPages,
  onPageChange,
  total,
  label = 'éléments',
}: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  total: number
  label?: ReactNode
}) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-sm text-muted-foreground">
        {total} {typeof label === 'string' ? <T>{label}</T> : label}
      </p>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(Math.max(1, page - 1))}>
          <T>Précédent</T>
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((numero) => (
          <Button
            key={numero}
            variant={numero === page ? 'default' : 'outline'}
            size="sm"
            className="w-9 px-0"
            onClick={() => onPageChange(numero)}
          >
            {numero}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        >
          <T>Suivant</T>
        </Button>
      </div>
    </div>
  )
}
