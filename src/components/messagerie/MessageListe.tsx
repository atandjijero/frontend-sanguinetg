import type { RefObject } from 'react'
import { MessageBubble } from './MessageBubble'
import { DateSeparator } from './DateSeparator'
import { formatSeparateurDateMessage } from '../../lib/date-format'
import type { ChatMessage } from '../../lib/types'

export function MessageListe({
  messages,
  currentUserId,
  onEdit,
  onDelete,
  finDuFilRef,
}: {
  messages: ChatMessage[]
  currentUserId: string | undefined
  onEdit: (message: ChatMessage) => void
  onDelete: (message: ChatMessage) => void
  finDuFilRef: RefObject<HTMLDivElement | null>
}) {
  let dernierJour: string | null = null

  return (
    <>
      {messages.map((message) => {
        const dateMessage = new Date(message.dateEnvoi)
        const cleJour = dateMessage.toDateString()
        const afficherSeparateur = cleJour !== dernierJour
        dernierJour = cleJour

        return (
          <div key={message.id}>
            {afficherSeparateur && <DateSeparator label={formatSeparateurDateMessage(dateMessage)} />}
            <MessageBubble
              message={message}
              estMoi={message.auteurId === currentUserId}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        )
      })}
      <div ref={finDuFilRef} />
    </>
  )
}
