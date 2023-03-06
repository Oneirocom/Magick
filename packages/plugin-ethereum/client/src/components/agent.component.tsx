//@ts-nocheck
import axios from 'axios'
import { useSnackbar } from 'notistack'
import React, { FC, useState, useEffect } from 'react'
import { KeyInput } from './utils'
import { Switch } from '@magickml/client-core'
import { debounce } from 'lodash'

type PluginProps = {
  agentData: any
  props
}

export const EthereumAgentWindow: FC<any> = props => {
  props = props.props
  const { agentData, setAgentData, update } = props
  const debouncedFunction = debounce((id, data) => update(id, data), 1000)
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
          checked={agentData.data?.ethereum_enabled}
          onChange={e => {
            debouncedFunction(agentData.id, {
              ...agentData,
              data: {
                ...agentData.data,
                ethereum_enabled: e.target.checked,
              },
            })
            setAgentData({
              ...agentData,
              data: {
                ...agentData.data,
                ethereum_enabled: e.target.checked,
              },
            })
          }}
          label={''}
        />
      </div>

      {agentData.data?.ethereum_enabled && (
        <>
          <div className="form-item">
            <span className="form-item-label">Private Key</span>
            <KeyInput
              value={agentData.data?.ethereum_private_key}
              setValue={value =>
                setAgentData({
                  ...agentData,
                  data: {
                    ...agentData.data,
                    ethereum_private_key: value,
                  },
                })
              }
              secret={true}
            />
          </div>

          <div className="form-item">
            <span className="form-item-label">Custom RPC Provider</span>
            <input
              type="text"
              value={agentData.data?.ethereum_custom_rpc}
              placeholder="https://mainnet.infura.io/v3/..."
              onChange={e => {
                setAgentData({
                  ...agentData,
                  data: {
                    ...agentData.data,
                    ethereum_custom_rpc: e.target.value,
                  },
                })
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}
