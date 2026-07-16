import { Outlet, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { AppSidebar } from '../components/dashboard/AppSidebar'
import { STAFF_NAV_ITEMS, filtrerParRole } from '../components/dashboard/nav-items'
import { SidebarInset, SidebarProvider } from '../components/ui-shadcn/ui/sidebar'
import { SiteHeader } from '../components/ui-shadcn/site-header'
import { Badge } from '../components/ui-shadcn/ui/badge'
import { useAuth } from '../context/AuthContext'
import { T } from '../context/LanguageContext'
import type { Role } from '../lib/types'

const ROLE_LABELS: Record<Role, string> = {
  SUPERADMIN: 'Super administrateur',
  ADMIN: 'Administrateur',
  MEDECIN: 'Médecin',
  AGENT_CNTS: 'Agent CNTS',
  DONNEUR: 'Donneur',
}

export default function StaffDashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const items = useMemo(() => (user ? filtrerParRole(STAFF_NAV_ITEMS, user.role) : []), [user])

  if (!user) return null

  const handleLogout = async () => {
    await logout()
    navigate('/connexion', { replace: true })
  }

  return (
    <SidebarProvider style={{ '--sidebar-width': '16rem' } as React.CSSProperties}>
      <AppSidebar
        brandLabel="Sanguine TG · CNTS"
        brandHref="/admin"
        items={items}
        user={user}
        profilPath="/admin/profil"
        onLogout={handleLogout}
        compact
        roleBadge={
          <Badge variant="outline" className="mx-2 mt-1 w-fit border-primary/30 text-primary">
            <T>{ROLE_LABELS[user.role]}</T>
          </Badge>
        }
      />
      <SidebarInset>
        <SiteHeader title={<T>{user.role === 'SUPERADMIN' ? 'Espace superadmin' : 'Espace CNTS'}</T>} />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
