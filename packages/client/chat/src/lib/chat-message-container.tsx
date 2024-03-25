import { Ref, useEffect } from 'react'
import { ChatMessageBlob, type ChatMessage } from './chat-message'
import { cn } from '@magickml/client-ui'

type ChatMessageContainerProps = {
  reff: Ref<HTMLDivElement>
  messages: ChatMessage[]
  agentAvatar?: string
}

export const ChatMessageContainer = ({
  reff,
  messages,
  agentAvatar,
}: ChatMessageContainerProps) => {
  useEffect(() => {
    const scrollDown = () => {
      if (reff && typeof reff === 'object' && reff.current) {
        reff.current.scrollTop = reff.current.scrollHeight
      }
    }

    if (reff && typeof reff === 'object' && reff.current) {
      reff.current.addEventListener('DOMNodeInserted', scrollDown)
    }

    return () => {
      if (reff && typeof reff === 'object' && reff.current) {
        reff.current.removeEventListener('DOMNodeInserted', scrollDown)
      }
    }
  }, [reff])

  return (
    <div
      className={cn(
        messages.length > 0 ? 'overflow-auto' : 'overflow-hidden',
        'flex flex-col flex-grow h-0 w-full px-8 my-4'
      )}
    >
      <div ref={reff} className="pb-2 grow">
        {messages.map((message, index) => (
          <ChatMessageBlob
            message={message}
            key={index}
            agentAvatar={agentAvatar}
          />
        ))}
      </div>
    </div>
  )
}
