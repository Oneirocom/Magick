import React, { FC, useEffect, useState } from 'react'
import { debounce } from 'lodash'

import { Switch } from '@magickml/client-core'
import VariableModal from './VariableModal'
import {Tooltip} from "@mui/material"

export const GithubAgentWindow: FC<any> = props => {
  props = props.props
  const { selectedAgentData, update, setSelectedAgentData } = props
  const debouncedFunction = debounce((id, data) => update(id, data), 50)
  const [editMode, setEditMode] = useState<boolean>(false)
  const [checked, setChecked] = useState(
    selectedAgentData.data?.github_enabled || false
  )
  const [disable, setDisable] = useState(false)

  const handleClose = () => {
    setEditMode(false)
  }
  useEffect(() => {
    if (props.enable['GithubPlugin'] == false) {
      setChecked(false)
      setDisable(true)
    }
    if (props.enable['GithubPlugin'] == true) {
      setChecked(selectedAgentData?.data?.github_enabled)
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
         <Tooltip title={" Add your Github access "} placement="left" arrow>
        <h3>Github</h3>
         </Tooltip>
        <div
          style={{
            display: 'flex',
            paddingTop: '1em',
          }}
        >
          <button
            onClick={async () => {
              if (checked == true) {
                setEditMode(true)
              }
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
                  github_enabled: e.target.checked,
                },
              })
              setSelectedAgentData({
                ...selectedAgentData,
                data: {
                  ...selectedAgentData.data,
                  github_enabled: e.target.checked,
                },
              })
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