import { useState } from 'react'
import { MailIcon, ReplyIcon } from 'lucide-react'
import { Button } from '../../../components/ui-shadcn/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui-shadcn/ui/card'
import { Badge } from '../../../components/ui-shadcn/ui/badge'
import { DataState } from '../../../components/dashboard/DataState'
import { PaginationControls } from '../../../components/dashboard/PaginationControls'
import { useApiData } from '../../../hooks/useApiData'
import { useClientPagination } from '../../../hooks/useClientPagination'
import { useAuth } from '../../../context/AuthContext'
import { api, ApiError } from '../../../lib/api'
import type { MessageContact } from '../../../lib/types'

export default function MessagesPage() {
  const { user } = useAuth()
  const peutRepondre = user?.role === 'ADMIN' || user?.role === 'AGENT_CNTS'

  const { data: messages, isLoading, error, refetch } = useApiData<MessageContact[]>('/contact')
  const { page, setPage, totalPages, pageItems, total } = useClientPagination(messages ?? [], 6)
  const [replyId, setReplyId] = useState<string | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MailIcon className="h-4 w-4" /> Messages reçus ({total})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DataState isLoading={isLoading} error={error} isEmpty={!messages?.length} emptyLabel="Aucun message reçu pour le moment.">
          <div className="space-y-4">
            {pageItems.map((msg) =>
              replyId === msg.id ? (
                <ReplyForm
                  key={msg.id}
                  message={msg}
                  onSaved={async () => {
                    setReplyId(null)
                    await refetch()
                  }}
                  onCancel={() => setReplyId(null)}
                />
              ) : (
                <div key={msg.id} className="rounded-lg border border-border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium">{msg.sujet}</h3>
                      <p className="text-sm text-muted-foreground">
                        {msg.nomComplet} · {msg.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={msg.statut === 'REPONDU' ? 'secondary' : 'default'}>
                        {msg.statut === 'REPONDU' ? 'Répondu' : 'Nouveau'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.dateCreation).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm whitespace-pre-wrap">{msg.message}</p>

                  {msg.reponse && (
                    <div className="mt-3 rounded-md bg-muted/30 p-3">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Réponse{msg.repondPar ? ` de ${msg.repondPar.prenom} ${msg.repondPar.nom}` : ''}
                        {msg.dateReponse ? ` · ${new Date(msg.dateReponse).toLocaleDateString('fr-FR')}` : ''}
                      </p>
                      <p className="text-sm whitespace-pre-wrap">{msg.reponse}</p>
                    </div>
                  )}

                  {peutRepondre && (
                    <div className="mt-3">
                      <Button variant="outline" size="sm" onClick={() => setReplyId(msg.id)}>
                        <ReplyIcon className="h-4 w-4" /> {msg.statut === 'REPONDU' ? 'Modifier la réponse' : 'Répondre'}
                      </Button>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
          <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} total={total} label="messages" />
        </DataState>
      </CardContent>
    </Card>
  )
}

function ReplyForm({
  message,
  onSaved,
  onCancel,
}: {
  message: MessageContact
  onSaved: () => void | Promise<void>
  onCancel: () => void
}) {
  const [reponse, setReponse] = useState(message.reponse ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!reponse.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const resultat = await api.patch<{ emailEnvoye: boolean }>(`/contact/${message.id}/reponse`, { reponse })
      if (!resultat.emailEnvoye) {
        setError("Réponse enregistrée, mais l'email n'a pas pu être envoyé (SMTP non configuré ou en échec).")
        setTimeout(() => onSaved(), 1500)
        return
      }
      await onSaved()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Impossible d'enregistrer la réponse")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
      <div>
        <h3 className="font-medium">{message.sujet}</h3>
        <p className="text-sm text-muted-foreground">
          {message.nomComplet} · {message.email}
        </p>
        <p className="mt-2 text-sm whitespace-pre-wrap">{message.message}</p>
      </div>
      <textarea
        className="flex min-h-28 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        value={reponse}
        onChange={(e) => setReponse(e.target.value)}
        placeholder="Votre réponse — sera envoyée par email à l'expéditeur"
        required
        minLength={2}
      />
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={submitting}>
          Envoyer la réponse
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Annuler
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  )
}
