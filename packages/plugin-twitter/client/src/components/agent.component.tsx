import React, { FC, useState } from 'react'
import Grid from '@mui/material/Grid'
import { debounce } from 'lodash'
import { Switch } from '@magickml/client-core'
import Button from '@mui/material/Button'
import VariableModal from './VariableModal'
export const TwitterAgentWindow: FC<any> = props => {
  props = props.props
  const { selectedAgentData, setSelectedAgentData, update } = props
  const debouncedFunction = debounce((id, data) => update(id, data), 500)
  const [editMode, setEditMode] = useState<boolean>(false)

  return (
    <>
      <div
        style={{
          backgroundColor: '#222',
          padding: '2em',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3>Twitter</h3>
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
            label={null}
            checked={selectedAgentData.data?.twitter_enabled}
            onChange={e => {
              debouncedFunction(selectedAgentData.id, {
                data: {
                  ...selectedAgentData.data,
                  twitter_enabled: e.target.checked,
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
          setEditMode={setEditMode}
          selectedAgentData={selectedAgentData}
          setSelectedAgentData={setSelectedAgentData}
          debouncedFunction={debouncedFunction}
          update={update}
        />
      )}
    </>
  )
}
