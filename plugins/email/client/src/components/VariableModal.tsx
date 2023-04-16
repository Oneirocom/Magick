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
    email_identifier: selectedAgentData?.data?.email_identifier,
    email_password: selectedAgentData?.data?.email_password,
  })

  const handleOnChange = e => {
    const { name, value } = e.target
    if (name === 'email_feed_enable')
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
      <Grid container>
        <Grid item xs={12}>
          <p style={{ marginTop: '1em' }} className="modal-element">
            To set up a Email bot, you will need to set up a Email{' '}
            <a href="https://developer.email.com/">Developer account</a>.
          </p>
          <p style={{ marginBottom: '2em' }} className="modal-element">
            For <b>API keys and credentials</b> you will need to create a{' '}
            <a href="https://developer.email.com/en/docs/apps/app-management">
              new app
            </a>{' '}
            and then get your app credentials and paste them above.
          </p>
        </Grid>
      </Grid>
      <div style={{ marginBottom: '1em' }}>
        <div>
          <span className="form-item-label">User Identifier</span>
          <input
            className="modal-element"
            type="text"
            name="email_identifier"
            defaultValue={state.email_identifier}
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
            name="email_password"
            value={state.email_password}
            onChange={handleOnChange}
          />
        </div>
      </div>
    </Modal>
  )
}

export default VariableModal
