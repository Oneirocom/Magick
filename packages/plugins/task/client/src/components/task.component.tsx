// DOCUMENTED
import { Switch } from 'client/core'
import { debounce } from 'lodash'
import { FC, useEffect, useState } from 'react'
import { Tooltip } from '@mui/material'

/**
 * PluginProps type
 */
type PluginProps = {
  selectedAgentData: any
  props: {
    selectedAgentData: any
    setSelectedAgentData: any
    enable: boolean
    update: (id: string, data: object) => void
  }
}

/**
 * AgentTaskWindow component
 * @param props - PluginProps
 */
export const AgentTaskWindow: FC<PluginProps> = props => {
  const { selectedAgentData, setSelectedAgentData, update, enable } =
    props.props

  // Initialize the state variables
  const debouncedFunction = debounce((id, data) => update(id, data), 500)
  const [checked, setChecked] = useState(selectedAgentData.data?.task_enabled)
  const [disable, setDisable] = useState(false)

  // Handle enable/disable of the task plugin
  useEffect(() => {
    if (enable['TaskPlugin'] === false) {
      setChecked(false)
      setDisable(true)
    }
    if (enable['TaskPlugin'] === true) {
      setChecked(selectedAgentData.data?.task_enabled)
      setDisable(false)
    }
  }, [enable, selectedAgentData])

  // Render the component
  return (
    <>
      <div className='connector-layout'>
        <Tooltip title="Enable/Disable Task Plugin" placement="left" disableInteractive arrow>
          <h3>Agent Task Runner</h3>
        </Tooltip>
        <div className='controls'>
          <Switch
            checked={checked}
            onChange={e => {
              setChecked(!checked)
              debouncedFunction(selectedAgentData.id, {
                ...selectedAgentData,
                data: {
                  ...selectedAgentData.data,
                  task_enabled: e.target.checked,
                },
              })

              setSelectedAgentData({
                ...selectedAgentData,
                data: {
                  ...selectedAgentData.data,
                  task_enabled: e.target.checked,
                },
              })
            }}
            label={''}
          />
        </div>
      </div>
    </>
  )
}
