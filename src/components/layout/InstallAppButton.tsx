import { DownloadIcon, PlusSquareIcon, ShareIcon } from 'lucide-react'
import { Button } from '../ui-shadcn/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
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
        <DropdownMenuContent align="end" className="w-80 p-4">
          <div className="flex items-center gap-3 mb-4">
            <img src="/pwa-192x192.png" alt="" className="h-10 w-10 rounded-xl shadow-sm" />
            <div>
              <p className="font-headline-md text-sm font-semibold text-on-surface leading-none">
                <T>Installer Sanguine TG</T>
              </p>
              <p className="text-caption text-secondary mt-1">
                <T>Accès direct depuis votre écran d'accueil</T>
              </p>
            </div>
          </div>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tertiary/10 text-tertiary text-xs font-bold">
                1
              </span>
              <p className="text-sm text-on-surface-variant leading-snug">
                <T>Appuyez sur l'icône</T> <ShareIcon size={14} className="inline text-tertiary shrink-0 -mt-0.5" aria-hidden />{' '}
                <T>Partager, en bas de Safari.</T>
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tertiary/10 text-tertiary text-xs font-bold">
                2
              </span>
              <p className="text-sm text-on-surface-variant leading-snug">
                <T>Choisissez</T> <PlusSquareIcon size={14} className="inline text-tertiary shrink-0 -mt-0.5" aria-hidden />{' '}
                « <T>Sur l'écran d'accueil</T> », <T>puis confirmez.</T>
              </p>
            </li>
          </ol>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return null
}
