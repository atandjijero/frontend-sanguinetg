import { useMemo, useState } from 'react'
import { PlusIcon, UsersIcon } from 'lucide-react'
import { Button } from '../../../components/ui-shadcn/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui-shadcn/ui/card'
import { Badge } from '../../../components/ui-shadcn/ui/badge'
import { Input } from '../../../components/ui-shadcn/ui/input'
import { Label } from '../../../components/ui-shadcn/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui-shadcn/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui-shadcn/ui/table'
import { DataState } from '../../../components/dashboard/DataState'
import { PaginationControls } from '../../../components/dashboard/PaginationControls'
import { useApiData } from '../../../hooks/useApiData'
import { useClientPagination } from '../../../hooks/useClientPagination'
import { useAuth } from '../../../context/AuthContext'
import { api, ApiError } from '../../../lib/api'
import { T, useTraduction } from '../../../context/LanguageContext'
import type { Role, Utilisateur } from '../../../lib/types'

const ROLE_LABELS: Record<Role, string> = {
  SUPERADMIN: 'Super administrateur',
  ADMIN: 'Administrateur',
  MEDECIN: 'Médecin',
  AGENT_CNTS: 'Agent CNTS',
  DONNEUR: 'Donneur',
}

export default function EquipePage() {
  const { user: moi } = useAuth()
  const { data: utilisateurs, isLoading, error, refetch } = useApiData<Utilisateur[]>('/users')
  const equipe = useMemo(() => utilisateurs?.filter((u) => u.role !== 'DONNEUR') ?? [], [utilisateurs])
  const { page, setPage, totalPages, pageItems, total } = useClientPagination(equipe, 6)
  const peutGererStatut = moi?.role === 'ADMIN' || moi?.role === 'SUPERADMIN'

  const rolesCreables: Role[] =
    moi?.role === 'SUPERADMIN' ? ['SUPERADMIN', 'ADMIN', 'MEDECIN', 'AGENT_CNTS'] : ['MEDECIN', 'AGENT_CNTS']

  async function toggleStatut(u: Utilisateur) {
    const nouveauStatut = u.statut === 'ACTIF' ? 'INACTIF' : 'ACTIF'
    await api.patch(`/users/${u.id}/statut`, { statut: nouveauStatut })
    refetch()
  }

  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [role, setRole] = useState<Role | ''>('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const placeholderSelectionner = useTraduction('Sélectionner')

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault()
    if (!nom || !prenom || !email || !telephone || !motDePasse || !role) return
    setSubmitting(true)
    setFormError(null)
    try {
      await api.post('/users/staff', { nom, prenom, email, telephone, motDePasse, role })
      setNom('')
      setPrenom('')
      setEmail('')
      setTelephone('')
      setMotDePasse('')
      setRole('')
      await refetch()
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Impossible de créer ce compte')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" /> <T>Créer un compte membre du CNTS</T>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label>
                <T>Nom</T>
              </Label>
              <Input value={nom} onChange={(e) => setNom(e.target.value)} required minLength={2} />
            </div>
            <div className="space-y-1.5">
              <Label>
                <T>Prénom</T>
              </Label>
              <Input value={prenom} onChange={(e) => setPrenom(e.target.value)} required minLength={2} />
            </div>
            <div className="space-y-1.5">
              <Label>
                <T>Rôle</T>
              </Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger>
                  <SelectValue placeholder={placeholderSelectionner} />
                </SelectTrigger>
                <SelectContent>
                  {rolesCreables.map((r) => (
                    <SelectItem key={r} value={r}>
                      <T>{ROLE_LABELS[r]}</T>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>
                <T>Téléphone</T>
              </Label>
              <Input value={telephone} onChange={(e) => setTelephone(e.target.value)} required placeholder="+22890123456" />
            </div>
            <div className="space-y-1.5">
              <Label>
                <T>Mot de passe provisoire</T>
              </Label>
              <Input
                type="password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex items-center gap-4">
              <Button type="submit" disabled={submitting}>
                <T>Créer le compte</T>
              </Button>
              {formError && (
                <p className="text-sm text-destructive">
                  <T>{formError}</T>
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4" /> <T>Équipe CNTS</T>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataState isLoading={isLoading} error={error} isEmpty={!equipe.length}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <T>Nom</T>
                  </TableHead>
                  <TableHead>
                    <T>Rôle</T>
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>
                    <T>Statut</T>
                  </TableHead>
                  {peutGererStatut && (
                    <TableHead className="text-right">
                      <T>Action</T>
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">
                      {u.prenom} {u.nom}
                    </TableCell>
                    <TableCell>
                      <T>{ROLE_LABELS[u.role]}</T>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={u.statut === 'ACTIF' ? 'default' : 'destructive'}>{u.statut}</Badge>
                    </TableCell>
                    {peutGererStatut && (
                      <TableCell className="text-right">
                        {u.id !== moi?.id && (
                          <Button variant="outline" size="sm" onClick={() => toggleStatut(u)}>
                            <T>{u.statut === 'ACTIF' ? 'Désactiver' : 'Activer'}</T>
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} total={total} label="membres" />
          </DataState>
        </CardContent>
      </Card>
    </div>
  )
}
