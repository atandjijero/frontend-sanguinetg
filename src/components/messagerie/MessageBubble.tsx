import { useRef, useState } from 'react'
import { MoreVerticalIcon, PauseIcon, PencilIcon, PlayIcon, Trash2Icon } from 'lucide-react'
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

function formatDuree(secondes: number): string {
  const minutes = Math.floor(secondes / 60)
  const reste = secondes % 60
  return `${minutes}:${reste.toString().padStart(2, '0')}`
}

function AudioMessagePlayer({ src, dureeSecondes, estMoi }: { src: string; dureeSecondes: number | null; estMoi: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const barreRef = useRef<HTMLDivElement>(null)
  const [lecture, setLecture] = useState(false)
  const [progression, setProgression] = useState(0)
  const [tempsEcoule, setTempsEcoule] = useState(0)

  function togglePlay() {
    if (!audioRef.current) return
    if (lecture) audioRef.current.pause()
    else audioRef.current.play()
  }

  function handleTimeUpdate() {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    setProgression(audio.currentTime / audio.duration)
    setTempsEcoule(Math.floor(audio.currentTime))
  }

  function handleSeek(event: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current
    const barre = barreRef.current
    if (!audio || !barre || !audio.duration) return
    const rect = barre.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
    audio.currentTime = ratio * audio.duration
  }

  const dureeAffichee = tempsEcoule > 0 ? tempsEcoule : (dureeSecondes ?? 0)

  return (
    <div className="flex min-w-[180px] items-center gap-2">
      <audio
        ref={audioRef}
        src={src}
        onPlay={() => setLecture(true)}
        onPause={() => setLecture(false)}
        onEnded={() => {
          setLecture(false)
          setProgression(0)
          setTempsEcoule(0)
        }}
        onTimeUpdate={handleTimeUpdate}
        className="hidden"
      />
      <button
        type="button"
        onClick={togglePlay}
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          estMoi ? 'bg-primary-foreground/20' : 'bg-primary/10',
        )}
      >
        {lecture ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4 translate-x-0.5" />}
      </button>
      <div
        ref={barreRef}
        onClick={handleSeek}
        className={cn('relative h-1.5 flex-1 cursor-pointer rounded-full', estMoi ? 'bg-primary-foreground/30' : 'bg-foreground/15')}
      >
        <div
          className={cn('absolute inset-y-0 left-0 rounded-full', estMoi ? 'bg-primary-foreground' : 'bg-primary')}
          style={{ width: `${progression * 100}%` }}
        />
      </div>
      <span className="shrink-0 text-[10px] tabular-nums">{formatDuree(dureeAffichee)}</span>
    </div>
  )
}

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
  const peutModifier =
    estMoi &&
    !message.supprime &&
    message.type === 'TEXTE' &&
    Date.now() - new Date(message.dateEnvoi).getTime() <= DELAI_MODIFICATION_MS

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
        {message.supprime ? (
          <p className="whitespace-pre-wrap">
            <T>Message supprimé</T>
          </p>
        ) : message.type === 'AUDIO' && message.audioUrl ? (
          <AudioMessagePlayer src={message.audioUrl} dureeSecondes={message.audioDureeSecondes} estMoi={estMoi} />
        ) : (
          <p className="whitespace-pre-wrap">{message.contenu}</p>
        )}
        <p className={cn('mt-1 text-[10px]', estMoi ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
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
