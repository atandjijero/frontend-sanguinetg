import { Link } from 'react-router-dom'
import { ArrowLeftIcon, RadioIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui-shadcn/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui-shadcn/ui/table'
import { DataState } from '../../../components/dashboard/DataState'
import { PaginationControls } from '../../../components/dashboard/PaginationControls'
import { useApiData } from '../../../hooks/useApiData'
import { useClientPagination } from '../../../hooks/useClientPagination'
import { useAuth } from '../../../context/AuthContext'
import { T } from '../../../context/LanguageContext'
import { cn } from '../../../lib/shadcn-utils'
import { formatStatutActivite } from '../../../lib/date-format'
import type { Role, VisiteurConnecte } from '../../../lib/types'

const ROLE_LABELS: Record<Role, string> = {
  SUPERADMIN: 'Super administrateur',
  ADMIN: 'Administrateur',
  MEDECIN: 'Médecin',
  AGENT_CNTS: 'Agent CNTS',
  DONNEUR: 'Donneur',
}

export default function VisiteursConnectesPage() {
  const { user } = useAuth()
  const { data: visiteurs, isLoading, error } = useApiData<VisiteurConnecte[]>('/analytics/connectes')
  const { page, setPage, totalPages, pageItems, total } = useClientPagination(visiteurs ?? [], 10)

  return (
    <div className="space-y-6">
      <Link to="/admin/securite" className="inline-flex items-center gap-1 text-sm text-secondary hover:text-primary">
        <ArrowLeftIcon className="h-4 w-4" /> <T>Retour aux alertes de sécurité</T>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RadioIcon className="h-4 w-4" /> <T>Personnes connectées</T> ({total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataState
            isLoading={isLoading}
            error={error}
            isEmpty={!visiteurs?.length}
            emptyLabel="Aucun utilisateur connecté pour le moment."
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <T>Nom</T>
                  </TableHead>
                  <TableHead>
                    <T>Rôle</T>
                  </TableHead>
                  <TableHead>
                    <T>Statut</T>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((visiteur) => {
                  const statut = formatStatutActivite(new Date(visiteur.derniereActivite))
                  return (
                    <TableRow key={visiteur.id}>
                      <TableCell className="font-medium">
                        {visiteur.id === user?.id ? <T>Vous</T> : `${visiteur.prenom} ${visiteur.nom}`}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <T>{ROLE_LABELS[visiteur.role]}</T>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5',
                            statut.enLigne ? 'text-green-600 dark:text-green-500' : 'text-muted-foreground',
                          )}
                        >
                          {statut.enLigne && <span className="h-2 w-2 rounded-full bg-green-500" />}
                          {statut.label}
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} total={total} label="connectés" />
          </DataState>
        </CardContent>
      </Card>
    </div>
  )
}
