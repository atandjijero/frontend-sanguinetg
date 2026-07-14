import { BookHeartIcon, MegaphoneIcon, TimerIcon, UsersIcon } from 'lucide-react'
import { StatCard } from '../../../components/dashboard/StatCard'
import { DonneurGroupeDonut } from '../../../components/dashboard/DonneurGroupeDonut'
import { DonsParMoisChart } from '../../../components/dashboard/DonsParMoisChart'
import { useApiData } from '../../../hooks/useApiData'
import { useAuth } from '../../../context/AuthContext'
import type { Alerte, CarnetDigital, StatistiquesMobilisation, Utilisateur } from '../../../lib/types'

export default function StaffHomePage() {
  const { user } = useAuth()
  const peutVoirDonneurs = user?.role === 'SUPERADMIN' || user?.role === 'ADMIN' || user?.role === 'AGENT_CNTS'

  const { data: donneurs } = useApiData<Utilisateur[]>(peutVoirDonneurs ? '/users?role=DONNEUR' : null)
  const { data: alertesOuvertes } = useApiData<Alerte[]>('/alertes?statut=OUVERTE')
  const { data: carnets } = useApiData<CarnetDigital[]>('/carnets')
  const { data: mobilisation } = useApiData<StatistiquesMobilisation>('/alertes/statistiques/mobilisation')

  const donsCeMois =
    carnets?.filter((c) => {
      const date = new Date(c.dateDon)
      const now = new Date()
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }).length ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">
          Bienvenue, {user?.prenom} {user?.nom}
        </h2>
        <p className="text-sm text-muted-foreground">Vue d'ensemble de la mobilisation des donneurs à Lomé.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {peutVoirDonneurs && (
          <StatCard label="Donneurs inscrits" value={donneurs?.length ?? '—'} icon={UsersIcon} />
        )}
        <StatCard label="Alertes ouvertes" value={alertesOuvertes?.length ?? '—'} icon={MegaphoneIcon} />
        <StatCard label="Dons enregistrés ce mois-ci" value={donsCeMois} icon={BookHeartIcon} />
        <StatCard
          label="Délai moyen de mobilisation"
          value={mobilisation?.delaiMoyenMinutes != null ? `${mobilisation.delaiMoyenMinutes} min` : '—'}
          icon={TimerIcon}
          hint={
            mobilisation?.tauxCouvertureUneHeure != null
              ? `${mobilisation.tauxCouvertureUneHeure}% des alertes couvertes en moins d'1h`
              : undefined
          }
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {peutVoirDonneurs && <DonneurGroupeDonut donneurs={donneurs ?? []} />}
        <DonsParMoisChart carnets={carnets ?? []} />
      </div>
    </div>
  )
}
