import { useState } from 'react'
import type { FormEvent } from 'react'
import { KeyRoundIcon } from 'lucide-react'
import { Button } from '../ui-shadcn/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui-shadcn/ui/dialog'
import { Input } from '../ui-shadcn/ui/input'
import { Label } from '../ui-shadcn/ui/label'
import { api, ApiError } from '../../lib/api'
import { T } from '../../context/LanguageContext'

export function ChangePasswordDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [ancienMotDePasse, setAncienMotDePasse] = useState('')
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('')
  const [confirmationNouveauMotDePasse, setConfirmationNouveauMotDePasse] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function reinitialiser() {
    setAncienMotDePasse('')
    setNouveauMotDePasse('')
    setConfirmationNouveauMotDePasse('')
    setError(null)
  }

  function fermer(next: boolean) {
    if (!next) reinitialiser()
    onOpenChange(next)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await api.patch('/users/me/password', { ancienMotDePasse, nouveauMotDePasse, confirmationNouveauMotDePasse })
      fermer(false)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Impossible de changer le mot de passe')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={fermer}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            <T>Changer le mot de passe</T>
          </DialogTitle>
          <DialogDescription>
            <T>Choisissez un nouveau mot de passe pour votre compte.</T>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>
              <T>Mot de passe actuel</T>
            </Label>
            <Input
              type="password"
              required
              value={ancienMotDePasse}
              onChange={(e) => setAncienMotDePasse(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              <T>Nouveau mot de passe</T>
            </Label>
            <Input
              type="password"
              required
              minLength={8}
              value={nouveauMotDePasse}
              onChange={(e) => setNouveauMotDePasse(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              <T>Confirmer le nouveau mot de passe</T>
            </Label>
            <Input
              type="password"
              required
              value={confirmationNouveauMotDePasse}
              onChange={(e) => setConfirmationNouveauMotDePasse(e.target.value)}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">
              <T>{error}</T>
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => fermer(false)}>
              <T>Annuler</T>
            </Button>
            <Button type="submit" disabled={submitting}>
              <KeyRoundIcon className="h-4 w-4" /> <T>Enregistrer</T>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
