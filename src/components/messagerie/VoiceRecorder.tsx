import { useEffect, useRef, useState } from 'react'
import { MicIcon, PauseIcon, PlayIcon, SendIcon, SquareIcon, Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../ui-shadcn/ui/button'
import { T } from '../../context/LanguageContext'

function formatDuree(secondes: number): string {
  const minutes = Math.floor(secondes / 60)
  const reste = secondes % 60
  return `${minutes}:${reste.toString().padStart(2, '0')}`
}

/** Message précis selon la cause réelle du refus, plutôt qu'un « impossible d'accéder » générique. */
function messageErreurMicro(error: unknown): string {
  if (!(error instanceof DOMException)) return "Impossible d'accéder au microphone."

  switch (error.name) {
    case 'NotAllowedError':
    case 'PermissionDeniedError':
      return 'Accès au microphone refusé — autorisez-le dans les paramètres du navigateur (icône 🔒 à côté de l’URL) puis réessayez.'
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return 'Aucun microphone détecté sur cet appareil.'
    case 'NotReadableError':
    case 'TrackStartError':
      return 'Le microphone est déjà utilisé par une autre application.'
    case 'SecurityError':
      return "L'enregistrement audio nécessite une connexion sécurisée (HTTPS ou localhost)."
    default:
      return `Impossible d'accéder au microphone (${error.name}).`
  }
}

export function VoiceRecorder({
  onSend,
  onActifChange,
  onRecordingChange,
  disabled,
}: {
  onSend: (blob: Blob, dureeSecondes: number) => void
  onActifChange?: (actif: boolean) => void
  /** Signale à l'autre partie « X enregistre un message vocal » — réémis à chaque seconde
   * tant que l'enregistrement est en cours, pour que le filet de sécurité côté réception
   * (qui efface l'indicateur après quelques secondes d'inactivité) ne l'efface pas à tort
   * pendant un enregistrement qui peut durer plusieurs minutes. */
  onRecordingChange?: (enregistrement: boolean) => void
  disabled?: boolean
}) {
  const [etat, setEtat] = useState<'idle' | 'recording' | 'preview'>('idle')
  const [dureeEcoulee, setDureeEcoulee] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [lecture, setLecture] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const blobRef = useRef<Blob | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    onActifChange?.(etat !== 'idle')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etat])

  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  async function demarrerEnregistrement() {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("L'enregistrement audio nécessite une connexion sécurisée (HTTPS ou localhost).")
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        blobRef.current = blob
        setAudioUrl(URL.createObjectURL(blob))
        setEtat('preview')
      }
      mediaRecorderRef.current = recorder
      recorder.start()
      setDureeEcoulee(0)
      setEtat('recording')
      onRecordingChange?.(true)
      intervalRef.current = setInterval(() => {
        setDureeEcoulee((d) => d + 1)
        onRecordingChange?.(true)
      }, 1000)
    } catch (error) {
      console.error('Erreur accès micro :', error)
      toast.error(messageErreurMicro(error))
    }
  }

  function arreterEnregistrement() {
    mediaRecorderRef.current?.stop()
    streamRef.current?.getTracks().forEach((t) => t.stop())
    if (intervalRef.current) clearInterval(intervalRef.current)
    onRecordingChange?.(false)
  }

  function annuler() {
    if (etat === 'recording') {
      mediaRecorderRef.current?.stop()
      streamRef.current?.getTracks().forEach((t) => t.stop())
      onRecordingChange?.(false)
    }
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioUrl(null)
    blobRef.current = null
    setLecture(false)
    setDureeEcoulee(0)
    setEtat('idle')
  }

  function envoyer() {
    if (blobRef.current) onSend(blobRef.current, dureeEcoulee)
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioUrl(null)
    blobRef.current = null
    setLecture(false)
    setDureeEcoulee(0)
    setEtat('idle')
  }

  function togglePreviewLecture() {
    if (!audioRef.current) return
    if (lecture) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
  }

  if (etat === 'idle') {
    return (
      <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={demarrerEnregistrement} disabled={disabled}>
        <MicIcon className="h-4 w-4" />
      </Button>
    )
  }

  if (etat === 'recording') {
    return (
      <div className="flex flex-1 items-center gap-2 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-1.5">
        <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-destructive" />
        <span className="text-sm tabular-nums text-destructive">{formatDuree(dureeEcoulee)}</span>
        <span className="flex-1 text-xs text-muted-foreground">
          <T>Enregistrement…</T>
        </span>
        <Button type="button" variant="ghost" size="icon" onClick={annuler}>
          <Trash2Icon className="h-4 w-4" />
        </Button>
        <Button type="button" size="icon" onClick={arreterEnregistrement}>
          <SquareIcon className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-1.5">
      <audio
        ref={audioRef}
        src={audioUrl ?? undefined}
        onPlay={() => setLecture(true)}
        onPause={() => setLecture(false)}
        onEnded={() => setLecture(false)}
        className="hidden"
      />
      <Button type="button" variant="ghost" size="icon" onClick={togglePreviewLecture}>
        {lecture ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
      </Button>
      <span className="flex-1 text-xs tabular-nums text-muted-foreground">{formatDuree(dureeEcoulee)}</span>
      <Button type="button" variant="ghost" size="icon" onClick={annuler}>
        <Trash2Icon className="h-4 w-4" />
      </Button>
      <Button type="button" size="icon" onClick={envoyer}>
        <SendIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
