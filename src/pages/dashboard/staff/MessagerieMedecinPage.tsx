import { useEffect, useRef, useState } from 'react'
import type { Socket } from 'socket.io-client'
import { MessageCircleIcon, SendIcon, XIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui-shadcn/ui/card'
import { Badge } from '../../../components/ui-shadcn/ui/badge'
import { Button } from '../../../components/ui-shadcn/ui/button'
import { Input } from '../../../components/ui-shadcn/ui/input'
import { DataState } from '../../../components/dashboard/DataState'
import { MessageBubble } from '../../../components/messagerie/MessageBubble'
import { TypingIndicator } from '../../../components/messagerie/TypingIndicator'
import { useApiData } from '../../../hooks/useApiData'
import { useAuth } from '../../../context/AuthContext'
import { T, useTraduction } from '../../../context/LanguageContext'
import { toast } from 'sonner'
import { GROUPE_SANGUIN_LABELS } from '../../../lib/constants'
import { connecterMessagerie } from '../../../lib/socket'
import { cn } from '@/lib/shadcn-utils'
import type { ChatMessage, ConversationAvecMessages, ConversationResume } from '../../../lib/types'

interface AckReponse {
  success: boolean
  message?: ChatMessage
  error?: string
}

interface FrappeEvent {
  conversationId: string
  donneurId: string
  auteurRole: string
  enTrainDecrire: boolean
}

const DELAI_ARRET_FRAPPE_MS = 2500
const DELAI_FILET_SECURITE_MS = 4000

export default function MessagerieMedecinPage() {
  const { user } = useAuth()
  const peutRepondre = user?.role === 'MEDECIN'

  const { data: conversations, refetch: refetchConversations } = useApiData<ConversationResume[]>(
    '/messagerie/conversations',
  )
  const [selectionId, setSelectionId] = useState<string | null>(null)
  const {
    data: fil,
    isLoading: chargementFil,
    error: erreurFil,
  } = useApiData<ConversationAvecMessages>(selectionId ? `/messagerie/conversations/${selectionId}` : null, [
    selectionId,
  ])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [contenu, setContenu] = useState('')
  const [messageEnEdition, setMessageEnEdition] = useState<ChatMessage | null>(null)
  const [connecte, setConnecte] = useState(false)
  const [conversationsQuiEcrivent, setConversationsQuiEcrivent] = useState<Set<string>>(new Set())
  const socketRef = useRef<Socket | null>(null)
  const finDuFilRef = useRef<HTMLDivElement>(null)
  const arretFrappeRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const filetsSecuriteRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const placeholder = useTraduction('Répondre au donneur…')

  // Lue par le handler socket ci-dessous sans recréer la connexion à chaque sélection de conversation.
  const selectionIdRef = useRef<string | null>(null)
  useEffect(() => {
    selectionIdRef.current = selectionId
  }, [selectionId])

  useEffect(() => {
    setMessages(fil?.messages ?? [])
    setMessageEnEdition(null)
  }, [fil])

  useEffect(() => {
    const socket = connecterMessagerie()
    socketRef.current = socket
    socket.on('connect', () => setConnecte(true))
    socket.on('disconnect', () => setConnecte(false))
    socket.on('nouveau_message', (message: ChatMessage) => {
      refetchConversations()
      setMessages((prev) => {
        if (message.conversationId !== selectionIdRef.current) return prev
        if (prev.some((m) => m.id === message.id)) return prev
        return [...prev, message]
      })
    })
    socket.on('message_mis_a_jour', (message: ChatMessage) => {
      refetchConversations()
      setMessages((prev) => (message.conversationId === selectionIdRef.current ? prev.map((m) => (m.id === message.id ? message : m)) : prev))
    })
    socket.on('frappe', (event: FrappeEvent) => {
      if (event.auteurRole !== 'DONNEUR') return

      const timers = filetsSecuriteRef.current
      const existant = timers.get(event.conversationId)
      if (existant) clearTimeout(existant)

      setConversationsQuiEcrivent((prev) => {
        const next = new Set(prev)
        if (event.enTrainDecrire) next.add(event.conversationId)
        else next.delete(event.conversationId)
        return next
      })

      if (event.enTrainDecrire) {
        timers.set(
          event.conversationId,
          setTimeout(() => {
            setConversationsQuiEcrivent((prev) => {
              const next = new Set(prev)
              next.delete(event.conversationId)
              return next
            })
          }, DELAI_FILET_SECURITE_MS),
        )
      }
    })

    return () => {
      socket.disconnect()
      if (arretFrappeRef.current) clearTimeout(arretFrappeRef.current)
      filetsSecuriteRef.current.forEach((timer) => clearTimeout(timer))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    finDuFilRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleInputChange(valeur: string) {
    setContenu(valeur)
    if (!socketRef.current || !selectionId) return

    socketRef.current.emit('typing_start', { conversationId: selectionId })
    if (arretFrappeRef.current) clearTimeout(arretFrappeRef.current)
    arretFrappeRef.current = setTimeout(() => {
      socketRef.current?.emit('typing_stop', { conversationId: selectionId })
    }, DELAI_ARRET_FRAPPE_MS)
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const texte = contenu.trim()
    if (!texte || !socketRef.current || !selectionId) return

    if (arretFrappeRef.current) clearTimeout(arretFrappeRef.current)
    socketRef.current.emit('typing_stop', { conversationId: selectionId })

    if (messageEnEdition) {
      socketRef.current.emit(
        'modifier_message',
        { messageId: messageEnEdition.id, contenu: texte },
        (reponse: AckReponse) => {
          if (!reponse.success) toast.error(reponse.error ?? 'Modification impossible')
        },
      )
      setMessageEnEdition(null)
    } else {
      socketRef.current.emit('envoyer_message', { contenu: texte, conversationId: selectionId })
    }
    setContenu('')
  }

  function handleEdit(message: ChatMessage) {
    setMessageEnEdition(message)
    setContenu(message.contenu)
  }

  function handleCancelEdit() {
    setMessageEnEdition(null)
    setContenu('')
  }

  function handleDelete(message: ChatMessage) {
    socketRef.current?.emit('supprimer_message', { messageId: message.id }, (reponse: AckReponse) => {
      if (!reponse.success) toast.error(reponse.error ?? 'Suppression impossible')
    })
  }

  return (
    <div className="grid h-[75vh] gap-5 lg:grid-cols-3">
      <Card className="flex flex-col overflow-hidden lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircleIcon className="h-4 w-4" /> <T>Conversations</T>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 space-y-2 overflow-y-auto">
          <DataState isLoading={!conversations} error={null} isEmpty={conversations?.length === 0} emptyLabel="Aucune conversation pour le moment.">
            {conversations?.map((conv) => (
              <button
                key={conv.id}
                type="button"
                onClick={() => setSelectionId(conv.id)}
                className={cn(
                  'w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted/50',
                  selectionId === conv.id ? 'border-primary bg-primary/5' : 'border-border',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">
                    {conv.donneur.prenom} {conv.donneur.nom}
                  </span>
                  {conv.messagesNonLus > 0 && <Badge>{conv.messagesNonLus}</Badge>}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  {conv.donneur.groupeSanguin && (
                    <Badge variant="outline" className="text-[10px]">
                      {GROUPE_SANGUIN_LABELS[conv.donneur.groupeSanguin]}
                    </Badge>
                  )}
                  {conversationsQuiEcrivent.has(conv.id) ? (
                    <span className="truncate text-xs italic text-primary">
                      <T>en train d'écrire…</T>
                    </span>
                  ) : (
                    <span className="truncate text-xs text-muted-foreground">
                      {conv.dernierMessage?.contenu ?? '—'}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </DataState>
        </CardContent>
      </Card>

      <Card className="flex flex-col overflow-hidden lg:col-span-2">
        <CardContent className="flex flex-1 flex-col overflow-hidden pt-5">
          {!selectionId ? (
            <p className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              <T>Sélectionnez une conversation pour l'ouvrir.</T>
            </p>
          ) : (
            <>
              <DataState isLoading={chargementFil} error={erreurFil}>
                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      estMoi={message.auteurId === user?.id}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                  <div ref={finDuFilRef} />
                </div>
              </DataState>
              {conversationsQuiEcrivent.has(selectionId) && (
                <TypingIndicator label="Le donneur est en train d'écrire…" />
              )}
              {peutRepondre ? (
                <>
                  {messageEnEdition && (
                    <div className="mt-3 flex items-center justify-between rounded-md bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground">
                      <T>Modification du message…</T>
                      <button type="button" onClick={handleCancelEdit} className="rounded p-0.5 hover:bg-muted">
                        <XIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                    <Input
                      value={contenu}
                      onChange={(e) => handleInputChange(e.target.value)}
                      placeholder={placeholder}
                      maxLength={2000}
                      disabled={!connecte}
                    />
                    <Button type="submit" disabled={!connecte || !contenu.trim()}>
                      <SendIcon className="h-4 w-4" />
                    </Button>
                  </form>
                </>
              ) : (
                <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                  <T>Seul un médecin peut répondre dans la messagerie ; vous êtes en lecture seule.</T>
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
