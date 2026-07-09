import { useEffect, useState } from 'react'

export function useClientPagination<T>(items: T[], pageSize = 6) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const page_ = Math.min(page, totalPages)

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const pageItems = items.slice((page_ - 1) * pageSize, page_ * pageSize)

  return { page: page_, setPage, totalPages, pageItems, total: items.length }
}
