import { Modal } from 'client/core'
import Grid from '@mui/material/Grid'
import { useState } from 'react'
import { Tooltip } from '@mui/material'

const VariableModal = ({
  selectedAgentData,
  editMode,
  handleClose,
  update,
}) => {
  const [state, setState] = useState({
    bluesky_identifier: selectedAgentData?.data?.bluesky_identifier,
    bluesky_password: selectedAgentData?.data?.bluesky_password,
  })

  const handleOnChange = e => {
    const { name, value } = e.target
    if (name === 'bluesky_feed_enable')
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
    <Modal open={editMode} onClose={handleClose} handleAction={handleSave}>
      <Grid container>
        <Grid item xs={12}>
          <p style={{ marginTop: '1em' }} className="modal-element">
            To set up a Bluesky bot, you will need to set up a Bluesky{' '}
            <a href="https://developer.bluesky.com/">Developer account</a>.
          </p>
          <p style={{ marginBottom: '2em' }} className="modal-element">
            For <b>API keys and credentials</b> you will need to create a{' '}
            <a href="https://developer.bluesky.com/en/docs/apps/app-management">
              new app
            </a>{' '}
            and then get your app credentials and paste them below.
          </p>
        </Grid>
      </Grid>
      <div style={{ marginBottom: '1em' }}>
        <div>
          <Tooltip title="add your bluesky user identifier" placement='bottom' disableInteractive arrow>
            <span className="form-item-label">User Identifier</span>
          </Tooltip>
          <input
            className="modal-element"
            type="text"
            name="bluesky_identifier"
            defaultValue={state.bluesky_identifier}
            placeholder={''}
            onChange={handleOnChange}
          />
        </div>
      </div>
      <div>
        <div style={{ marginBottom: '1em' }}>
          <Tooltip title="add your bluesky password" placement='bottom' disableInteractive arrow>
            <span className="form-item-label">Password</span>
          </Tooltip>
          <input
            className="modal-element"
            type="password"
            name="bluesky_password"
            value={state.bluesky_password}
            onChange={handleOnChange}
          />
        </div>
      </div>
    </Modal>
  )
}

export default VariableModal
