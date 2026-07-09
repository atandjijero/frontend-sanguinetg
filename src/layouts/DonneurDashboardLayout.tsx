import { Outlet, useNavigate } from 'react-router-dom'
import { AppSidebar } from '../components/dashboard/AppSidebar'
import { DONNEUR_NAV_ITEMS } from '../components/dashboard/nav-items'
import { SidebarInset, SidebarProvider } from '../components/ui-shadcn/ui/sidebar'
import { SiteHeader } from '../components/ui-shadcn/site-header'
import { Badge } from '../components/ui-shadcn/ui/badge'
import { useAuth } from '../context/AuthContext'

/**
 * Sidebar donneur volontairement distincte du sidebar CNTS : accent vert (marque "santé/don")
 * au lieu du rouge institutionnel, et navigation propre au parcours donneur.
 */
export default function DonneurDashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

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
              Espace donneur
            </Badge>
          }
        />
        <SidebarInset>
          <SiteHeader title="Mon espace donneur" />
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
