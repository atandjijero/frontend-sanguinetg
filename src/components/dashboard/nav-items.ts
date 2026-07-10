import {
  BookHeartIcon,
  Building2Icon,
  GaugeIcon,
  GiftIcon,
  HeartHandshakeIcon,
  MailIcon,
  MapPinIcon,
  MegaphoneIcon,
  ShieldAlertIcon,
  StethoscopeIcon,
  UsersIcon,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Role } from '../../lib/types'

export interface NavItem {
  title: string
  to: string
  icon: LucideIcon
  /** Rôles autorisés à voir cet item. Omis = visible par tous les rôles du sidebar concerné. */
  roles?: Role[]
  end?: boolean
}

export const STAFF_NAV_ITEMS: NavItem[] = [
  { title: 'Tableau de bord', to: '/admin', icon: GaugeIcon, end: true },
  {
    title: 'Alertes',
    to: '/admin/alertes',
    icon: MegaphoneIcon,
    roles: ['SUPERADMIN', 'ADMIN', 'AGENT_CNTS'],
  },
  {
    title: 'Donneurs',
    to: '/admin/donneurs',
    icon: HeartHandshakeIcon,
    roles: ['SUPERADMIN', 'ADMIN', 'AGENT_CNTS'],
  },
  {
    title: 'Carnets de don',
    to: '/admin/carnets',
    icon: BookHeartIcon,
    roles: ['SUPERADMIN', 'ADMIN', 'AGENT_CNTS', 'MEDECIN'],
  },
  {
    title: 'Récompenses',
    to: '/admin/recompenses',
    icon: GiftIcon,
    roles: ['SUPERADMIN', 'ADMIN', 'AGENT_CNTS'],
  },
  {
    title: 'Conseils santé',
    to: '/admin/conseils',
    icon: StethoscopeIcon,
    roles: ['SUPERADMIN', 'ADMIN', 'MEDECIN'],
  },
  {
    title: 'Quartiers',
    to: '/admin/quartiers',
    icon: MapPinIcon,
    roles: ['SUPERADMIN', 'ADMIN'],
  },
  {
    title: 'Centres de collecte',
    to: '/admin/centres-don',
    icon: Building2Icon,
    roles: ['SUPERADMIN', 'ADMIN'],
  },
  {
    title: 'Messages',
    to: '/admin/messages',
    icon: MailIcon,
    roles: ['SUPERADMIN', 'ADMIN', 'AGENT_CNTS'],
  },
  {
    title: 'Équipe CNTS',
    to: '/admin/equipe',
    icon: UsersIcon,
    roles: ['SUPERADMIN', 'ADMIN'],
  },
  {
    title: 'Sécurité',
    to: '/admin/securite',
    icon: ShieldAlertIcon,
    roles: ['SUPERADMIN'],
  },
]

export const DONNEUR_NAV_ITEMS: NavItem[] = [
  { title: 'Tableau de bord', to: '/espace-donneur', icon: GaugeIcon, end: true },
  { title: 'Mes alertes', to: '/espace-donneur/alertes', icon: MegaphoneIcon },
  { title: 'Centres de don', to: '/espace-donneur/centres', icon: Building2Icon },
  { title: 'Mon carnet de don', to: '/espace-donneur/carnet', icon: BookHeartIcon },
  { title: 'Mes récompenses', to: '/espace-donneur/recompenses', icon: GiftIcon },
  { title: 'Conseils santé', to: '/espace-donneur/conseils', icon: StethoscopeIcon },
]

export function filtrerParRole(items: NavItem[], role: Role): NavItem[] {
  if (role === 'SUPERADMIN') return items
  return items.filter((item) => !item.roles || item.roles.includes(role))
}
