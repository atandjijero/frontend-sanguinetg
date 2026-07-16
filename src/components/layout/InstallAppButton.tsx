import { DownloadIcon, ShareIcon } from 'lucide-react'
import { Button } from '../ui-shadcn/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui-shadcn/ui/dropdown-menu'
import { usePwaInstall } from '../../hooks/usePwaInstall'
import { T } from '../../context/LanguageContext'

export function InstallAppButton() {
  const { peutInstaller, afficherInstructionsIos, installer } = usePwaInstall()

  if (peutInstaller) {
    return (
      <Button variant="outline" size="icon" aria-label="Installer l'application" onClick={installer}>
        <DownloadIcon className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  if (afficherInstructionsIos) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Installer l'application">
            <DownloadIcon className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="font-normal text-sm text-secondary whitespace-normal flex items-center gap-1 flex-wrap">
            <T>Appuyez sur</T> <ShareIcon size={14} className="inline text-primary shrink-0" aria-hidden />{' '}
            <T>puis « Sur l'écran d'accueil » pour installer l'application.</T>
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return null
}
