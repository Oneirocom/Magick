import { Switch } from '@magickml/client-core'
import { debounce } from 'lodash'
import { FC, useEffect, useState } from 'react'
import VariableModal from './VariableModal'
export const GmailAgentWindow: FC<any> = props => {
  props = props.props
  const { selectedAgentData, setSelectedAgentData, update } = props
  const debouncedFunction = debounce((id, data) => update(id, data), 500)
  const [editMode, setEditMode] = useState<boolean>(false)
  const [checked, setChecked] = useState(selectedAgentData.data?.gmail_enabled)
  const [disable, setDisable] = useState(false)
  useEffect(()=>{
    if (props.enable["GmailPlugin"] == false) {
      setChecked(false)
      setDisable(true)
    }
    if (props.enable['GmailPlugin'] == true){
      setChecked(selectedAgentData.data?.gmail_enabled)
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
        <h3>Gmail</h3>
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
                  gmail_enabled: e.target.checked,
                },
              })

              setSelectedAgentData({
                ...selectedAgentData,
                data: {
                  ...selectedAgentData.data,
                  gmail_enabled: e.target.checked,
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
