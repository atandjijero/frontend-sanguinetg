import { createContext, useCallback, useContext, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Button } from '../components/ui-shadcn/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui-shadcn/ui/dialog'
import { T } from './LanguageContext'

interface ConfirmOptions {
  title?: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  /** Action destructrice (ex. suppression) : bouton de confirmation en rouge. Par défaut true. */
  destructive?: boolean
}

type ConfirmFn = (options: ConfirmOptions | string) => Promise<boolean>

const ConfirmContext = createContext<ConfirmFn | null>(null)

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const resolveRef = useRef<((value: boolean) => void) | null>(null)

  const confirm = useCallback<ConfirmFn>((opts) => {
    const normalise = typeof opts === 'string' ? { description: opts } : opts
    setOptions(normalise)
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve
    })
  }, [])

  function repondre(value: boolean) {
    setOptions(null)
    resolveRef.current?.(value)
    resolveRef.current = null
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog open={!!options} onOpenChange={(open) => !open && repondre(false)}>
        <DialogContent className="max-w-sm">
          {options && (
            <>
              <DialogHeader>
                <DialogTitle>{options.title ? <T>{options.title}</T> : <T>Confirmation</T>}</DialogTitle>
                <DialogDescription>
                  <T>{options.description}</T>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => repondre(false)}>
                  {options.cancelLabel ? <T>{options.cancelLabel}</T> : <T>Annuler</T>}
                </Button>
                <Button variant={options.destructive === false ? 'default' : 'destructive'} onClick={() => repondre(true)}>
                  {options.confirmLabel ? <T>{options.confirmLabel}</T> : <T>Confirmer</T>}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) {
    throw new Error('useConfirm doit être utilisé à l’intérieur de ConfirmProvider')
  }
  return ctx
}
