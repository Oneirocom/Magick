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
import { defaultImage } from '@magickml/utils'
import { CheckIcon, Cross1Icon } from '@radix-ui/react-icons'
import { useUpdateAgentMutation } from 'client/state'

interface ConfigHeaderProps {
  selectedAgentData: any
  setSelectedAgentData?: (data: any) => void
}

/**
 * ConfigHeader component displays and allows editing of an agent's configuration.
 * @param {Object} props - Component props
 * @param {Object} props.selectedAgentData - The selected agent's data
 * @param {Function} [props.setSelectedAgentData] - Function to update the selected agent's data
 */
export const ConfigHeader = ({
  selectedAgentData,
  setSelectedAgentData,
}: ConfigHeaderProps) => {
  const [updateAgent] = useUpdateAgentMutation()
  const [editName, setEditName] = useState(false)
  const isDraft = selectedAgentData?.currentSpellReleaseId === null || false

  /**
   * Updates the agent's data on the server.
   * @param {Object} [data={}] - The data to update
   */
  const update = (data = {}) => {
    const _data = { ...selectedAgentData, ...data }
    _data.enabled = !!_data.enabled
    _data.updatedAt = new Date().toISOString()
    // _data.secrets = _data.secrets || '{}' // TODO: Deprecated
    // _data.pingedAt = new Date().toISOString() // TODO: Deprecated

    updateAgent(_data)
      .unwrap()
      .then(data => {
        setSelectedAgentData && setSelectedAgentData(data)
      })
      .catch(console.error)
  }

  if (!selectedAgentData) return null

  return (
    <div className="inline-flex w-full justify-start items-center gap-x-2">
      <Avatar className="ring-1 ring-ds-primary">
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
            <CheckIcon className="text-green-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setEditName(false)
            }}
          >
            <Cross1Icon className="text-ds-error" />
          </Button>
        </>
      ) : (
        <>
          <p className="ml-2 font-medium capitalize">
            {selectedAgentData.name}
          </p>
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
              <span className="text-sm font-medium text-white/60">
                {selectedAgentData.enabled ? 'On' : 'Off'}
              </span>
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
