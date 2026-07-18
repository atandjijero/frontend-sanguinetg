import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { AppSidebar } from '../components/dashboard/AppSidebar'
import { NotificationBell } from '../components/dashboard/NotificationBell'
import { DONNEUR_NAV_ITEMS } from '../components/dashboard/nav-items'
import { SidebarInset, SidebarProvider } from '../components/ui-shadcn/ui/sidebar'
import { SiteHeader } from '../components/ui-shadcn/site-header'
import { Badge } from '../components/ui-shadcn/ui/badge'
import { useAuth } from '../context/AuthContext'
import { useConfirm } from '../context/ConfirmContext'
import { usePushSubscription } from '../hooks/usePushSubscription'
import { T, useTraduction } from '../context/LanguageContext'

const CLE_REFUS_NOTIFICATIONS = 'sanguine-tg-notifications-refusees'

/**
 * Sidebar donneur volontairement distincte du sidebar CNTS : accent vert (marque "santé/don")
 * au lieu du rouge institutionnel, et navigation propre au parcours donneur.
 */
export default function DonneurDashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { supporte, pret, abonne, abonner } = usePushSubscription()
  const confirm = useConfirm()
  const titre = useTraduction('Activer les notifications')
  const description = useTraduction(
    "Recevez une alerte dès qu'un don compatible avec votre groupe sanguin est recherché près de chez vous — même quand l'application est fermée.",
  )
  const labelActiver = useTraduction('Activer')
  const labelPlusTard = useTraduction('Plus tard')

  // On propose l'abonnement aux notifications push via une carte à l'image du reste de
  // l'app (même style que les confirmations de suppression), plutôt que de laisser le
  // navigateur afficher sa popup native sans contexte. Cette popup native ne s'affiche
  // ensuite que si le donneur accepte ; un refus de la carte n'est pas re-proposé.
  useEffect(() => {
    if (!pret || !supporte || abonne) return
    if (typeof Notification !== 'undefined' && Notification.permission === 'denied') return
    if (localStorage.getItem(CLE_REFUS_NOTIFICATIONS) === '1') return

    let annule = false
    ;(async () => {
      const accepte = await confirm({
        title: titre,
        description,
        confirmLabel: labelActiver,
        cancelLabel: labelPlusTard,
        destructive: false,
      })
      if (annule) return
      if (accepte) {
        await abonner()
      } else {
        localStorage.setItem(CLE_REFUS_NOTIFICATIONS, '1')
      }
    })()

    return () => {
      annule = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pret, supporte, abonne])

  if (!user) return null

  const handleLogout = async () => {
    await logout()
    navigate('/connexion', { replace: true })
  }

  return (
    <div
      style={
        {
          '--sidebar-primary': '162 100% 17%',
          '--sidebar-ring': '162 100% 17%',
          '--sidebar-accent': '158 49% 92%',
        } as React.CSSProperties
      }
    >
      <SidebarProvider style={{ '--sidebar-width': '16rem' } as React.CSSProperties}>
        <AppSidebar
          brandLabel="Sanguine TG · Donneur"
          brandHref="/espace-donneur"
          items={DONNEUR_NAV_ITEMS}
          user={user}
          profilPath="/espace-donneur/profil"
          onLogout={handleLogout}
          roleBadge={
            <Badge variant="outline" className="mx-2 mt-1 w-fit border-tertiary/30 text-tertiary">
              <T>Espace donneur</T>
            </Badge>
          }
        />
        <SidebarInset>
          <SiteHeader title={<T>Mon espace donneur</T>} actions={<NotificationBell />} />
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
