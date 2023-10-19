import { Switch } from 'client/core'
import { debounce } from 'lodash'
import { FC, useEffect, useState } from 'react'
import VariableModal from './VariableModal'
import { Tooltip } from '@mui/material'

export const TwitterAgentWindow: FC<any> = props => {
  props = props.props
  const { selectedAgentData, setSelectedAgentData, update } = props
  const debouncedFunction = debounce((id, data) => update(id, data), 500)
  const [editMode, setEditMode] = useState<boolean>(false)
  const [checked, setChecked] = useState(
    selectedAgentData.data?.twitter_enabled
  )
  const [disable, setDisable] = useState(false)

  useEffect(() => {
    if (props.enable['TwitterPlugin'] == false) {
      setChecked(false)
      setDisable(true)
    }
    if (props.enable['TwitterPlugin'] == true) {
      setChecked(selectedAgentData.data?.twitter_enabled)
      setDisable(false)
    }
  }, [props.enable, selectedAgentData])
  return (
    <>
      <div className='connector-layout'>
        <Tooltip
          title="Add your twitter account details here"
          placement="left"
          arrow
          disableInteractive
        >
          <h3>Twitter</h3>
        </Tooltip>
        <div className='controls'>
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
                  twitter_enabled: e.target.checked,
                },
              })

              setSelectedAgentData({
                ...selectedAgentData,
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
          update={update}
        />
      )}
    </>
  )
}
