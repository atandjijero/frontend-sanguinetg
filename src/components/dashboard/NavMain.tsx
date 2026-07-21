import { NavLink } from 'react-router-dom'
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui-shadcn/ui/sidebar'
import { T } from '../../context/LanguageContext'
import type { NavItem } from './nav-items'

export function NavMain({ items, compact = false }: { items: NavItem[]; compact?: boolean }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu className="gap-1.5">
          {items.map((item) => (
            <SidebarMenuItem key={item.to}>
              <SidebarMenuButton asChild tooltip={{ children: <T>{item.title}</T> }} size="lg" className="h-11 text-sm">
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : undefined
                  }
                >
                  <span>
                    <T>{item.title}</T>
                  </span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
