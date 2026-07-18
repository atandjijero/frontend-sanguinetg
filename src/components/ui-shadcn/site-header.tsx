import type { ReactNode } from 'react'
import { Separator } from '@/components/ui-shadcn/ui/separator'
import { SidebarTrigger } from '@/components/ui-shadcn/ui/sidebar'
import { ModeToggle } from '@/components/ui-shadcn/mode-toggle'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'

export function SiteHeader({ title, actions }: { title: ReactNode; actions?: ReactNode }) {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 flex h-14 shrink-0 items-center gap-2 border-b border-border/60 bg-card/60 backdrop-blur transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="min-w-0 flex-1 truncate text-base font-semibold">{title}</h1>
        {actions}
        <LanguageSwitcher />
        <ModeToggle />
      </div>
    </header>
  )
}
