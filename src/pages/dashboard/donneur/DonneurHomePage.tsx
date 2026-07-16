import { BookHeartIcon, GiftIcon, MegaphoneIcon } from 'lucide-react'
import { StatCard } from '../../../components/dashboard/StatCard'
import { ProchainDonMeter } from '../../../components/dashboard/ProchainDonMeter'
import { useApiData } from '../../../hooks/useApiData'
import { useAuth } from '../../../context/AuthContext'
import { T } from '../../../context/LanguageContext'
import type { Alerte, CarnetDigital, Recompense } from '../../../lib/types'

export default function DonneurHomePage() {
  const { user } = useAuth()
  const { data: alertes } = useApiData<Alerte[]>('/alertes')
  const { data: carnets } = useApiData<CarnetDigital[]>('/carnets')
  const { data: recompenses } = useApiData<Recompense[]>('/recompenses')

  const alertesEnAttente = alertes?.filter((a) => !a.maReponse).length ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">
          <T>Merci</T> {user?.prenom}, <T>chaque don compte</T>
        </h2>
        <p className="text-sm text-muted-foreground">
          <T>Voici un résumé de votre engagement auprès du CNTS.</T>
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label={<T>Alertes en attente de réponse</T>} value={alertesEnAttente} icon={MegaphoneIcon} />
        <StatCard label={<T>Dons effectués</T>} value={carnets?.length ?? '—'} icon={BookHeartIcon} />
        <StatCard label={<T>Récompenses reçues</T>} value={recompenses?.length ?? '—'} icon={GiftIcon} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ProchainDonMeter carnets={carnets ?? []} />
      </div>
    </div>
  )
}
