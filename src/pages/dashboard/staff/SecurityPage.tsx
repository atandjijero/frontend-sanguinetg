import { useEffect, useMemo, useState } from 'react'
import {
  AlertOctagonIcon,
  DatabaseIcon,
  KeyRoundIcon,
  RadioIcon,
  ShieldAlertIcon,
  ShieldIcon,
  SquareCodeIcon,
  UserCheckIcon,
  UserRoundIcon,
} from 'lucide-react'
import { Badge } from '../../../components/ui-shadcn/ui/badge'
import { Button } from '../../../components/ui-shadcn/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui-shadcn/ui/card'
import { Input } from '../../../components/ui-shadcn/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui-shadcn/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui-shadcn/ui/table'
import { DataState } from '../../../components/dashboard/DataState'
import { StatCard } from '../../../components/dashboard/StatCard'
import { useApiData } from '../../../hooks/useApiData'
import { GRAVITE_ALERTE_SECURITE_LABELS, TYPE_ALERTE_SECURITE_LABELS } from '../../../lib/constants'
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

export default function SecurityPage() {
  const { data: stats } = useApiData<AlertesSecuriteStats>('/security/stats')
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
  const [expandedId, setExpandedId] = useState<string | null>(null)

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

  const { data: resultat, isLoading, error } = useApiData<PageResultat<AlerteSecurite>>(path)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ShieldAlertIcon className="h-5 w-5 text-primary" /> Alertes de sécurité
        </h2>
        <p className="text-sm text-muted-foreground">
          Surveillance en temps réel des cyber-menaces et comportements suspects.
        </p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-secondary mb-3 flex items-center gap-2">
          <RadioIcon className="h-4 w-4 text-tertiary" /> Fréquentation en temps réel
        </h3>
        <div className="grid gap-4 grid-cols-3">
          <StatCard label="En ligne maintenant" value={frequentation?.enLigne ?? '—'} icon={RadioIcon} />
          <StatCard label="Visiteurs connectés" value={frequentation?.connectes ?? '—'} icon={UserCheckIcon} />
          <StatCard label="Visiteurs anonymes" value={frequentation?.anonymes ?? '—'} icon={UserRoundIcon} />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Actualisé toutes les 30 secondes — présence détectée sur les 5 dernières minutes.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-6">
        <StatCard label="Total alertes" value={stats?.total ?? '—'} icon={ShieldAlertIcon} />
        <StatCard label="Critiques" value={stats?.critiques ?? '—'} icon={AlertOctagonIcon} />
        <StatCard label="Brute Force" value={stats?.bruteForce ?? '—'} icon={KeyRoundIcon} />
        <StatCard label="Violations CSP" value={stats?.cspViolations ?? '—'} icon={ShieldIcon} />
        <StatCard label="Injections SQL" value={stats?.sqlInjections ?? '—'} icon={DatabaseIcon} />
        <StatCard label="Attaques XSS" value={stats?.xssAttempts ?? '—'} icon={SquareCodeIcon} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Journal des alertes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <Input
              value={rechercheInput}
              onChange={(e) => setRechercheInput(e.target.value)}
              placeholder="Rechercher (IP, message, URI…)"
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
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TOUS}>Tous les types</SelectItem>
                {Object.entries(TYPE_ALERTE_SECURITE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
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
                <SelectValue placeholder="Toutes les gravités" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TOUS}>Toutes les gravités</SelectItem>
                {Object.entries(GRAVITE_ALERTE_SECURITE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DataState
            isLoading={isLoading}
            error={error}
            isEmpty={!resultat?.data.length}
            emptyLabel="Aucune alerte de sécurité enregistrée."
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gravité</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>IP Source</TableHead>
                  <TableHead>URI</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultat?.data.map((alerte) => {
                  const estOuvert = expandedId === alerte.id
                  return (
                    <TableRow key={alerte.id}>
                      <TableCell>
                        <Badge variant={GRAVITE_VARIANT[alerte.gravite]}>{GRAVITE_ALERTE_SECURITE_LABELS[alerte.gravite]}</Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{TYPE_ALERTE_SECURITE_LABELS[alerte.type]}</TableCell>
                      <TableCell className="max-w-md">
                        <p className={estOuvert ? '' : 'truncate'}>{alerte.message}</p>
                        {alerte.message.length > 80 && (
                          <button
                            type="button"
                            className="text-xs text-primary hover:underline"
                            onClick={() => setExpandedId(estOuvert ? null : alerte.id)}
                          >
                            {estOuvert ? 'Voir moins' : 'Voir plus'}
                          </button>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{alerte.ipSource ?? '—'}</TableCell>
                      <TableCell className="max-w-xs truncate text-muted-foreground">{alerte.uri ?? '—'}</TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {new Date(alerte.dateCreation).toLocaleString('fr-FR')}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            {resultat && resultat.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">{resultat.total} alertes</p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Précédent
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
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </DataState>
        </CardContent>
      </Card>
    </div>
  )
}
