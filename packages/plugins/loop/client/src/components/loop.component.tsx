// DOCUMENTED
import React, { FC, useEffect, useState } from 'react'
import { debounce } from 'lodash'
import { Modal, Switch } from 'client/core'
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
 * AgentLoopWindow component
 * @param props - PluginProps
 */
export const AgentLoopWindow: FC<PluginProps> = props => {
  const { selectedAgentData, setSelectedAgentData, update, enable } =
    props.props

  // Initialize the state variables
  const debouncedFunction = debounce((id, data) => update(id, data), 500)
  const [editMode, setEditMode] = useState<boolean>(false)
  const [checked, setChecked] = useState(selectedAgentData.data?.loop_enabled)
  const [disable, setDisable] = useState(false)
  const [state, setState] = useState({
    loop_interval: selectedAgentData?.data?.loop_interval,
  })

  const handleClose = () => {
    setEditMode(false)
  }

  // Handle enable/disable of the loop plugin
  useEffect(() => {
    if (enable['LoopPlugin'] === false) {
      setChecked(false)
      setDisable(true)
    }
    if (enable['LoopPlugin'] === true) {
      setChecked(selectedAgentData.data?.loop_enabled)
      setDisable(false)
    }
  }, [enable, selectedAgentData])

  /**
   * Handle input changes
   * @param e - input change event
   */
  const handleOnChange = e => {
    const { name, value } = e.target
    setState({ ...state, [name]: value })
  }

  /**
   * Save the updated data
   */
  const handleSave = () => {
    const data = {
      ...selectedAgentData,
      data: {
        ...selectedAgentData.data,
        ...state,
      },
    }

    update(selectedAgentData.id, data)
  }

  // Render the component
  return (
    <>
      <div className='connector-layout'>
        <Tooltip title="Add your loop settings" placement="left" disableInteractive arrow>
          <h3>Agent Update Loop</h3>
        </Tooltip>
        <div className='controls'>
          <button
            onClick={() => {
              setEditMode(true)
            }}
            style={{ marginRight: '10px', cursor: 'pointer' }}
          >
            Configure
          </button>
          <Switch
            checked={checked}
            onChange={e => {
              setChecked(!checked)
              debouncedFunction(selectedAgentData.id, {
                ...selectedAgentData,
                data: {
                  ...selectedAgentData.data,
                  loop_enabled: e.target.checked,
                },
              })

              setSelectedAgentData({
                ...selectedAgentData,
                data: {
                  ...selectedAgentData.data,
                  loop_enabled: e.target.checked,
                },
              })
            }}
            label={''}
          />
        </div>
      </div>
      {editMode && (
        <Modal open={editMode} onClose={handleClose} handleAction={handleSave}>
          <div>
            <div>
              <Tooltip title="add number of seconds to run the loop" placement="bottom" disableInteractive arrow>
                <span className="form-item-label">Loop Interval</span>
              </Tooltip>
              <input
                type="text"
                pattern="[0-9]*"
                style={{ width: '100%' }}
                name="loop_interval"
                defaultValue={selectedAgentData.data?.loop_interval}
                placeholder="Run every X seconds"
                onChange={handleOnChange}
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
