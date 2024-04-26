import { cn } from '@magickml/client-ui'
import { useMarkdownProcessor } from './use-markdown-processor'

export type ChatMessage = {
  sender: string
  message: string
  entity: string
}

interface Props {
  message: ChatMessage
  agentAvatar?: string
}

export const ChatMessageBlob = ({ message, agentAvatar }: Props) => {
  const content = useMarkdownProcessor(message.message) as JSX.Element

  return (
    <div className="flex flex-row items-start mb-4">
      {message.entity === 'agent' && (
        <div className="avatar">
          <div className="w-8 rounded-full">
            <img src={agentAvatar} alt="agent" width={72} height={72} />
          </div>
        </div>
      )}

      <div
        className={cn(
          message.entity === 'user' ? 'bg-ds-card' : '',
          'relative flex flex-col rounded-[5px] rounded-tl-none rounded-br-none px-4 py-2 text-left color-transition gap-3'
        )}
      >
        {content}
      </div>
    </div>
  )
}
