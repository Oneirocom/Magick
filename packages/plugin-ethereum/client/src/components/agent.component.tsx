//@ts-nocheck
import axios from 'axios'
import { useSnackbar } from 'notistack'
import React, { FC, useState, useEffect } from 'react'
import { KeyInput } from './utils'
import { Switch } from '@magickml/client-core'

type PluginProps = {
  agentData: any
  props
}

export const EthereumAgentWindow: FC<any> = props => {
  props = props.props
  const [ethereum_enabled, setEthereumEnabled] = useState(undefined)
  const [ethereum_private_key, setEthereumPrivateKey] = useState('')
  const [ethereum_custom_rpc, setEthereumCustomRpc] = useState('')

  const { agentData, setAgentData } = props

  useEffect(() => {
    if (props.agentData !== null && props.agentData !== undefined) {
      console.log(props.agentData)
      setEthereumEnabled(props.agentData.data?.ethereum_enabled)
      setEthereumPrivateKey(props.agentData.data?.ethereum_private_key)
      setEthereumCustomRpc(props.agentData.data?.ethereum_custom_rpc)
      setAgentData({
        ...agentData,
        data: {
          ...agentData.data,
          ethereum_enabled: ethereum_enabled,
          ethereum_private_key: ethereum_private_key,
          ethereum_custom_rpc: ethereum_custom_rpc,
        },
      })
    }
  }, [])
  useEffect(() => {
    //console.log(ethereum_enabled, ethereum_private_key, ethereum_custom_rpc)
    setAgentData({
      ...agentData,
      data: {
        ...agentData.data,
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
            <span className="form-item-label">Ethereum Private Key</span>
            <KeyInput
              value={ethereum_private_key}
              setValue={setEthereumPrivateKey}
              secret={true}
            />
          </div>

          <div className="form-item">
            <span className="form-item-label">
              Ethereum Starting Words - Separated by ,
            </span>
            <input
              type="text"
              defaultValue={ethereum_custom_rpc}
              placeholder="Insert Ethereum starting words here"
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
