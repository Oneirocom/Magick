//@ts-nocheck
import axios from 'axios'
import { useSnackbar } from 'notistack'
import React, { FC, useState, useEffect } from 'react'
import { KeyInput } from './utils'
type PluginProps = {
  agentData: any
  props
}

export const EthereumAgentWindow: FC<any> = (props) => {
  props = props.props
  const [ethereum_enabled, setEthereumEnabled] = useState(undefined)
  const [ethereum_private_key, setEthereumPrivateKey] = useState('')
  const [ethereum_custom_rpc, setEthereumCustomRpc] = useState('')

  useEffect(() => {
    if (props.agentData !== null && props.agentData !== undefined) {
      console.log(props.agentData)
      setEthereumEnabled(props.agentData.ethereum_enabled)
      setEthereumPrivateKey(props.agentData.ethereum_private_key)
      setEthereumCustomRpc(props.agentData.ethereum_custom_rpc)
      props.setAgentDataState({
        ethereum_enabled: ethereum_enabled,
        ethereum_private_key: ethereum_private_key,
        ethereum_custom_rpc: ethereum_custom_rpc,
      })
    }
  }, [])
  useEffect(() => {
    //console.log(ethereum_enabled, ethereum_private_key, ethereum_custom_rpc)
    props.setAgentDataState({
      ethereum_enabled: ethereum_enabled,
      ethereum_private_key: ethereum_private_key,
      ethereum_custom_rpc: ethereum_custom_rpc
    })
  }, [ethereum_enabled, ethereum_private_key, ethereum_custom_rpc])

  return (
    <div style={{
      backgroundColor: '#222',
      padding: "1em"
    }}>
      <h1>Ethereum</h1>
      <div className="form-item">
        <span className="form-item-label">Enabled</span>
        <input
          key={Math.random()}
          type="checkbox"
          value={ethereum_enabled}
          defaultChecked={ethereum_enabled}
          onChange={e => {
            setEthereumEnabled(e.target.checked)
          }}
        />
      </div>

      {ethereum_enabled && (
        <>
          <div className="form-item">
            <span className="form-item-label">Ethereum Private Key</span>
            <KeyInput value={ethereum_private_key} setValue={setEthereumPrivateKey} secret={true} />
          </div>

          <div className="form-item">
            <span className="form-item-label">
              Ethereum Starting Words - Separated by ,
            </span>
            <input
              type="text"
              defaultValue={ethereum_custom_rpc}
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
