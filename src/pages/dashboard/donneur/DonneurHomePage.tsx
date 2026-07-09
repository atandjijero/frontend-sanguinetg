import { BookHeartIcon, GiftIcon, MegaphoneIcon } from 'lucide-react'
import { StatCard } from '../../../components/dashboard/StatCard'
import { ProchainDonMeter } from '../../../components/dashboard/ProchainDonMeter'
import { useApiData } from '../../../hooks/useApiData'
import { useAuth } from '../../../context/AuthContext'
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
          Merci {user?.prenom}, chaque don compte
        </h2>
        <p className="text-sm text-muted-foreground">
          Voici un résumé de votre engagement auprès du CNTS.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Alertes en attente de réponse" value={alertesEnAttente} icon={MegaphoneIcon} />
        <StatCard label="Dons effectués" value={carnets?.length ?? '—'} icon={BookHeartIcon} />
        <StatCard label="Récompenses reçues" value={recompenses?.length ?? '—'} icon={GiftIcon} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ProchainDonMeter carnets={carnets ?? []} />
      </div>
    </div>
  )
}
