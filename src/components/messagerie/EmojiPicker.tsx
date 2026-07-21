import { SmileIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui-shadcn/ui/dropdown-menu'
import { Button } from '../ui-shadcn/ui/button'

const EMOJIS = [
  '😀', '😁', '😂', '🤣', '😊', '🙂', '😉', '😍',
  '😘', '🥰', '😎', '🤔', '😐', '😴', '😅', '😢',
  '😭', '😡', '😱', '🤗', '🤝', '👋', '👍', '👎',
  '👏', '💪', '🙌', '🙏', '❤️', '💔', '🎉', '🔥',
  '✅', '❌', '💯', '✨', '⏰', '📅', '🩸', '💉',
  '🏥', '👨‍⚕️', '👩‍⚕️', '🩹', '❓', '❗', '☺️', '🫶',
]

export function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="icon" className="shrink-0">
          <SmileIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="grid w-64 grid-cols-8 gap-0.5 p-2">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onSelect(emoji)}
            className="rounded p-1 text-lg leading-none hover:bg-muted"
          >
            {emoji}
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
