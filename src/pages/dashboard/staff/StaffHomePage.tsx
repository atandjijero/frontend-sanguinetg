import { Link } from 'react-router-dom'
import { BookHeartIcon, HeartHandshakeIcon, MegaphoneIcon, RepeatIcon, RssIcon, SmileIcon, TimerIcon, UsersIcon } from 'lucide-react'
import { StatCard } from '../../../components/dashboard/StatCard'
import { DonneurGroupeDonut } from '../../../components/dashboard/DonneurGroupeDonut'
import { DonsParMoisChart } from '../../../components/dashboard/DonsParMoisChart'
import { TauxCouvertureGauge } from '../../../components/dashboard/TauxCouvertureGauge'
import { DernieresAlertesTable } from '../../../components/dashboard/DernieresAlertesTable'
import { useApiData } from '../../../hooks/useApiData'
import { useAuth } from '../../../context/AuthContext'
import { T } from '../../../context/LanguageContext'
import type {
  AbonneNewsletter,
  Alerte,
  CarnetDigital,
  StatistiquesFidelisation,
  StatistiquesMobilisation,
  StatistiquesSatisfaction,
  Utilisateur,
} from '../../../lib/types'

export default function StaffHomePage() {
  const { user } = useAuth()
  const peutVoirDonneurs = user?.role === 'SUPERADMIN' || user?.role === 'ADMIN' || user?.role === 'AGENT_CNTS'
  const estSuperadmin = user?.role === 'SUPERADMIN'

  const { data: donneurs } = useApiData<Utilisateur[]>(peutVoirDonneurs ? '/users?role=DONNEUR' : null)
  const { data: alertesOuvertes } = useApiData<Alerte[]>('/alertes?statut=OUVERTE')
  const { data: carnets } = useApiData<CarnetDigital[]>('/carnets')
  const { data: mobilisation } = useApiData<StatistiquesMobilisation>('/alertes/statistiques/mobilisation')
  const { data: abonnes } = useApiData<AbonneNewsletter[]>(estSuperadmin ? '/newsletter' : null)
  const { data: fidelisation } = useApiData<StatistiquesFidelisation>('/carnets/statistiques/fidelisation')
  const { data: satisfaction } = useApiData<StatistiquesSatisfaction>('/avis/statistiques')

  const now = new Date()
  const donsCeMois =
    carnets?.filter((c) => {
      const date = new Date(c.dateDon)
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }).length ?? 0
  const moisDernier = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const donsMoisDernier =
    carnets?.filter((c) => {
      const date = new Date(c.dateDon)
      return date.getMonth() === moisDernier.getMonth() && date.getFullYear() === moisDernier.getFullYear()
    }).length ?? 0
  const variationDons =
    donsMoisDernier > 0 ? Math.round(((donsCeMois - donsMoisDernier) / donsMoisDernier) * 100) : null

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
      <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        {peutVoirDonneurs && (
          <StatCard label={<T>Donneurs inscrits</T>} value={donneurs?.length ?? '—'} icon={UsersIcon} />
        )}
        <StatCard label={<T>Alertes ouvertes</T>} value={alertesOuvertes?.length ?? '—'} icon={MegaphoneIcon} />
        <StatCard
          label={<T>Dons enregistrés ce mois-ci</T>}
          value={donsCeMois}
          icon={BookHeartIcon}
          delta={
            variationDons !== null
              ? { direction: variationDons >= 0 ? 'up' : 'down', label: `${Math.abs(variationDons)}%` }
              : undefined
          }
          hint={variationDons !== null ? <T>vs mois dernier</T> : undefined}
        />
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
      <div>
        <h3 className="flex items-center gap-2 text-base font-semibold tracking-tight mb-3">
          <HeartHandshakeIcon className="h-4 w-4 text-primary" /> <T>Fidélisation des donneurs</T>
        </h3>
        <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
          <StatCard
            label={<T>Donneurs mobilisés dans l'heure</T>}
            value={mobilisation?.donneursMobilisesUneHeure ?? '—'}
            icon={HeartHandshakeIcon}
            hint={<T>par appel, en moyenne</T>}
          />
          <StatCard
            label={<T>Taux de dons répétés</T>}
            value={fidelisation?.tauxDonsRepetes != null ? `${fidelisation.tauxDonsRepetes}%` : '—'}
            icon={RepeatIcon}
            hint={<T>donneurs récurrents / total inscrits</T>}
          />
          <StatCard
            label={<T>Taux de rétention</T>}
            value={fidelisation?.tauxRetention != null ? `${fidelisation.tauxRetention}%` : '—'}
            icon={UsersIcon}
            hint={
              fidelisation ? (
                <T>{`sur ${fidelisation.donneursEligiblesRetention} donneur(s) inscrit(s) depuis + de ${fidelisation.joursPeriode}j`}</T>
              ) : undefined
            }
          />
          <StatCard
            label={<T>Taux de satisfaction</T>}
            value={satisfaction?.tauxSatisfaction != null ? `${satisfaction.tauxSatisfaction}%` : '—'}
            icon={SmileIcon}
            hint={satisfaction?.totalAvis ? <T>{`sur ${satisfaction.totalAvis} avis`}</T> : undefined}
          />
        </div>
      </div>
      {peutVoirDonneurs ? (
        <div className="grid gap-5 lg:grid-cols-2">
          <DonneurGroupeDonut donneurs={donneurs ?? []} />
          <DonsParMoisChart carnets={carnets ?? []} />
        </div>
      ) : (
        <DonsParMoisChart carnets={carnets ?? []} />
      )}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DernieresAlertesTable alertes={alertesOuvertes ?? []} />
        </div>
        <TauxCouvertureGauge taux={mobilisation?.tauxCouvertureUneHeure ?? null} />
      </div>
    </div>
  )
}
