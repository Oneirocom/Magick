import { Tooltip } from '@mui/material'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { InputEdit } from './InputEdit'
import { useUpdateAgentMutation } from 'client/state'
import { Credentials } from './AgentCredentials'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Label,
} from '@magickml/client-ui'
import { CustomizedSwitch } from 'client/core'
interface AgentDetailsProps {
  selectedAgentData: any
  setSelectedAgentData?: any
}

/**
 * AgentDetails component displays agent details and provides functionalities to interact with agents.
 *
 * @param selectedAgentData - The data of the selected agent.
 * @param setSelectedA gentData - Function to update the selected agent data.
 * @param updateCallback - Callback function to update data.
 * @param onLoadEnables - The boolean value to show enabled components on load.
 */
const AgentDetails = ({
  selectedAgentData,
  setSelectedAgentData,
}: AgentDetailsProps) => {
  const [updateAgent] = useUpdateAgentMutation()
  const [editMode, setEditMode] = useState<boolean>(false)
  const [oldName, setOldName] = useState<string>('')
  const [v2, setV2] = useState(selectedAgentData.version === '2.0')

  const isDraft = selectedAgentData?.currentSpellReleaseId === null || false

  useEffect(() => {
    if (!selectedAgentData) return
    if (v2 === null) {
      setV2(selectedAgentData.version === '2.0')
      return
    }

    setV2(selectedAgentData.version === '2.0')
  }, [selectedAgentData.version])

  /**
   * update agent data by agent id.
   *
   * @param id - Agent id to update.
   * @param data - Data to update.
   */
  const update = (data = {}) => {
    const _data = { ...selectedAgentData, ...data }
    // Avoid server-side validation error
    _data.enabled = _data.enabled ? true : false
    _data.updatedAt = new Date().toISOString()
    _data.secrets = _data.secrets ? _data.secrets : '{}'
    _data.pingedAt = new Date().toISOString()

    updateAgent(_data)
      .unwrap()
      .then(data => {
        enqueueSnackbar('Updated agent', {
          variant: 'success',
        })
        setSelectedAgentData(data)
      })
      .catch(e => {
        console.error(e)
        enqueueSnackbar('Error updating agent', {
          variant: 'error',
        })
      })
  }

  if (!selectedAgentData) return null

  return (
    <div className="h-dvh pb-20 overflow-y-scroll py-10 px-24">
      {/* Top Section */}
      <div className="inline-flex w-full justify-between items-center">
        <div className="inline-flex gap-x-2 items-center">
          {editMode ? (
            <InputEdit
              selectedAgentData={selectedAgentData}
              setSelectedAgentData={setSelectedAgentData}
              update={() => update()}
              setEditMode={setEditMode}
              setOldName={setOldName}
              oldName={oldName}
            />
          ) : (
            <Avatar>
              <AvatarImage src="" alt="@shadcn" />
              <AvatarFallback>{selectedAgentData?.name[0]}</AvatarFallback>
            </Avatar>
          )}

          <Tooltip
            title={
              isDraft
                ? 'Disabling your draft agent will disable your environment. Proceed with caution.'
                : ''
            }
            placement="right-start"
            disableInteractive
            arrow
          >
            <div className="flex items-center space-x-2 ml-5">
              <CustomizedSwitch
                label={selectedAgentData.enabled ? 'On' : 'Off'}
                id="agent-enabled"
                checked={selectedAgentData.enabled ? true : false}
                onChange={() => {
                  update({
                    enabled: selectedAgentData.enabled ? false : true,
                  })
                }}
                style={{
                  alignSelf: 'self-start',
                }}
              />
              <Label htmlFor="agent-enabled">Enabled</Label>
            </div>
          </Tooltip>
        </div>

        <Button onClick={() => update()} variant="portal-primary">
          Save changes
        </Button>
      </div>

      <Credentials agentId={selectedAgentData.id} />
    </div>
  )
}

export default AgentDetails
