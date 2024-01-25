
import React, { FC, useEffect, useState } from 'react'
import { Tooltip } from '@mui/material'

import { Switch } from 'client/core'
import VariableModal from './VariableModal'

export const DiscordAgentWindow: FC<any> = props => {
  props = props.props
  const { selectedAgentData, update } = props

  const [editMode, setEditMode] = useState<boolean>(false)
  const [checked, setChecked] = useState(
    selectedAgentData.data?.discord_enabled || false
  )
  const [, setDisable] = useState(false)

  const handleClose = () => {
    setEditMode(false)
  }
  useEffect(() => {
    if (props.enable['DiscordPlugin'] == false) {
      setChecked(false)
      setDisable(true)
    }
    if (props.enable['DiscordPlugin'] == true) {
      setChecked(selectedAgentData?.data?.discord_enabled)
      setDisable(false)
    }
  }, [props.enable, selectedAgentData])

  return (
    <>
      <div className='connector-layout'>
        <Tooltip title="Add discord Api key here" placement="left" disableInteractive arrow>
          <h3>Discord</h3>
        </Tooltip>
        <div className='controls'>
          <button
            onClick={() => {
              setEditMode(true)
            }}
            style={{ marginRight: '10px', cursor: 'pointer' }}
          >
            Configure
          </button>
          <Switch
            label={null}
            checked={checked}
            onChange={e => {
              setChecked(e.target.checked)
              console.log('SWITCHING DISCORD')
              update({
                ...selectedAgentData,
                data: {
                  ...selectedAgentData.data,
                  discord_enabled: e.target.checked,
                },
              });
            }}
            style={{ float: 'right' }}
          />
        </div>
      </div>
      {editMode && (
        <VariableModal
          selectedAgentData={selectedAgentData}
          editMode={editMode}
          setEditMode={handleClose}
          update={update}
        />
      )}
    </>
  )
}
