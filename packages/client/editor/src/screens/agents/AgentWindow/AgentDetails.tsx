// DOCUMENTED
import { CustomizedSwitch } from 'client/core'
import { Button, Tooltip } from '@mui/material'
import { enqueueSnackbar } from 'notistack'
import { useCallback, useEffect, useState } from 'react'

import styles from './index.module.scss'
import { InputEdit } from './InputEdit'

import { SmallAgentAvatarCard } from './SmallAgentAvatarCard'
import { useUpdateAgentMutation } from 'client/state'
import { Button as SButton } from '@magickml/client-ui'
import { Credentials } from './AgentCredentials'

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

  const changeVersion = useCallback(
    version => {
      updateAgent({
        id: selectedAgentData.id,
        version,
      })
        .unwrap()
        .then(data => {
          setSelectedAgentData(data)
          enqueueSnackbar(`Changed agent to version ${version}`, {
            variant: 'success',
          })
        })
        .catch(e => {
          console.error(e)
          enqueueSnackbar('Error updating agent', {
            variant: 'error',
          })
        })
    },
    [selectedAgentData]
  )

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
    <div
      style={{ overflowY: 'scroll', height: '100vh', padding: '40px 100px' }}
    >
      <div className={styles.agentDetailsContainer}>
        <div className={styles.agentDescription}>
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
            <SmallAgentAvatarCard
              agent={selectedAgentData}
              setEditMode={setEditMode}
              setOldName={setOldName}
            />
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
            <span style={{ marginLeft: '20px' }}>
              <CustomizedSwitch
                label={selectedAgentData.enabled ? 'On' : 'Off'}
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
            </span>
          </Tooltip>
          <SButton
            className="text-white"
            onClick={() => {
              const v2 = selectedAgentData.version === '2.0'
              changeVersion(v2 ? '1.0' : '2.0')
            }}
          >
            Toggle V2
          </SButton>
        </div>

        <div className={styles.btns}>
          <Button
            onClick={() => update()}
            style={{
              margin: '1em',
              color: 'white',
              backgroundColor: 'var(--primary)',
            }}
          >
            Save changes
          </Button>
        </div>
      </div>

      <Credentials agentId={selectedAgentData.id} />
    </div>
  )
}

export default AgentDetails
