import React, { FC, useEffect, useState } from 'react'
import { KeyInput } from './utils'
import { Modal, Switch } from '@magickml/client-core'
import { debounce } from 'lodash'

type PluginProps = {
  selectedAgentData: any
  props
}

export const EthereumAgentWindow: FC<any> = props => {
  props = props.props
  const { selectedAgentData, setSelectedAgentData, update } = props
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
  useEffect(() => {
    if (props.enable['EthereumPlugin'] == false) {
      setChecked(false)
      setDisable(true)
    }
    if (props.enable['EthereumPlugin'] == true) {
      setChecked(selectedAgentData.data?.ethereum_enabled)
      setDisable(false)
    }
  }, [props.enable, selectedAgentData])
  const handleOnChange = e => {
    const { name, value } = e.target
    setState({ ...state, [name]: value })
  }

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
        <h3>Ethereum</h3>
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
