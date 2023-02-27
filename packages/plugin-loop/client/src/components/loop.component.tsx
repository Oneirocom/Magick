import React, { FC } from 'react'
type PluginProps = {
  agentData: any
  props: {
    agentData: any
    setAgentData: any
  }
}
import { Grid } from '@mui/material'
import { Switch } from '@magickml/client-core'
export const AgentLoopWindow: FC<PluginProps> = props => {
  const { agentData, setAgentData } = props.props
  return (
    <div
      style={{
        backgroundColor: '#222',
        padding: '1em',
        position: 'relative'
      }}
    >
      <h1>Agent Update Loop</h1>
      <div style={{ position: 'absolute', right: '1em', top: '0' }}>
        <Switch
          checked={agentData.loop_enabled}
          onChange={e => {
            setAgentData({ agentData, loop_enabled: e.target.checked })
          }}
          label={''}
        />
      </div>
      <div className="form-item">
        <Grid container style={{ padding: '1em' }}>
          {agentData.loop_enabled && (
            <>
              <div className="form-item">
                <span className="form-item-label">Loop Interval</span>
                <input
                  type="text"
                  pattern="[0-9]*"
                  defaultValue={agentData.loop_interval}
                  onChange={e => {
                    setAgentData({
                      ...agentData,
                      loop_interval: e.target.value,
                    })
                  }}
                />
              </div>
            </>
          )}
        </Grid>
      </div>
    </div>
  )
}
