import React from 'react'
// import { NodeLock } from '@magickml/icons'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { AgentInterface } from 'server/schemas'
import {
  Avatar,
  AvatarImage,
  Checkbox,
  DropdownMenuItem,
} from '@magickml/client-ui'
import { defaultImage } from 'shared/utils'

const AgentListItem = ({
  agent,
  onSelectAgent,
  isDraft = false,
  selectedAgents,
  onCheckboxChange,
  isSinglePublishedAgent = false,
}: {
  agent: AgentInterface
  onSelectAgent: (agent: AgentInterface) => void
  isDraft?: boolean
  selectedAgents?: string[]
  onCheckboxChange?: (agentId: string, checked: boolean) => void
  isSinglePublishedAgent?: boolean
}) => {
  const formatDate = (date: string) => {
    if (!date) return ''
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  }

  const handleCheckboxClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation()
  }

  const handleCheckboxChange = (checked: boolean) => {
    if (onCheckboxChange) {
      onCheckboxChange(agent.id, checked)
    }
  }

  return (
    <DropdownMenuItem
      className="flex items-center justify-between w-full p-2 hover:bg-[#282d33] focus:bg-[#282d33] cursor-pointer transition-all"
      onClick={() => onSelectAgent(agent)}
    >
      <div className="flex items-center" onClick={handleCheckboxClick}>
        {!isDraft && !isSinglePublishedAgent && (
          <Checkbox
            id="agent-checkbox"
            checked={selectedAgents?.includes(agent.id)}
            onCheckedChange={handleCheckboxChange}
            className="mr-8 p-0"
          />
        )}
        <Avatar className="self-center border border-ds-primary w-8 h-8 justify-center items-center mr-2">
          <AvatarImage
            className="object-cover w-full h-full rounded-full"
            src={
              agent?.image
                ? `${process.env.NEXT_PUBLIC_BUCKET_PREFIX}/${agent?.image}`
                : defaultImage(agent?.id || '1')
            }
            alt={agent.name.at(0) || 'A'}
          />
        </Avatar>
        <div
          className={`flex flex-col ml-1 truncate ${
            isDraft ? 'max-w-[220px]' : 'max-w-[180px]'
          }`}
        >
          <div className="text-white font-medium">{agent.name}</div>
          <div className="text-[#b5b9bc] text-xs">
            Updated{' '}
            {formatDate(
              (agent.updatedAt as string) || (agent.createdAt as string)
            )}
          </div>
        </div>
      </div>

      {!isDraft && (
        <div className="mr-2">
          {/* <NodeLock color="#b5b9bc" /> */}
          <p style={{ color: 'red' }}>LOCKED</p>
        </div>
      )}
    </DropdownMenuItem>
  )
}

export default AgentListItem
