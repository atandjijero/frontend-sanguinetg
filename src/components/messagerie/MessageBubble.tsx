import { MoreVerticalIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui-shadcn/ui/dropdown-menu'
import { useConfirm } from '../../context/ConfirmContext'
import { T } from '../../context/LanguageContext'
import { cn } from '@/lib/shadcn-utils'
import type { ChatMessage } from '../../lib/types'

const DELAI_MODIFICATION_MS = 15 * 60 * 1000

export function MessageBubble({
  message,
  estMoi,
  onEdit,
  onDelete,
}: {
  message: ChatMessage
  estMoi: boolean
  onEdit: (message: ChatMessage) => void
  onDelete: (message: ChatMessage) => void
}) {
  const confirm = useConfirm()
  const peutModifier = estMoi && !message.supprime && Date.now() - new Date(message.dateEnvoi).getTime() <= DELAI_MODIFICATION_MS

  async function handleDelete() {
    const ok = await confirm({
      title: 'Supprimer ce message ?',
      description: 'Ce message sera remplacé par « Message supprimé » pour tout le monde. Action irréversible.',
      confirmLabel: 'Supprimer',
      destructive: true,
    })
    if (ok) onDelete(message)
  }

  return (
    <div className={cn('group flex items-end gap-1', estMoi ? 'justify-end' : 'justify-start')}>
      {estMoi && !message.supprime && (
        <DropdownMenu>
          <DropdownMenuTrigger className="mb-1 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100">
            <MoreVerticalIcon className="h-3.5 w-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {peutModifier && (
              <DropdownMenuItem onClick={() => onEdit(message)}>
                <PencilIcon className="h-4 w-4" /> <T>Modifier</T>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
              <Trash2Icon className="h-4 w-4" /> <T>Supprimer</T>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2 text-sm',
          message.supprime
            ? 'italic text-muted-foreground bg-muted/50'
            : estMoi
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted',
        )}
      >
        {!estMoi && !message.supprime && (
          <p className="mb-0.5 text-xs font-medium text-muted-foreground">
            {message.auteur.role === 'DONNEUR' ? '' : 'Dr '}
            {message.auteur.prenom} {message.auteur.nom}
          </p>
        )}
        <p className="whitespace-pre-wrap">
          {message.supprime ? <T>Message supprimé</T> : message.contenu}
        </p>
        <p className={cn('mt-1 flex items-center gap-1 text-[10px]', estMoi ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
          {new Date(message.dateEnvoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          {message.edite && !message.supprime && (
            <>
              {' · '}
              <T>modifié</T>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
