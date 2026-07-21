import { useEffect, useRef, useState } from 'react'
import type { Socket } from 'socket.io-client'
import { SendIcon, StethoscopeIcon, XIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui-shadcn/ui/card'
import { Button } from '../../../components/ui-shadcn/ui/button'
import { Input } from '../../../components/ui-shadcn/ui/input'
import { DataState } from '../../../components/dashboard/DataState'
import { MessageBubble } from '../../../components/messagerie/MessageBubble'
import { useAuth } from '../../../context/AuthContext'
import { T, useTraduction } from '../../../context/LanguageContext'
import { toast } from 'sonner'
import { api, ApiError } from '../../../lib/api'
import { connecterMessagerie } from '../../../lib/socket'
import type { ChatMessage, ConversationAvecMessages } from '../../../lib/types'

interface AckReponse {
  success: boolean
  message?: ChatMessage
  error?: string
}

export default function MessagerieDonneurPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [contenu, setContenu] = useState('')
  const [messageEnEdition, setMessageEnEdition] = useState<ChatMessage | null>(null)
  const [connecte, setConnecte] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const finDuFilRef = useRef<HTMLDivElement>(null)
  const placeholder = useTraduction('Écrivez votre message…')

  useEffect(() => {
    let annule = false

    api
      .get<ConversationAvecMessages>('/messagerie/ma-conversation')
      .then(({ messages }) => {
        if (!annule) setMessages(messages)
      })
      .catch((err) => {
        if (!annule) setError(err instanceof ApiError ? err.message : 'Impossible de charger la conversation')
      })

    const socket = connecterMessagerie()
    socketRef.current = socket
    socket.on('connect', () => setConnecte(true))
    socket.on('disconnect', () => setConnecte(false))
    socket.on('nouveau_message', (message: ChatMessage) => {
      setMessages((prev) => {
        if (!prev || prev.some((m) => m.id === message.id)) return prev ?? [message]
        return [...prev, message]
      })
    })
    socket.on('message_mis_a_jour', (message: ChatMessage) => {
      setMessages((prev) => prev?.map((m) => (m.id === message.id ? message : m)) ?? prev)
    })

    return () => {
      annule = true
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    finDuFilRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const texte = contenu.trim()
    if (!texte || !socketRef.current) return

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
      socketRef.current.emit('envoyer_message', { contenu: texte })
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
    <Card className="flex h-[75vh] flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <StethoscopeIcon className="h-4 w-4" />
          <T>Discuter avec l'équipe médicale du CNTS</T>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          <T>Posez vos questions sur les conseils santé, avant ou après un don. Un médecin du CNTS vous répondra.</T>
        </p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col overflow-hidden">
        <DataState isLoading={!messages && !error} error={error} isEmpty={false}>
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {messages?.length === 0 && (
              <p className="py-10 text-center text-sm text-muted-foreground">
                <T>Aucun message pour le moment. Posez votre première question !</T>
              </p>
            )}
            {messages?.map((message) => (
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
            onChange={(e) => setContenu(e.target.value)}
            placeholder={placeholder}
            maxLength={2000}
            disabled={!connecte}
          />
          <Button type="submit" disabled={!connecte || !contenu.trim()}>
            <SendIcon className="h-4 w-4" />
          </Button>
        </form>
        {!connecte && (
          <p className="mt-1 text-xs text-muted-foreground">
            <T>Connexion à la messagerie…</T>
          </p>
        )}
      </CardContent>
    </Card>
  )
}
