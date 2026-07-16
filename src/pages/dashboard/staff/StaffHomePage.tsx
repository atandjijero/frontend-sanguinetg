import { Link } from 'react-router-dom'
import { BookHeartIcon, MegaphoneIcon, RssIcon, TimerIcon, UsersIcon } from 'lucide-react'
import { StatCard } from '../../../components/dashboard/StatCard'
import { DonneurGroupeDonut } from '../../../components/dashboard/DonneurGroupeDonut'
import { DonsParMoisChart } from '../../../components/dashboard/DonsParMoisChart'
import { useApiData } from '../../../hooks/useApiData'
import { useAuth } from '../../../context/AuthContext'
import { T } from '../../../context/LanguageContext'
import type { AbonneNewsletter, Alerte, CarnetDigital, StatistiquesMobilisation, Utilisateur } from '../../../lib/types'

export default function StaffHomePage() {
  const { user } = useAuth()
  const peutVoirDonneurs = user?.role === 'SUPERADMIN' || user?.role === 'ADMIN' || user?.role === 'AGENT_CNTS'
  const estSuperadmin = user?.role === 'SUPERADMIN'

  const { data: donneurs } = useApiData<Utilisateur[]>(peutVoirDonneurs ? '/users?role=DONNEUR' : null)
  const { data: alertesOuvertes } = useApiData<Alerte[]>('/alertes?statut=OUVERTE')
  const { data: carnets } = useApiData<CarnetDigital[]>('/carnets')
  const { data: mobilisation } = useApiData<StatistiquesMobilisation>('/alertes/statistiques/mobilisation')
  const { data: abonnes } = useApiData<AbonneNewsletter[]>(estSuperadmin ? '/newsletter' : null)

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
          <T>Bienvenue,</T> {user?.prenom} {user?.nom}
        </h2>
        <p className="text-sm text-muted-foreground">
          <T>Vue d'ensemble de la mobilisation des donneurs à Lomé.</T>
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {peutVoirDonneurs && (
          <StatCard label={<T>Donneurs inscrits</T>} value={donneurs?.length ?? '—'} icon={UsersIcon} />
        )}
        <StatCard label={<T>Alertes ouvertes</T>} value={alertesOuvertes?.length ?? '—'} icon={MegaphoneIcon} />
        <StatCard label={<T>Dons enregistrés ce mois-ci</T>} value={donsCeMois} icon={BookHeartIcon} />
        <StatCard
          label={<T>Délai moyen de mobilisation</T>}
          value={mobilisation?.delaiMoyenMinutes != null ? `${mobilisation.delaiMoyenMinutes} min` : '—'}
          icon={TimerIcon}
          hint={
            mobilisation?.tauxCouvertureUneHeure != null ? (
              <T>{`${mobilisation.tauxCouvertureUneHeure}% des alertes couvertes en moins d'1h`}</T>
            ) : undefined
          }
        />
        {estSuperadmin && (
          <StatCard
            label={<T>Abonnés newsletter</T>}
            value={abonnes?.length ?? '—'}
            icon={RssIcon}
            hint={
              <Link to="/admin/abonnes" className="text-primary hover:underline">
                <T>Voir la liste</T>
              </Link>
            }
          />
        )}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {peutVoirDonneurs && <DonneurGroupeDonut donneurs={donneurs ?? []} />}
        <DonsParMoisChart carnets={carnets ?? []} />
      </div>
    </div>
  )
}
