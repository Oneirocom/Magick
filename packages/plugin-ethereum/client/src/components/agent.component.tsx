//@ts-nocheck
import axios from 'axios'
import { useSnackbar } from 'notistack'
import React, { FC, useState, useEffect } from 'react'
import { KeyInput } from './utils'
import { Switch } from '@magickml/client-core'

type PluginProps = {
  selectedAgentData: any
  props
}

export const EthereumAgentWindow: FC<any> = props => {
  props = props.props
  const [ethereum_enabled, setEthereumEnabled] = useState(undefined)
  const [ethereum_private_key, setEthereumPrivateKey] = useState('')
  const [ethereum_custom_rpc, setEthereumCustomRpc] = useState('')

  const { selectedAgentData, setSelectedAgentData } = props

  useEffect(() => {
    if (props.selectedAgentData !== null && props.selectedAgentData !== undefined) {
      console.log(props.selectedAgentData)
      setEthereumEnabled(props.selectedAgentData.data?.ethereum_enabled)
      setEthereumPrivateKey(props.selectedAgentData.data?.ethereum_private_key)
      setEthereumCustomRpc(props.selectedAgentData.data?.ethereum_custom_rpc)
      setSelectedAgentData({
        ...selectedAgentData,
        data: {
          ...selectedAgentData.data,
          ethereum_enabled: ethereum_enabled,
          ethereum_private_key: ethereum_private_key,
          ethereum_custom_rpc: ethereum_custom_rpc,
        },
      })
    }
  }, [])
  useEffect(() => {
    //console.log(ethereum_enabled, ethereum_private_key, ethereum_custom_rpc)
    setSelectedAgentData({
      ...selectedAgentData,
      data: {
        ...selectedAgentData.data,
        ethereum_enabled: ethereum_enabled,
        ethereum_private_key: ethereum_private_key,
        ethereum_custom_rpc: ethereum_custom_rpc,
      },
    })
  }, [ethereum_enabled, ethereum_private_key, ethereum_custom_rpc])

  return (
    <div
      style={{
        backgroundColor: '#222',
        padding: '2em',
        position: 'relative',
      }}
    >
      <h3>Ethereum</h3>
      <div style={{ position: 'absolute', right: '1em', top: '0' }}>
        <Switch
          checked={ethereum_enabled}
          onChange={e => {
            if (!e.target.checked) {
              setEthereumPrivateKey('')
              setEthereumCustomRpc('')
            }
            setEthereumEnabled(e.target.checked)
          }}
          label={''}
        />
      </div>

      {ethereum_enabled && (
        <>
          <div className="form-item">
            <span className="form-item-label">Private Key</span>
            <KeyInput
              value={ethereum_private_key}
              setValue={setEthereumPrivateKey}
              secret={true}
            />
          </div>

          <div className="form-item">
            <span className="form-item-label">
              Custom RPC Provider
            </span>
            <input
              type="text"
              defaultValue={ethereum_custom_rpc}
              placeholder="https://mainnet.infura.io/v3/..."
              onChange={e => {
                setEthereumCustomRpc(e.target.value)
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}
