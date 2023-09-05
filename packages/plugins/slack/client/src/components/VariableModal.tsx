import { Switch, Modal } from '@magickml/client-core'
import { useState } from 'react'
import { Tooltip } from '@mui/material'
import { API_ROOT_URL } from '@magickml/config'

const VariableModal = ({
  selectedAgentData,
  editMode,
  setEditMode,
  update,
}) => {
  const [state, setState] = useState({
    slack_app_id: selectedAgentData?.data?.slack_app_id,
    slack_verification_token: selectedAgentData?.data?.slack_verification_token,
    slack_bot_token: selectedAgentData?.data?.slack_bot_token,
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
      <Modal
        open={editMode}
        onClose={setEditMode}
        showSaveBtn={true}
        handleAction={handleSave}
      >
        {/* App ID */}
        <div style={{ marginBottom: '1em' }}>
          <div>
            <Tooltip
              title="Add your Slack App ID here."
              placement="bottom"
              arrow
            >
              <span className="form-item-label">Slack App ID</span>
            </Tooltip>
            <input
              type="password"
              className="modal-element"
              name="slack_app_id"
              defaultValue={state.slack_app_id}
              onChange={handleOnChange}
            />
          </div>
        </div>
        {/* Verification Token */}
        <div style={{ marginBottom: '1em' }}>
          <div>
            <Tooltip
              title="Add your Slack Verification Token here."
              placement="bottom"
              arrow
            >
              <span className="form-item-label">Slack Verification Token</span>
            </Tooltip>
            <input
              type="password"
              className="modal-element"
              name="slack_verification_token"
              defaultValue={state.slack_verification_token}
              onChange={handleOnChange}
            />
          </div>
        </div>
        {/* Bot Token */}
        <div style={{ marginBottom: '1em' }}>
          <div>
            <Tooltip
              title="Add your Slack Bot Token here."
              placement="bottom"
              arrow
            >
              <span className="form-item-label">Slack Bot Token</span>
            </Tooltip>
            <input
              type="password"
              className="modal-element"
              name="slack_bot_token"
              defaultValue={state.slack_bot_token}
              onChange={handleOnChange}
            />
          </div>
        </div>
      </Modal>
    )
  )
}

export default VariableModal
