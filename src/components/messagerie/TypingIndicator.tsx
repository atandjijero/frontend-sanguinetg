import { MicIcon } from 'lucide-react'
import { T } from '../../context/LanguageContext'

export function TypingIndicator({ label, vocal }: { label: string; vocal?: boolean }) {
  return (
    <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
      {vocal ? (
        <MicIcon className="h-3.5 w-3.5 animate-pulse text-destructive" />
      ) : (
        <span className="flex gap-0.5">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
        </span>
      )}
      <T>{label}</T>
    </div>
  )
}
