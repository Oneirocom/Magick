// GENERATED 
import React, { FC, useEffect, useState } from 'react'
import { debounce } from 'lodash'
import { Modal, Switch } from '@magickml/client-core'

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
  const { selectedAgentData, setSelectedAgentData, update, enable } = props.props

  // Initialize the state variables
  const debouncedFunction = debounce((id, data) => update(id, data), 500)
  const [editMode, setEditMode] = useState<boolean>(false)
  const [checked, setChecked] = useState(selectedAgentData.data?.loop_enabled)
  const [disable, setDisable] = useState(false)
  const [state, setState] = useState({
    loop_interval: selectedAgentData?.data?.loop_interval,
  })

  // Handle enable/disable of the loop plugin
  useEffect(() => {
    if (enable["LoopPlugin"] === false) {
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
      <div
        style={{
          backgroundColor: '#222',
          padding: '2em',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: disable ? 'none' : 'auto',
          opacity: disable ? 0.2 : 1,
        }}
      >
        <h3>Agent Update Loop</h3>
        <div
          style={{
            display: 'flex',
            paddingTop: '1em',
          }}
        >
          <button
            onClick={() => {
              setEditMode(true)
            }}
            style={{ marginRight: '10px', cursor: 'pointer' }}
          >
            Edit
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
        <Modal open={editMode} setOpen={setEditMode} handleAction={handleSave}>
          <div>
            <div>
              <span className="form-item-label">Loop Interval</span>
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