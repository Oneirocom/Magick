import React, { FC, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import { Switch } from '@magickml/client-core'
import md5 from 'md5'
import { Button, Input } from '@mui/material'

const randomHash = () => {
  return md5(Math.random().toString())
}

export const RestAgentWindow: FC<any> = props => {
  props = props.props
  const { agentData, setAgentData } = props

  useEffect(() => {
    if (agentData.data?.rest_api_key === undefined) {
      setAgentData({
        ...agentData,
        data: {
          ...agentData.data,
          rest_api_key: randomHash(),
        },
      })
    }
  }, [])

  return (
    <div
      style={{
        backgroundColor: '#222',
        padding: '2em',
        position: 'relative',
      }}
    >
      <h3>REST API</h3>
      <div style={{ position: 'absolute', right: '1em', top: '0' }}>
        <Switch
          checked={agentData.data?.rest_enabled}
          onChange={e => {
            setAgentData({
              ...agentData,
              data: {
                ...agentData.data,
                rest_enabled: e.target.checked ? true : false,
              },
            })
          }}
          label={''}
        />
      </div>
      {agentData.data?.rest_enabled && (
        <div className="form-item">
          <Grid container>
            <Grid item xs={9}>
              <span className="form-item-label">API Key</span>
              <Input
                value={agentData.data?.rest_api_key}
                readOnly
                style={{ width: '20em' }}
              />
              <Button
                style={{ marginLeft: '1em' }}
                onClick={() => {
                  navigator.clipboard.writeText(agentData.data?.rest_api_key)
                }}
              >
                Copy
              </Button>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  )
}
