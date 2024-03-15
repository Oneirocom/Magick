import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  FancyInput,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@magickml/client-ui'
import { useState } from 'react'
import { EditIcon } from './edit-icon'
import { defaultImage } from 'shared/utils'
import { CheckIcon, Cross1Icon } from '@radix-ui/react-icons'

interface AgentInfoProps {
  selectedAgentData: any
  setSelectedAgentData?: (data: any) => void
  update: (data?: any) => void
}

export const ConfigHeader = ({
  selectedAgentData,
  setSelectedAgentData,
  update,
}: AgentInfoProps) => {
  const [editName, setEditName] = useState(false)
  const isDraft = selectedAgentData?.currentSpellReleaseId === null || false

  return (
    <div className="inline-flex w-full justify-start items-center gap-x-2 h-16">
      <Avatar className='ring-1 ring-ds-primary'>
        <AvatarImage src={defaultImage(selectedAgentData.id)} />
        <AvatarFallback>{selectedAgentData?.name[0]}</AvatarFallback>
      </Avatar>

      {editName ? (
        <>
          <FancyInput
            type="text"
            className="max-w-xs w-full border-ds-neutral"
            value={selectedAgentData.name}
            onChange={e =>
              setSelectedAgentData &&
              setSelectedAgentData({
                ...selectedAgentData,
                name: e.target.value,
              })
            }
            placeholder="Add new agent name here"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                update()
                setEditName(false)
              }
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              update()
              setEditName(false)
            }}
          >
            <CheckIcon className='text-green-500' />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setEditName(false)
            }}
          >
            <Cross1Icon className='text-ds-error' />
          </Button>
        </>
      ) : (
        <>
          <p className="font-medium capitalize">{selectedAgentData.name}</p>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setEditName(true)
            }}
          >
            <EditIcon />
          </Button>
        </>
      )}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <>
              <Switch
                className="m-0"
                checked={selectedAgentData.enabled}
                onCheckedChange={() => {
                  update({
                    enabled: !selectedAgentData.enabled,
                  })
                }}
              />
              <span>{selectedAgentData.enabled ? 'On' : 'Off'}</span>
            </>
          </TooltipTrigger>
          <TooltipContent>
            {isDraft && (
              <p>
                Disabling your draft agent will disable your environment.
                Proceed with caution.
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
