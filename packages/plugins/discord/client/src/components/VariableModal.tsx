import { Switch, Modal } from '@magickml/client-core'
import { useState } from 'react'
import { Tooltip } from '@mui/material'

const VariableModal = ({
  selectedAgentData,
  editMode,
  testVoice,
  setEditMode,
  update,
}) => {
  const [state, setState] = useState({
    discord_api_key: selectedAgentData?.data?.discord_api_key,
    discord_starting_words: selectedAgentData?.data?.discord_starting_words,
    discord_bot_name: selectedAgentData?.data?.discord_bot_name,
    voice_provider: selectedAgentData?.data?.voice_provider,
    voice_character: selectedAgentData?.data?.voice_character,
    voice_language_code: selectedAgentData?.data?.voice_language_code,
    voice_endpoint: selectedAgentData?.data?.voice_endpoint,
  })

  const handleOnChange = e => {
    const { name, value } = e.target
    setState({ ...state, [name]: value })
  }

  const handleSave = () => {
    const data = {
      ...selectedAgentData,
      data: {
        ...selectedAgentData.data,
        ...state,
      },
    }

    update(selectedAgentData.id, data)
  }

  return (
    editMode && (
      <Modal open={editMode} onClose={setEditMode} showSaveBtn={true} handleAction={handleSave}>
        <div style={{ marginBottom: '1em' }}>
          <div>
            <Tooltip title="add your api key here and save" placement='bottom' arrow >
            <span className="form-item-label">API Key</span>
            </Tooltip>
            <input
              type="password"
              className="modal-element"
              name="discord_api_key"
              defaultValue={state.discord_api_key}
              onChange={handleOnChange}
            />
          </div>
        </div>
      </Modal>
    )
  )
}

export default VariableModal
