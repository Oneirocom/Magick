import { useState } from 'react'
import Modal from '../Modal/Modal'

const AgentModal = ({ content, onClose, options: _options }) => {
  const [message, setMessage] = useState('')
  const options = [
    {
      label: 'Create Agent',
      className: 'primary',
      onClick: () => {
        onClose({ name: message })
      },
    },
  ]
  const updateNotes = e => {
    console.log("message is ", e.target.value)
    setMessage(e.target.value)
  }

  return (
    <Modal title="Create Agent" options={options} icon="add">
      <br />
      <h4>Agent Name</h4>
      <input type="text" style={{ width: '100%' }} onChange={updateNotes} />
    </Modal>
  )
}

export default AgentModal
