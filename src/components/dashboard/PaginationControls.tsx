import { Button } from '../ui-shadcn/ui/button'

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
  label?: string
}) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-sm text-muted-foreground">
        {total} {label}
      </p>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(Math.max(1, page - 1))}>
          Précédent
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
          Suivant
        </Button>
      </div>
    </div>
  )
}
