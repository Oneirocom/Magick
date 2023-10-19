// DOCUMENTED
import React, { FC, useEffect, useState } from 'react'
import { KeyInput } from './utils'
import { Modal, Switch } from 'client/core'
import { debounce } from 'lodash'

// Define the type for PluginProps
type PluginProps = {
  selectedAgentData: any
  props: any
}

/**
 * EthereumAgentWindow component.
 * Displays an Ethereum agent settings section with an edit mode.
 * @param props - PluginProps with selected agent data and additional props
 */
export const EthereumAgentWindow: FC<PluginProps> = ({
  selectedAgentData,
  props,
}) => {
  const { setSelectedAgentData, update } = props

  // Initialize the states and debouncedFunction
  const debouncedFunction = debounce((id, data) => update(id, data), 500)
  const [editMode, setEditMode] = useState<boolean>(false)
  const [checked, setChecked] = useState(
    selectedAgentData.data?.ethereum_enabled || false
  )
  const [disable, setDisable] = useState(false)
  const [state, setState] = useState({
    ethereum_private_key: selectedAgentData?.data?.ethereum_private_key,
    ethereum_custom_rpc: selectedAgentData?.data?.ethereum_custom_rpc,
  })

  // Update the enable state base on the selected agent data
  useEffect(() => {
    if (props.enable['EthereumPlugin'] === false) {
      setChecked(false)
      setDisable(true)
    } else if (props.enable['EthereumPlugin'] === true) {
      setChecked(selectedAgentData.data?.ethereum_enabled)
      setDisable(false)
    }
  }, [props.enable, selectedAgentData])

  /**
   * Handles the change event from input elements and updates the state.
   * @param e - event from input elements
   */
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState({ ...state, [name]: value })
  }

  /**
   * Handles the save action when the edit mode is closed.
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

  return (
    <>
      <div className='connector-layout'>
        <h3>Ethereum</h3>
        <div className='controls'>
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
                  ethereum_enabled: e.target.checked,
                },
              })

              setSelectedAgentData({
                ...selectedAgentData,
                data: {
                  ...selectedAgentData.data,
                  ethereum_enabled: e.target.checked,
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
            <span className="form-item-label">Private Key</span>
            <KeyInput
              value={state?.ethereum_private_key}
              style={{ width: '100%' }}
              setValue={value =>
                setState({
                  ...state,
                  ethereum_private_key: value,
                })
              }
              secret={false}
            />
          </div>
          <div>
            <div>
              <span className="form-item-label">Custom RPC Provider</span>
              <input
                type="text"
                style={{ width: '100%' }}
                name="ethereum_custom_rpc"
                defaultValue={selectedAgentData.data?.ethereum_custom_rpc}
                placeholder="https://mainnet.infura.io/v3/..."
                onChange={handleOnChange}
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
