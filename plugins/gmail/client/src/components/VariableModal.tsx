import { Modal } from '@magickml/client-core'
import Grid from '@mui/material/Grid'
import { useState } from 'react'

const VariableModal = ({
  selectedAgentData,
  editMode,
  setEditMode,
  update,
}) => {
  const [state, setState] = useState({
    gmail_address: selectedAgentData?.data?.gmail_address,
    gmail_password: selectedAgentData?.data?.gmail_password,
  })

  const handleOnChange = e => {
    const { name, value } = e.target
    if (name === 'gmail_feed_enable')
      setState({ ...state, [name]: e.target.checked ? 'on' : 'off' })
    else setState({ ...state, [name]: value })
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
    <Modal open={editMode} setOpen={setEditMode} handleAction={handleSave}>
      <div style={{ marginBottom: '1em' }}>
        <div>
          <span className="form-item-label">Email Address</span>
          <input
            className="modal-element"
            type="text"
            name="gmail_address"
            defaultValue={state.gmail_address}
            placeholder={''}
            onChange={handleOnChange}
          />
        </div>
      </div>
      <div>
        <div style={{ marginBottom: '1em' }}>
          <span className="form-item-label">Password</span>
          <input
            className="modal-element"
            type="password"
            name="gmail_password"
            value={state.gmail_password}
            onChange={handleOnChange}
          />
        </div>
      </div>
      <Grid container>
        <Grid item xs={12}>
          <p style={{ marginTop: '1em' }} className="modal-element">
            To set up a Gmail bot, you will need a Gmail{' '}
            <a href="https://gmail.com/">account</a>.
          </p>
        </Grid>
      </Grid>
    </Modal>
  )
}

export default VariableModal
