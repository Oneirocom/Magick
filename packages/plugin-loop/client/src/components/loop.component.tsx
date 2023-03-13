import React, { FC, useState } from 'react'
import { debounce } from 'lodash'

type PluginProps = {
  selectedAgentData: any
  props: {
    selectedAgentData: any
    setSelectedAgentData: any
    update: (id: string, data: object) => void
  }
}
import { Grid } from '@mui/material'
import { Modal, Switch } from '@magickml/client-core'
import Button from '@mui/material/Button'

export const AgentLoopWindow: FC<PluginProps> = props => {
  const { selectedAgentData, setSelectedAgentData, update } = props.props
  const debouncedFunction = debounce((id, data) => update(id, data), 500)
  const [editMode, setEditMode] = useState<boolean>(false)

  return (
    <div
      style={{
        backgroundColor: '#222',
        padding: '2em',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <h3>Agent Update Loop</h3>
      <div
        style={{
          display: 'flex',
          paddingTop: '1em',
        }}
      >
        <Button
          onClick={() => {
            setEditMode(true)
          }}
          style={{
            margin: '1em',
            color: 'white',
            backgroundColor: 'purple',
          }}
        >
          Edit
        </Button>
        <Switch
          checked={selectedAgentData.data?.loop_enabled}
          onChange={e => {
            debouncedFunction(selectedAgentData.id, {
              data: {
                ...selectedAgentData.data,
                loop_enabled: e.target.checked,
              },
            })
          }}
          label={''}
        />
      </div>
      {editMode && (
        <Modal open={editMode} setOpen={setEditMode} handleAction={update}>
          <div className="form-item">
            <Grid container>
              <>
                <div className="form-item">
                  <span className="form-item-label">Loop Interval</span>
                  <input
                    type="text"
                    pattern="[0-9]*"
                    defaultValue={selectedAgentData.data?.loop_interval}
                    placeholder="Run every X seconds"
                    onChange={e => {
                      setSelectedAgentData({
                        ...selectedAgentData,
                        data: {
                          ...selectedAgentData.data,
                          loop_interval: e.target.value,
                        },
                      })
                    }}
                  />
                </div>
              </>
            </Grid>
          </div>
        </Modal>
      )}
    </div>
  )
}
