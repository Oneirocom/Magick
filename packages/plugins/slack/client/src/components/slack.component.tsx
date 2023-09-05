import { FC, useEffect, useState } from 'react'
import { debounce } from 'lodash'
import { Tooltip } from '@mui/material'
import { Switch } from '@magickml/client-core'
import VariableModal from './VariableModal'

const SlackAgentWindow: FC<any> = props => {
  props = props.props
  const { selectedAgentData, update, setSelectedAgentData } = props
  const debouncedFunction = debounce((id, data) => update(id, data), 500)
  const [editMode, setEditMode] = useState<boolean>(false)
  const [checked, setChecked] = useState(
    selectedAgentData.data?.slack_enabled || false
  )
  const [disable, setDisable] = useState(false)

  const handleClose = () => {
    setEditMode(false)
  }
  useEffect(() => {
    if (props.enable['SlackPlugin'] == false) {
      setChecked(false)
      setDisable(true)
    }
    if (props.enable['SlackPlugin'] == true) {
      setChecked(selectedAgentData?.data?.slack_enabled)
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
        <Tooltip title="Add Slack connection details here." placement="left" arrow>
          <h3>Slack</h3>
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
                  slack_enabled: e.target.checked,
                },
              })
              setSelectedAgentData({
                ...selectedAgentData,
                data: {
                  ...selectedAgentData.data,
                  slack_enabled: e.target.checked,
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

export default SlackAgentWindow
