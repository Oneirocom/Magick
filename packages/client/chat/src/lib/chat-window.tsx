import { useEffect, useRef, useState } from 'react'
import { ChatInput } from './chat-input'
import { ChatMessageContainer } from './chat-message-container'
import { cn } from '@magickml/client-ui'
import { ChatMessage } from './chat-message'

export type ChatProps = {
  classNames?: string
  messages: ChatMessage[]
  isResponding: boolean
  onSend: (message: string) => void | Promise<void>
  agentAvatar?: string
  agentName: string | null
}

export const ChatWindow = ({
  classNames,
  messages,
  isResponding,
  onSend,
  agentAvatar,
  agentName,
}: ChatProps) => {
  const [input, setInput] = useState('')
  const messageContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isResponding) return
    if (e.key === 'Enter' && !e.shiftKey && input.length !== 0) {
      e.preventDefault()
      onSend(input)
      setInput('')
    }
    e.stopPropagation()
  }

  const handleClick = () => {
    onSend(input)
    setInput('')
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  return (
    <>
      <div
        className={cn(
          'pb-24 flex-col grow w-full h-full lg:px-0 relative overflow-hidden transition-all duration-150 ease-in-out flex',
          'lg:max-w-5xl mx-auto md:max-w-2xl',
          classNames
        )}
      >
        <ChatMessageContainer
          messages={messages}
          reff={messageContainerRef}
          agentAvatar={agentAvatar}
        />

        <div className="absolute bottom-0 left-0 right-0 w-full mx-auto md:bottom-14 lg:px-5 lg:bottom-0">
          <ChatInput
            value={input}
            handleChange={handleChange}
            handleKeyDown={handleKeyDown}
            handleClick={handleClick}
            isResponding={isResponding}
            agentName={agentName}
          />
        </div>
      </div>
    </>
  )
}
