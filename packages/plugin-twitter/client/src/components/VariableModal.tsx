import { Modal, Switch } from '@magickml/client-core'
import Grid from '@mui/material/Grid'
import { useState } from 'react'

const VariableModal = ({
  selectedAgentData,
  editMode,
  setEditMode,
  update,
}) => {
  const [state, setState] = useState({
    twitter_userid: selectedAgentData?.data?.twitter_userid,
    twitter_bearer_token: selectedAgentData?.data?.twitter_bearer_token,
    twitter_api_key: selectedAgentData?.data?.twitter_api_key,
    twitter_api_key_secret: selectedAgentData?.data?.twitter_api_key_secret,
    twitter_access_token: selectedAgentData?.data?.twitter_access_token,
    twitter_access_token_secret:
      selectedAgentData?.data?.twitter_access_token_secret,
    twitter_stream_rules: selectedAgentData?.data?.twitter_stream_rules,
    twitter_feed_enable: selectedAgentData?.data?.twitter_feed_enable,
  })

  const handleOnChange = e => {
    const { name, value } = e.target
    if (name === 'twitter_feed_enable')
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
            To set up a Twitter bot, you will need to set up a Twitter{' '}
            <a href="https://developer.twitter.com/">Developer account</a>.
          </p>
          <p style={{ marginBottom: '2em' }} className="modal-element">
            For <b>API keys and credentials</b> you will need to create a{' '}
            <a href="https://developer.twitter.com/en/docs/apps/app-management">
              new app
            </a>{' '}
            and then get your app credentials and paste them above.
          </p>
        </Grid>
      </Grid>
      <div style={{ marginBottom: '1em' }}>
        <div>
          <span className="form-item-label">User ID</span>
          <input
            className="modal-element"
            type="text"
            name="twitter_userid"
            defaultValue={state.twitter_userid}
            placeholder={'@'}
            onChange={handleOnChange}
          />
        </div>
      </div>
      <div>
        <div style={{ marginBottom: '1em' }}>
          <span className="form-item-label">Bearer Token (API v2)</span>
          <input
            className="modal-element"
            type="password"
            name="twitter_bearer_token"
            value={state.twitter_bearer_token}
            onChange={handleOnChange}
          />
        </div>
      </div>
      <div>
        <div style={{ marginBottom: '1em' }}>
          <span className="form-item-label">API Key</span>
          <input
            className="modal-element"
            type="password"
            name="twitter_api_key"
            value={state.twitter_api_key}
            onChange={handleOnChange}
          />
        </div>
      </div>
      <div>
        <div style={{ marginBottom: '1em' }}>
          <span className="form-item-label">API Key Secret</span>
          <input
            className="modal-element"
            type="password"
            name="twitter_api_key_secret"
            defaultValue={state.twitter_api_key_secret}
            onChange={handleOnChange}
          />
        </div>
      </div>
      <div>
        <div style={{ marginBottom: '1em' }}>
          <span className="form-item-label">Access Token</span>
          <input
            className="modal-element"
            type="password"
            name="twitter_access_token"
            defaultValue={state.twitter_access_token}
            onChange={handleOnChange}
          />
        </div>
      </div>
      <div>
        <div style={{ marginBottom: '1em' }}>
          <span className="form-item-label">Access Token Secret</span>
          <input
            className="modal-element"
            type="password"
            name="twitter_access_token_secret"
            value={state.twitter_access_token_secret}
            onChange={handleOnChange}
          />
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <Switch
          label={'Enable Feed'}
          checked={state.twitter_feed_enable === 'on'}
          name="twitter_feed_enable"
          onChange={handleOnChange}
        />
      </div>

      {state.twitter_feed_enable === 'on' && (
        <>
          <Grid container>
            <Grid item xs={12}>
              <span className="form-item-label">Stream Rules</span>
              <p>
                You can add many rules separated with a comma. More info on{' '}
                <a href="https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/integrate/build-a-rule">
                  Twitter's documentation
                </a>
                .
              </p>
              <input
                className="modal-element"
                type="text"
                name="twitter_stream_rules"
                defaultValue={state.twitter_stream_rules}
                placeholder={'grumpy cat OR #catmeme, #MadeWithMagick'}
                onChange={handleOnChange}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Modal>
  )
}

export default VariableModal
