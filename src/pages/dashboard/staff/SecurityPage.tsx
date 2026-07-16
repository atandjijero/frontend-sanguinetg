import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  AlertOctagonIcon,
  DatabaseIcon,
  KeyRoundIcon,
  RadioIcon,
  ShieldAlertIcon,
  ShieldIcon,
  SquareCodeIcon,
  Trash2Icon,
  UserCheckIcon,
  UserRoundIcon,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Badge } from '../../../components/ui-shadcn/ui/badge'
import { Button } from '../../../components/ui-shadcn/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui-shadcn/ui/card'
import { Checkbox } from '../../../components/ui-shadcn/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui-shadcn/ui/dialog'
import { Input } from '../../../components/ui-shadcn/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui-shadcn/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui-shadcn/ui/table'
import { DataState } from '../../../components/dashboard/DataState'
import { StatCard } from '../../../components/dashboard/StatCard'
import { useConfirm } from '../../../context/ConfirmContext'
import { useApiData } from '../../../hooks/useApiData'
import { api, ApiError } from '../../../lib/api'
import { GRAVITE_ALERTE_SECURITE_LABELS, TYPE_ALERTE_SECURITE_LABELS } from '../../../lib/constants'
import { T, useTraduction } from '../../../context/LanguageContext'
import type {
  AlerteSecurite,
  AlertesSecuriteStats,
  FrequentationStats,
  GraviteAlerteSecurite,
  PageResultat,
  TypeAlerteSecurite,
} from '../../../lib/types'

const TOUS = '__tous__'

const GRAVITE_VARIANT: Record<GraviteAlerteSecurite, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  FAIBLE: 'outline',
  MOYEN: 'secondary',
  ELEVE: 'default',
  CRITIQUE: 'destructive',
}

const TYPE_ICONS: Record<TypeAlerteSecurite, LucideIcon> = {
  BRUTE_FORCE: KeyRoundIcon,
  CSP_VIOLATION: ShieldIcon,
  SQL_INJECTION: DatabaseIcon,
  XSS_ATTEMPT: SquareCodeIcon,
}

function Champ({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-lg border bg-muted/40 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">{label}</p>
      <div className="text-sm font-medium break-words">{children}</div>
    </div>
  )
}

