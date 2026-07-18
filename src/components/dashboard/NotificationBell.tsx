import { useEffect } from 'react'
import { BellIcon, MailIcon } from 'lucide-react'
import { Button } from '../ui-shadcn/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui-shadcn/ui/dropdown-menu'
import { useApiData } from '../../hooks/useApiData'
import { api } from '../../lib/api'
import type { NotificationDonneur } from '../../lib/types'
import { useNotifications } from '../../context/NotificationsContext'
import { T } from '../../context/LanguageContext'

export function NotificationBell() {
  const { refreshKey } = useNotifications()
  const { data: notifications, refetch } = useApiData<NotificationDonneur[]>('/notifications', [refreshKey])
  const nonLues = (notifications ?? []).filter((n) => n.statut !== 'LUE').length

  // Synchronise le badge de l'icône (façon WhatsApp) avec le nombre réel de non-lues
  // dès que l'app est ouverte au premier plan — le service worker s'en charge déjà
  // quand une notification arrive app fermée.
  useEffect(() => {
    if (!('setAppBadge' in navigator)) return
    if (nonLues > 0) {
      navigator.setAppBadge(nonLues).catch(() => undefined)
    } else {
      navigator.clearAppBadge().catch(() => undefined)
    }
  }, [nonLues])

  async function marquerLue(id: string) {
    await api.patch(`/notifications/${id}/lue`)
    await refetch()
  }

  async function marquerToutesLues() {
    await api.patch('/notifications/lues')
    await refetch()
  }

  return (
    <DropdownMenu onOpenChange={(open) => open && refetch()}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Notifications" className="relative">
          <BellIcon className="h-[1.2rem] w-[1.2rem]" />
          {nonLues > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
              {nonLues > 9 ? '9+' : nonLues}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          {nonLues > 0 && (
            <button type="button" className="text-xs text-primary hover:underline" onClick={marquerToutesLues}>
              <T>Tout marquer lu</T>
            </button>
          )}
        </div>
        <DropdownMenuSeparator />
        {!notifications?.length && (
          <p className="px-2 py-4 text-center text-sm text-muted-foreground">
            <T>Aucune notification.</T>
          </p>
        )}
        <div className="max-h-96 overflow-y-auto">
          {notifications?.map((n) => (
            <DropdownMenuItem
              key={n.id}
              className={`flex flex-col items-start gap-1 whitespace-normal py-2 ${n.statut !== 'LUE' ? 'bg-primary/5' : ''}`}
              onClick={() => n.statut !== 'LUE' && marquerLue(n.id)}
            >
              <p className="text-sm">
                <T>{n.contenu}</T>
              </p>
              <div className="flex items-center gap-3 text-muted-foreground">
                <span className="flex items-center gap-1 text-[11px]" title="Notification in-app">
                  <BellIcon className="h-3 w-3" /> Push
                </span>
                <span
                  className={`flex items-center gap-1 text-[11px] ${n.emailEnvoye ? 'text-tertiary' : ''}`}
                  title={n.emailEnvoye ? 'Email envoyé' : 'Email non envoyé'}
                >
                  <MailIcon className="h-3 w-3" /> {n.emailEnvoye ? 'Email' : '—'}
                </span>
                <span className="ml-auto text-[11px]">{new Date(n.dateEnvoi).toLocaleDateString('fr-FR')}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
