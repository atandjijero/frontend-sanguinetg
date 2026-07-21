import { useEffect, useRef, useState } from 'react'
import type { Socket } from 'socket.io-client'
import { SendIcon, StethoscopeIcon, XIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui-shadcn/ui/card'
import { Button } from '../../../components/ui-shadcn/ui/button'
import { Input } from '../../../components/ui-shadcn/ui/input'
import { DataState } from '../../../components/dashboard/DataState'
import { MessageBubble } from '../../../components/messagerie/MessageBubble'
import { TypingIndicator } from '../../../components/messagerie/TypingIndicator'
import { EmojiPicker } from '../../../components/messagerie/EmojiPicker'
import { VoiceRecorder } from '../../../components/messagerie/VoiceRecorder'
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

interface FrappeEvent {
  conversationId: string
  donneurId: string
  auteurRole: string
  enTrainDecrire: boolean
  type: 'texte' | 'vocal'
}

const DELAI_ARRET_FRAPPE_MS = 2500
const DELAI_FILET_SECURITE_MS = 4000

export default function MessagerieDonneurPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [contenu, setContenu] = useState('')
  const [messageEnEdition, setMessageEnEdition] = useState<ChatMessage | null>(null)
  const [connecte, setConnecte] = useState(false)
  const [activiteMedecin, setActiviteMedecin] = useState<'texte' | 'vocal' | null>(null)
  const [enregistrementActif, setEnregistrementActif] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const finDuFilRef = useRef<HTMLDivElement>(null)
  const arretFrappeRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const filetSecuriteRef = useRef<ReturnType<typeof setTimeout> | null>(null)
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
    socket.on('frappe', (event: FrappeEvent) => {
      setActiviteMedecin(event.enTrainDecrire ? event.type : null)
      if (filetSecuriteRef.current) clearTimeout(filetSecuriteRef.current)
      if (event.enTrainDecrire) {
        filetSecuriteRef.current = setTimeout(() => setActiviteMedecin(null), DELAI_FILET_SECURITE_MS)
      }
    })

    return () => {
      annule = true
      socket.disconnect()
      if (arretFrappeRef.current) clearTimeout(arretFrappeRef.current)
      if (filetSecuriteRef.current) clearTimeout(filetSecuriteRef.current)
    }
  }, [])

  useEffect(() => {
    finDuFilRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleInputChange(valeur: string) {
    setContenu(valeur)
    if (!socketRef.current) return

    socketRef.current.emit('typing_start', {})
    if (arretFrappeRef.current) clearTimeout(arretFrappeRef.current)
    arretFrappeRef.current = setTimeout(() => {
      socketRef.current?.emit('typing_stop', {})
    }, DELAI_ARRET_FRAPPE_MS)
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const texte = contenu.trim()
    if (!texte || !socketRef.current) return

    if (arretFrappeRef.current) clearTimeout(arretFrappeRef.current)
    socketRef.current.emit('typing_stop', {})

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

  function handleRecordingChange(enregistrement: boolean) {
    socketRef.current?.emit(enregistrement ? 'typing_start' : 'typing_stop', { type: 'vocal' })
  }

  async function handleEnvoyerVocal(blob: Blob, dureeSecondes: number) {
    try {
      const formData = new FormData()
      formData.append('file', blob, 'message-vocal.webm')
      formData.append('dureeSecondes', String(dureeSecondes))
      await api.upload('/messagerie/messages/vocal', formData)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Impossible d'envoyer le message vocal")
    }
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
        {activiteMedecin && (
          <TypingIndicator
            label={activiteMedecin === 'vocal' ? 'Un médecin enregistre un message vocal…' : "Un médecin est en train d'écrire…"}
            vocal={activiteMedecin === 'vocal'}
          />
        )}
        {messageEnEdition && (
          <div className="mt-3 flex items-center justify-between rounded-md bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground">
            <T>Modification du message…</T>
            <button type="button" onClick={handleCancelEdit} className="rounded p-0.5 hover:bg-muted">
              <XIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-2 border-t border-border pt-3">
          {!enregistrementActif && (
            <>
              <EmojiPicker onSelect={(emoji) => handleInputChange(contenu + emoji)} />
              <Input
                value={contenu}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={placeholder}
                maxLength={2000}
                disabled={!connecte}
              />
            </>
          )}
          <VoiceRecorder
            onSend={handleEnvoyerVocal}
            onActifChange={setEnregistrementActif}
            onRecordingChange={handleRecordingChange}
            disabled={!connecte}
          />
          {!enregistrementActif && (
            <Button type="submit" disabled={!connecte || !contenu.trim()}>
              <SendIcon className="h-4 w-4" />
            </Button>
          )}
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
