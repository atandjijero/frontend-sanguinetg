import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function estDejaInstallee() {
  return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as { standalone?: boolean }).standalone === true
}

function estIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
}

/**
 * Expose l'invite d'installation PWA native (Chrome/Edge/Android). Cet évènement n'existe
 * pas sur iOS/Safari (pas d'API d'installation programmable) : `estIos` permet d'afficher
 * une instruction manuelle à la place d'un bouton non fonctionnel.
 */
export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installee, setInstallee] = useState(estDejaInstallee)

  useEffect(() => {
    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
    }
    function onAppInstalled() {
      setDeferredPrompt(null)
      setInstallee(true)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onAppInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onAppInstalled)
    }
  }, [])

  async function installer() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }

  return {
    peutInstaller: !installee && !!deferredPrompt,
    afficherInstructionsIos: !installee && estIos() && !deferredPrompt,
    installer,
  }
}
