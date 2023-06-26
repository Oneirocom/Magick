import { Modal } from '@magickml/client-core'
import { useState } from 'react'

const VariableModal = ({
  selectedAgentData,
  editMode,
  setEditMode,
  update,
}) => {
  const [state, setState] = useState({
    ethereum_private_key: selectedAgentData?.data?.ethereum_private_key,
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

  const handleClose = () => {
    setEditMode(false)
  }

  return (
    editMode && (
      <Modal open={editMode} onClose={handleClose} handleAction={handleSave}>
        <div style={{ marginBottom: '1em' }}>
          <div>
            <span className="form-item-label">Ethereum Private Key</span>
            <input
              className="modal-element"
              type="password"
              name="ethereum_private_key"
              value={state.ethereum_private_key}
              onChange={handleOnChange}
            />
          </div>
        </div>
      </Modal>
    )
  )
}

export default VariableModal