export default function SecurityPage() {
  const confirm = useConfirm()
  const { data: stats, refetch: refetchStats } = useApiData<AlertesSecuriteStats>('/security/stats')
  const { data: frequentation, refetch: refetchFrequentation } = useApiData<FrequentationStats>('/analytics/stats')

  useEffect(() => {
    const interval = setInterval(() => refetchFrequentation(), 30_000)
    return () => clearInterval(interval)
  }, [refetchFrequentation])

  const [type, setType] = useState<TypeAlerteSecurite | typeof TOUS>(TOUS)
  const [gravite, setGravite] = useState<GraviteAlerteSecurite | typeof TOUS>(TOUS)
  const [rechercheInput, setRechercheInput] = useState('')
  const [recherche, setRecherche] = useState('')
  const [page, setPage] = useState(1)
  const [detailAlerte, setDetailAlerte] = useState<AlerteSecurite | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const placeholderRecherche = useTraduction('Rechercher (IP, message, URI…)')
  const placeholderTousTypes = useTraduction('Tous les types')
  const placeholderToutesGravites = useTraduction('Toutes les gravités')

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRecherche(rechercheInput)
      setPage(1)
    }, 400)
    return () => clearTimeout(timeout)
  }, [rechercheInput])

  const path = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), pageSize: '5' })
    if (type !== TOUS) params.set('type', type)
    if (gravite !== TOUS) params.set('gravite', gravite)
    if (recherche) params.set('recherche', recherche)
    return `/security/alertes?${params.toString()}`
  }, [type, gravite, recherche, page])

  const { data: resultat, isLoading, error, refetch } = useApiData<PageResultat<AlerteSecurite>>(path)

  const idsAffiches = resultat?.data.map((a) => a.id) ?? []
  const toutSelectionne = idsAffiches.length > 0 && idsAffiches.every((id) => selectedIds.includes(id))

  function toggleSelection(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]))
  }

  function toggleSelectionTout() {
    setSelectedIds((prev) => (toutSelectionne ? prev.filter((id) => !idsAffiches.includes(id)) : [...new Set([...prev, ...idsAffiches])]))
  }

  async function supprimer(ids: string[]): Promise<boolean> {
    if (ids.length === 0) return false
    const confirme = await confirm({
      title: 'Supprimer définitivement',
      description: `Supprimer définitivement ${ids.length > 1 ? `ces ${ids.length} alertes` : 'cette alerte'} ?`,
    })
    if (!confirme) return false
    setDeleting(true)
    setDeleteError(null)
    try {
      if (ids.length === 1) {
        await api.delete(`/security/alertes/${ids[0]}`)
      } else {
        await api.delete('/security/alertes', { ids })
      }
      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)))
      await Promise.all([refetch(), refetchStats()])
      return true
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : 'Impossible de supprimer les alertes sélectionnées')
      return false
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ShieldAlertIcon className="h-5 w-5 text-primary" /> <T>Alertes de sécurité</T>
        </h2>
        <p className="text-sm text-muted-foreground">
          <T>Surveillance en temps réel des cyber-menaces et comportements suspects.</T>
        </p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-secondary mb-3 flex items-center gap-2">
          <RadioIcon className="h-4 w-4 text-tertiary" /> <T>Fréquentation en temps réel</T>
        </h3>
        <div className="grid gap-4 grid-cols-3">
          <StatCard label={<T>En ligne maintenant</T>} value={frequentation?.enLigne ?? '—'} icon={RadioIcon} />
          <StatCard label={<T>Visiteurs connectés</T>} value={frequentation?.connectes ?? '—'} icon={UserCheckIcon} />
          <StatCard label={<T>Visiteurs anonymes</T>} value={frequentation?.anonymes ?? '—'} icon={UserRoundIcon} />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          <T>Actualisé toutes les 30 secondes — présence détectée sur les 5 dernières minutes.</T>
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-6">
        <StatCard label={<T>Total alertes</T>} value={stats?.total ?? '—'} icon={ShieldAlertIcon} />
        <StatCard label={<T>Critiques</T>} value={stats?.critiques ?? '—'} icon={AlertOctagonIcon} />
        <StatCard label="Brute Force" value={stats?.bruteForce ?? '—'} icon={KeyRoundIcon} />
        <StatCard label={<T>Violations CSP</T>} value={stats?.cspViolations ?? '—'} icon={ShieldIcon} />
        <StatCard label={<T>Injections SQL</T>} value={stats?.sqlInjections ?? '—'} icon={DatabaseIcon} />
        <StatCard label={<T>Attaques XSS</T>} value={stats?.xssAttempts ?? '—'} icon={SquareCodeIcon} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <T>Journal des alertes</T>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <Input
              value={rechercheInput}
              onChange={(e) => setRechercheInput(e.target.value)}
              placeholder={placeholderRecherche}
              className="w-64"
            />
            <Select
              value={type}
              onValueChange={(v) => {
                setType(v as TypeAlerteSecurite | typeof TOUS)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder={placeholderTousTypes} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TOUS}>
                  <T>Tous les types</T>
                </SelectItem>
                {Object.entries(TYPE_ALERTE_SECURITE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    <T>{label}</T>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={gravite}
              onValueChange={(v) => {
                setGravite(v as GraviteAlerteSecurite | typeof TOUS)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder={placeholderToutesGravites} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TOUS}>
                  <T>Toutes les gravités</T>
                </SelectItem>
                {Object.entries(GRAVITE_ALERTE_SECURITE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    <T>{label}</T>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">
                {selectedIds.length} <T>sélectionnée(s)</T>
              </p>
              <Button
                variant="destructive"
                size="sm"
                disabled={deleting}
                onClick={() => supprimer(selectedIds)}
              >
                <Trash2Icon className="h-4 w-4" /> <T>Supprimer la sélection</T>
              </Button>
            </div>
          )}
          {deleteError && (
            <p className="text-sm text-destructive">
              <T>{deleteError}</T>
            </p>
          )}

          <DataState
            isLoading={isLoading}
            error={error}
            isEmpty={!resultat?.data.length}
            emptyLabel="Aucune alerte de sécurité enregistrée."
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={toutSelectionne}
                      onCheckedChange={toggleSelectionTout}
                      aria-label="Tout sélectionner"
                    />
                  </TableHead>
                  <TableHead>
                    <T>Gravité</T>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>
                    <T>Message</T>
                  </TableHead>
                  <TableHead>IP Source</TableHead>
                  <TableHead>URI</TableHead>
                  <TableHead>
                    <T>Date</T>
                  </TableHead>
                  <TableHead className="text-right">
                    <T>Action</T>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultat?.data.map((alerte) => (
                  <TableRow key={alerte.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(alerte.id)}
                        onCheckedChange={() => toggleSelection(alerte.id)}
                        aria-label="Sélectionner cette alerte"
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant={GRAVITE_VARIANT[alerte.gravite]}>
                        <T>{GRAVITE_ALERTE_SECURITE_LABELS[alerte.gravite]}</T>
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <T>{TYPE_ALERTE_SECURITE_LABELS[alerte.type]}</T>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="truncate">{alerte.message}</p>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{alerte.ipSource ?? '—'}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">{alerte.uri ?? '—'}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {new Date(alerte.dateCreation).toLocaleString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => setDetailAlerte(alerte)}>
                        <T>Voir plus</T>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {resultat && resultat.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  {resultat.total} <T>alertes</T>
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <T>Précédent</T>
                  </Button>
                  {Array.from({ length: resultat.totalPages }, (_, i) => i + 1).map((numero) => (
                    <Button
                      key={numero}
                      variant={numero === page ? 'default' : 'outline'}
                      size="sm"
                      className="w-9 px-0"
                      onClick={() => setPage(numero)}
                    >
                      {numero}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= resultat.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <T>Suivant</T>
                  </Button>
                </div>
              </div>
            )}
          </DataState>
        </CardContent>
      </Card>

      <Dialog open={!!detailAlerte} onOpenChange={(open) => !open && setDetailAlerte(null)}>
        <DialogContent className="max-w-xl">
          {detailAlerte && (
            <>
              <DialogHeader>
                <DialogTitle>
                  <T>Détails de l'alerte</T>
                </DialogTitle>
                <DialogDescription className="font-mono text-xs">{detailAlerte.id}</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-3">
                <Champ label="Type">
                  <span className="flex items-center gap-2">
                    {(() => {
                      const Icon = TYPE_ICONS[detailAlerte.type]
                      return <Icon className="h-4 w-4 text-muted-foreground" />
                    })()}
                    <T>{TYPE_ALERTE_SECURITE_LABELS[detailAlerte.type]}</T>
                  </span>
                </Champ>
                <Champ label={<T>Gravité</T>}>
                  <Badge variant={GRAVITE_VARIANT[detailAlerte.gravite]}>
                    <T>{GRAVITE_ALERTE_SECURITE_LABELS[detailAlerte.gravite]}</T>
                  </Badge>
                </Champ>
                <Champ label={<T>IP source</T>}>
                  <span className="font-mono">{detailAlerte.ipSource ?? '—'}</span>
                </Champ>
                <Champ label={<T>Date</T>}>{new Date(detailAlerte.dateCreation).toLocaleString('fr-FR')}</Champ>
                <Champ label="URI">
                  <span className="font-mono break-all">{detailAlerte.uri ?? '—'}</span>
                </Champ>
                <Champ label="User-Agent">
                  <span className="text-xs break-all">{detailAlerte.userAgent ?? '—'}</span>
                </Champ>
              </div>

              <Champ label={<T>Message</T>}>
                <p className="font-normal">{detailAlerte.message}</p>
              </Champ>

              {detailAlerte.payload != null && (
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 mb-2">Payload</p>
                  <pre className="text-xs font-mono text-green-400 whitespace-pre-wrap break-all">
                    {JSON.stringify(detailAlerte.payload, null, 2)}
                  </pre>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailAlerte(null)}>
                  <T>Fermer</T>
                </Button>
                <Button
                  variant="destructive"
                  disabled={deleting}
                  onClick={async () => {
                    if (await supprimer([detailAlerte.id])) {
                      setDetailAlerte(null)
                    }
                  }}
                >
                  <Trash2Icon className="h-4 w-4" /> <T>Supprimer</T>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
