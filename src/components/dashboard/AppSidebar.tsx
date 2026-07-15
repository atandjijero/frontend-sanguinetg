import type { ComponentProps, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { HeartPulseIcon } from 'lucide-react'
import { NavUser } from '@/components/ui-shadcn/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui-shadcn/ui/sidebar'
import { NavMain } from './NavMain'
import type { NavItem } from './nav-items'
import type { Utilisateur } from '../../lib/types'

interface AppSidebarProps extends ComponentProps<typeof Sidebar> {
  brandLabel: string
  brandHref: string
  items: NavItem[]
  user: Utilisateur
  profilPath: string
  onLogout: () => void
  roleBadge?: ReactNode
  /** Resserre l'espacement des items du menu — utile quand la liste est longue (espace CNTS). */
  compact?: boolean
}

export function AppSidebar({
  brandLabel,
  brandHref,
  items,
  user,
  profilPath,
  onLogout,
  roleBadge,
  compact = false,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link to={brandHref}>
                <HeartPulseIcon className="h-5 w-5 text-primary" />
                <span className="text-base font-semibold">{brandLabel}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {roleBadge}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} compact={compact} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} profilPath={profilPath} onLogout={onLogout} />
      </SidebarFooter>
    </Sidebar>
  )
}
