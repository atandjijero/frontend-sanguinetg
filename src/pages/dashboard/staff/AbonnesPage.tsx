import { Link } from 'react-router-dom'
import { ArrowLeftIcon, RssIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui-shadcn/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui-shadcn/ui/table'
import { DataState } from '../../../components/dashboard/DataState'
import { PaginationControls } from '../../../components/dashboard/PaginationControls'
import { useApiData } from '../../../hooks/useApiData'
import { useClientPagination } from '../../../hooks/useClientPagination'
import { T } from '../../../context/LanguageContext'
import type { AbonneNewsletter } from '../../../lib/types'

export default function AbonnesPage() {
  const { data: abonnes, isLoading, error } = useApiData<AbonneNewsletter[]>('/newsletter')
  const { page, setPage, totalPages, pageItems, total } = useClientPagination(abonnes ?? [], 10)

  return (
    <div className="space-y-6">
      <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-secondary hover:text-primary">
        <ArrowLeftIcon className="h-4 w-4" /> <T>Retour au tableau de bord</T>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RssIcon className="h-4 w-4" /> <T>Abonnés newsletter</T> ({total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataState isLoading={isLoading} error={error} isEmpty={!abonnes?.length} emptyLabel="Aucun abonné pour le moment.">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <T>Nom</T>
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>
                    <T>Abonné le</T>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((abonne) => (
                  <TableRow key={abonne.id}>
                    <TableCell className="font-medium">{abonne.nom}</TableCell>
                    <TableCell className="text-muted-foreground">{abonne.email}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(abonne.dateAbonnement).toLocaleDateString('fr-FR')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} total={total} label="abonnés" />
          </DataState>
        </CardContent>
      </Card>
    </div>
  )
}
