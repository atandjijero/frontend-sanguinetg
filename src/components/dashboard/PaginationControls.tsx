import type { ReactNode } from 'react'
import { Button } from '../ui-shadcn/ui/button'
import { T } from '../../context/LanguageContext'

function pagesVisibles(page: number, totalPages: number): (number | null)[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
  const pages = new Set([1, totalPages, page - 1, page, page + 1])
  const triees = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)
  const resultat: (number | null)[] = []
  triees.forEach((p, i) => {
    if (i > 0 && p - triees[i - 1] > 1) resultat.push(null)
    resultat.push(p)
  })
  return resultat
}

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
    <div className="flex flex-wrap items-center justify-between gap-2 pt-4">
      <p className="text-sm text-muted-foreground">
        {total} {typeof label === 'string' ? <T>{label}</T> : label}
      </p>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(Math.max(1, page - 1))}>
          <T>Précédent</T>
        </Button>
        {pagesVisibles(page, totalPages).map((numero, index) =>
          numero === null ? (
            <span key={`ellipse-${index}`} className="w-9 text-center text-sm text-muted-foreground">
              …
            </span>
          ) : (
            <Button
              key={numero}
              variant={numero === page ? 'default' : 'outline'}
              size="sm"
              className="w-9 px-0"
              onClick={() => onPageChange(numero)}
            >
              {numero}
            </Button>
          ),
        )}
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
