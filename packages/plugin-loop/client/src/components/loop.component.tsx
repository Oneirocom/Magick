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
        padding: '2em',
        position: 'relative',
      }}
    >
      <h3>Agent Update Loop</h3>
      <div style={{ position: 'absolute', right: '1em', top: '0' }}>
        <Switch
          checked={agentData.data?.loop_enabled}
          onChange={e => {
            if (!e.target.checked) {
              setAgentData({
                ...agentData,
                data: {
                  ...agentData.data,
                  loop_interval: '',
                  loop_enabled: false,
                },
              })
            } else {
              setAgentData({
                ...agentData,
                data: { ...agentData.data, loop_enabled: e.target.checked },
              })
            }
          }}
          label={''}
        />
      </div>
      {agentData.data?.loop_enabled && (
        <div className="form-item">
          <Grid container>
            <>
              <div className="form-item">
                <span className="form-item-label">Loop Interval</span>
                <input
                  type="text"
                  pattern="[0-9]*"
                  defaultValue={agentData.data?.loop_interval}
                  placeholder="Run every X seconds"
                  onChange={e => {
                    setAgentData({
                      ...agentData,
                      data: {
                        ...agentData.data,
                        loop_interval: e.target.value,
                      },
                    })
                  }}
                />
              </div>
            </>
          </Grid>
        </div>
      )}
    </div>
  )
}
