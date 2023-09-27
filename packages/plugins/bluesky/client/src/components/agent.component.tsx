import React, { FC, useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import { debounce } from 'lodash'
import { Switch } from 'client/core'
import Button from '@mui/material/Button'
import VariableModal from './VariableModal'
import { Tooltip } from '@mui/material'
export const BlueskyAgentWindow: FC<any> = props => {
  props = props.props
  const { selectedAgentData, setSelectedAgentData, update } = props
  const debouncedFunction = debounce((id, data) => update(id, data), 500)
  const [editMode, setEditMode] = useState<boolean>(false)
  const [checked, setChecked] = useState(
    selectedAgentData.data?.bluesky_enabled
  )
  const [disable, setDisable] = useState(false)

  const handleClose = () => {
    setEditMode(false)
  }

  useEffect(() => {
    if (props.enable['BlueskyPlugin'] == false) {
      setChecked(false)
      setDisable(true)
    }
    if (props.enable['BlueskyPlugin'] == true) {
      setChecked(selectedAgentData.data?.bluesky_enabled)
      setDisable(false)
    }
  }, [props.enable, selectedAgentData])
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
        <Tooltip title="Add your Bluesky settings" placement='left' disableInteractive arrow>
          <h3>Bluesky</h3>
        </Tooltip>
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
            label={null}
            checked={checked}
            onChange={e => {
              setChecked(!checked)
              debouncedFunction(selectedAgentData.id, {
                ...selectedAgentData,
                data: {
                  ...selectedAgentData.data,
                  bluesky_enabled: e.target.checked,
                },
              })

              setSelectedAgentData({
                ...selectedAgentData,
                data: {
                  ...selectedAgentData.data,
                  bluesky_enabled: e.target.checked,
                },
              })
            }}
            style={{ float: 'right' }}
          />
        </div>
      </div>
      {editMode && (
        <VariableModal
          editMode={editMode}
          handleClose={handleClose}
          selectedAgentData={selectedAgentData}
          update={update}
        />
      )}
    </>
  )
}
