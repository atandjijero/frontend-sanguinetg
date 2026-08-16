import { useMemo, useState } from 'react'
import { CalendarCheck2Icon, DownloadIcon, DropletIcon, Loader2Icon, MapPinIcon, StampIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui-shadcn/ui/card'
import { Badge } from '../../../components/ui-shadcn/ui/badge'
import { Button } from '../../../components/ui-shadcn/ui/button'
import { DataState } from '../../../components/dashboard/DataState'
import { useApiData } from '../../../hooks/useApiData'
import { useAuth } from '../../../context/AuthContext'
import { GROUPE_SANGUIN_LABELS, TYPE_RECOMPENSE_LABELS } from '../../../lib/constants'
import { genererCarnetPdf } from '../../../lib/carnetPdf'
import { T } from '../../../context/LanguageContext'
import type { CarnetDigital } from '../../../lib/types'

export default function MonCarnetPage() {
  const { user } = useAuth()
  const { data: carnets, isLoading, error } = useApiData<CarnetDigital[]>('/carnets')
  const [telechargement, setTelechargement] = useState(false)

  const { parAncienneteAsc, plusRecent, eligible } = useMemo(() => {
    const tries = [...(carnets ?? [])].sort((a, b) => new Date(a.dateDon).getTime() - new Date(b.dateDon).getTime())
    const recent = tries.at(-1) ?? null
    const estEligible = recent?.rappelProchaineDate ? new Date(recent.rappelProchaineDate).getTime() <= Date.now() : true
    return { parAncienneteAsc: tries, plusRecent: recent, eligible: estEligible }
  }, [carnets])

  if (!user) return null

  const numeroCarnet = user.id.slice(-6).toUpperCase()
  const donneurDepuis = user.dateInscription ?? user.createdAt

  const handleTelecharger = async () => {
    setTelechargement(true)
    try {
      genererCarnetPdf(user, carnets ?? [])
    } finally {
      setTelechargement(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground shadow-sm">
        <StampIcon className="pointer-events-none absolute -bottom-6 -right-6 h-32 w-32 text-white/10" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-primary-foreground/70">
              <T>Carnet de don · CNTS Lomé</T>
            </p>
            <h2 className="mt-1 text-xl font-bold">
              {user.prenom} {user.nom}
            </h2>
            <p className="text-sm text-primary-foreground/80">
              {donneurDepuis ? (
                <>
                  <T>Donneur depuis le</T> {new Date(donneurDepuis).toLocaleDateString('fr-FR')}
                </>
              ) : (
                <T>Nouveau donneur</T>
              )}
            </p>
          </div>
          {user.groupeSanguin && (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15 text-xl font-bold ring-2 ring-white/25">
              {GROUPE_SANGUIN_LABELS[user.groupeSanguin]}
            </div>
          )}
        </div>
        <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/20 pt-4 text-sm">
          <span className="font-mono tracking-wide text-primary-foreground/80">
            N° <T>CARNET</T>-{numeroCarnet}
          </span>
          <span className="font-semibold">
            {parAncienneteAsc.length} <T>{parAncienneteAsc.length > 1 ? 'dons enregistrés' : 'don enregistré'}</T>
          </span>
          <span className="font-medium">
            {eligible ? (
              <T>Disponible pour un don dès maintenant</T>
            ) : (
              <>
                <T>Prochain don possible le</T> {new Date(plusRecent!.rappelProchaineDate!).toLocaleDateString('fr-FR')}
              </>
            )}
          </span>
        </div>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2">
            <StampIcon className="h-4 w-4" /> <T>Historique des dons</T>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleTelecharger} disabled={telechargement}>
            {telechargement ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <DownloadIcon className="h-4 w-4" />}
            <T>Télécharger en PDF</T>
          </Button>
        </CardHeader>
        <CardContent>
          <DataState
            isLoading={isLoading}
            error={error}
            isEmpty={!carnets?.length}
            emptyLabel="Vous n'avez pas encore de don enregistré. Merci de vous manifester lors de votre prochain passage au CNTS !"
          >
            <ol className="relative ml-3 space-y-5 border-l-2 border-dashed border-border pl-6">
              {[...parAncienneteAsc].reverse().map((carnet, idx) => {
                const numeroDon = parAncienneteAsc.length - idx
                const estLePlusRecent = carnet.id === plusRecent?.id
                return (
                  <li key={carnet.id} className="relative">
                    <span className="absolute -left-[calc(1.5rem+9px)] top-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground ring-4 ring-background">
                      <DropletIcon className="h-2.5 w-2.5" fill="currentColor" />
                    </span>
                    <div className="rounded-xl border border-border bg-card p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-lg font-bold tracking-tight">
                          {new Date(carnet.dateDon).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                        <Badge variant="secondary">
                          <T>Don n°</T>
                          {numeroDon}
                        </Badge>
                      </div>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPinIcon className="h-3.5 w-3.5" /> {carnet.centreDon?.nom ?? '—'}
                      </p>
                      {carnet.recompense && (
                        <Badge variant="outline" className="mt-2">
                          <T>{TYPE_RECOMPENSE_LABELS[carnet.recompense.type]}</T>
                        </Badge>
                      )}
                      {carnet.messageRemerciement && (
                        <p className="mt-2 text-sm italic text-secondary">
                          "<T>{carnet.messageRemerciement}</T>"
                        </p>
                      )}
                      {estLePlusRecent && carnet.rappelProchaineDate && (
                        <p className="mt-3 flex items-center gap-1.5 border-t border-border pt-2 text-xs font-medium text-primary">
                          <CalendarCheck2Icon className="h-3.5 w-3.5" />
                          <T>Prochain don possible à partir du</T>{' '}
                          {new Date(carnet.rappelProchaineDate).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </DataState>
        </CardContent>
      </Card>
    </div>
  )
}
