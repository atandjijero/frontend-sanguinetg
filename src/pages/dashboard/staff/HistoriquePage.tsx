import { useEffect, useMemo, useState } from 'react'
import { HistoryIcon } from 'lucide-react'
import { Badge } from '../../../components/ui-shadcn/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui-shadcn/ui/card'
import { Input } from '../../../components/ui-shadcn/ui/input'
import { Label } from '../../../components/ui-shadcn/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui-shadcn/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui-shadcn/ui/table'
import { DataState } from '../../../components/dashboard/DataState'
import { PaginationControls } from '../../../components/dashboard/PaginationControls'
import { useAuth } from '../../../context/AuthContext'
import { useApiData } from '../../../hooks/useApiData'
import { T, useTraduction } from '../../../context/LanguageContext'
import type { EntreeHistorique, PageResultat, Role } from '../../../lib/types'

const TOUS = '__tous__'

const ROLE_LABELS: Record<Role, string> = {
  SUPERADMIN: 'Super administrateur',
  ADMIN: 'Administrateur',
  MEDECIN: 'Médecin',
  AGENT_CNTS: 'Agent CNTS',
  DONNEUR: 'Donneur',
}

export default function HistoriquePage() {
  const { user } = useAuth()
  const estSuperadmin = user?.role === 'SUPERADMIN'
  const rolesFiltrables: Role[] = estSuperadmin
    ? ['SUPERADMIN', 'ADMIN', 'AGENT_CNTS', 'MEDECIN', 'DONNEUR']
    : ['AGENT_CNTS', 'MEDECIN', 'DONNEUR']

  const [role, setRole] = useState<Role | typeof TOUS>(TOUS)
  const [succes, setSucces] = useState<'true' | 'false' | typeof TOUS>(TOUS)
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')
  const [rechercheInput, setRechercheInput] = useState('')
  const [recherche, setRecherche] = useState('')
  const [page, setPage] = useState(1)
  const placeholderRecherche = useTraduction('Rechercher (utilisateur, action, IP)')

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRecherche(rechercheInput)
      setPage(1)
    }, 400)
    return () => clearTimeout(timeout)
  }, [rechercheInput])

  const path = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), pageSize: '10' })
    if (role !== TOUS) params.set('role', role)
    if (succes !== TOUS) params.set('succes', succes)
    if (dateDebut) params.set('dateDebut', dateDebut)
    if (dateFin) params.set('dateFin', dateFin)
    if (recherche) params.set('recherche', recherche)
    return `/historique?${params.toString()}`
  }, [page, role, succes, dateDebut, dateFin, recherche])

  const { data: resultat, isLoading, error } = useApiData<PageResultat<EntreeHistorique>>(path)
  const entrees = resultat?.data ?? []

  function changerFiltre<V>(setter: (valeur: V) => void) {
    return (valeur: V) => {
      setter(valeur)
      setPage(1)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HistoryIcon className="h-4 w-4" /> <T>Historique des actions</T>
          {resultat && <span className="text-muted-foreground font-normal">({resultat.total})</span>}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          <T>
            {estSuperadmin
              ? "Toutes les actions effectuées sur la plateforme (connexions et modifications), conservées 12 mois."
              : 'Actions des agents CNTS, médecins et donneurs (connexions et modifications), conservées 12 mois.'}
          </T>
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-1.5 lg:col-span-2">
            <Label>
              <T>Recherche</T>
            </Label>
            <Input placeholder={placeholderRecherche} value={rechercheInput} onChange={(e) => setRechercheInput(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>
              <T>Rôle</T>
            </Label>
            <Select value={role} onValueChange={changerFiltre((v: string) => setRole(v as Role | typeof TOUS))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TOUS}>
                  <T>Tous les rôles</T>
                </SelectItem>
                {rolesFiltrables.map((r) => (
                  <SelectItem key={r} value={r}>
                    <T>{ROLE_LABELS[r]}</T>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>
              <T>Résultat</T>
            </Label>
            <Select value={succes} onValueChange={changerFiltre((v: string) => setSucces(v as 'true' | 'false' | typeof TOUS))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TOUS}>
                  <T>Tous</T>
                </SelectItem>
                <SelectItem value="true">
                  <T>Réussies</T>
                </SelectItem>
                <SelectItem value="false">
                  <T>Échouées</T>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label>
                <T>Du</T>
              </Label>
              <Input type="date" value={dateDebut} max={dateFin || undefined} onChange={(e) => changerFiltre(setDateDebut)(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>
                <T>Au</T>
              </Label>
              <Input type="date" value={dateFin} min={dateDebut || undefined} onChange={(e) => changerFiltre(setDateFin)(e.target.value)} />
            </div>
          </div>
        </div>

        <DataState isLoading={isLoading} error={error} isEmpty={!entrees.length} emptyLabel="Aucune action ne correspond à ces critères.">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <T>Date</T>
                  </TableHead>
                  <TableHead>
                    <T>Utilisateur</T>
                  </TableHead>
                  <TableHead>
                    <T>Rôle</T>
                  </TableHead>
                  <TableHead>
                    <T>Description</T>
                  </TableHead>
                  <TableHead>
                    <T>Résultat</T>
                  </TableHead>
                  <TableHead>IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entrees.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {new Date(e.dateCreation).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'medium' })}
                    </TableCell>
                    <TableCell className="font-medium">
                      {e.utilisateurNom ?? e.details?.nom ?? e.details?.identifiant ?? e.details?.email ?? (
                        <span className="text-muted-foreground">
                          <T>Visiteur</T>
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{e.role ? <T>{ROLE_LABELS[e.role]}</T> : <span className="text-muted-foreground">—</span>}</TableCell>
                    <TableCell className="min-w-72" title={`${e.methode} ${e.route}`}>
                      <div>{e.description ?? e.action}</div>
                      {e.description && (
                        <div className="text-xs text-muted-foreground">
                          <T>{e.action}</T>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {e.succes ? (
                        <Badge variant="outline">
                          <T>Réussie</T>
                        </Badge>
                      ) : (
                        <Badge variant="destructive" title={e.details?.erreur}>
                          <T>Échouée</T> ({e.codeHttp})
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">{e.ip ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {resultat && (
            <PaginationControls page={page} totalPages={resultat.totalPages} onPageChange={setPage} total={resultat.total} label="actions" />
          )}
        </DataState>
      </CardContent>
    </Card>
  )
}
