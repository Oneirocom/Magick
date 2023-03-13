import { Modal, Switch } from '@magickml/client-core'
import Grid from '@mui/material/Grid'

const VariableModal = ({
  selectedAgentData,
  setSelectedAgentData,
  editMode,
  setEditMode,
  debouncedFunction,
  update,
}) => {
  return (
    <Modal open={editMode} setOpen={setEditMode} handleAction={update}>
      <Grid container>
        <Grid item xs={12}>
          <p style={{ marginTop: '1em' }}>
            To set up a Twitter bot, you will need to set up a Twitter{' '}
            <a href="https://developer.twitter.com/">Developer account</a>.
          </p>
          <p style={{ marginBottom: '2em' }}>
            For <b>API keys and credentials</b> you will need to create a{' '}
            <a href="https://developer.twitter.com/en/docs/apps/app-management">
              new app
            </a>{' '}
            and then get your app credentials and paste them above.
          </p>
        </Grid>
      </Grid>
      <div>
        <div style={{ marginBottom: '1em' }}>
          <span className="form-item-label">User ID</span>
          <input
            style={{ width: '100%' }}
            type="text"
            defaultValue={selectedAgentData.data?.twitter_userid}
            placeholder={'@'}
            onChange={e => {
              setSelectedAgentData({
                ...selectedAgentData,
                data: {
                  ...selectedAgentData.data,
                  twitter_userid: e.target.value,
                },
              })
            }}
          />
        </div>
      </div>
      <div>
        <div style={{ marginBottom: '1em' }}>
          <span className="form-item-label">Bearer Token (API v2)</span>
          <input
            style={{ width: '100%' }}
            type="password"
            value={selectedAgentData.data?.twitter_bearer_token}
            onChange={e =>
              setSelectedAgentData({
                ...selectedAgentData,
                data: {
                  ...selectedAgentData.data,
                  twitter_bearer_token: e.target.value,
                },
              })
            }
          />
        </div>
      </div>
      <div>
        <div style={{ marginBottom: '1em' }}>
          <span className="form-item-label">API Key</span>
          <input
            style={{ width: '100%' }}
            type="password"
            value={selectedAgentData.data?.twitter_api_key}
            onChange={e =>
              setSelectedAgentData({
                ...selectedAgentData,
                data: {
                  ...selectedAgentData.data,
                  twitter_api_key: e.target.value,
                },
              })
            }
          />
        </div>
      </div>
      <div>
        <div style={{ marginBottom: '1em' }}>
          <span className="form-item-label">API Key Secret</span>
          <input
            style={{ width: '100%' }}
            type="password"
            defaultValue={selectedAgentData.data?.twitter_api_key_secret}
            onChange={e =>
              setSelectedAgentData({
                ...selectedAgentData,
                data: {
                  ...selectedAgentData.data,
                  twitter_api_key_secret: e.target.value,
                },
              })
            }
          />
        </div>
      </div>
      <div>
        <div style={{ marginBottom: '1em' }}>
          <span className="form-item-label">Access Token</span>
          <input
            style={{ width: '100%' }}
            type="password"
            defaultValue={selectedAgentData.data?.twitter_access_token}
            onChange={e =>
              setSelectedAgentData({
                ...selectedAgentData,
                data: {
                  ...selectedAgentData.data,
                  twitter_access_token: e.target.value,
                },
              })
            }
          />
        </div>
      </div>
      <div>
        <div style={{ marginBottom: '1em' }}>
          <span className="form-item-label">Access Token Secret</span>
          <input
            style={{ width: '100%' }}
            type="password"
            value={selectedAgentData.data?.twitter_access_token_secret}
            onChange={e =>
              setSelectedAgentData({
                ...selectedAgentData,
                data: {
                  ...selectedAgentData.data,
                  twitter_access_token_secret: e.target.value,
                },
              })
            }
          />
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <Switch
          label={'Enable Feed'}
          checked={selectedAgentData.data?.twitter_feed_enable === 'on'}
          onChange={e => {
            setSelectedAgentData({
              ...selectedAgentData,
              data: {
                ...selectedAgentData.data,
                twitter_feed_enable:
                  selectedAgentData?.data?.twitter_feed_enable === 'on'
                    ? 'off'
                    : 'on',
              },
            })
          }}
        />
      </div>

      {selectedAgentData.data?.twitter_feed_enable === 'on' && (
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
                style={{ width: '100%' }}
                type="text"
                defaultValue={selectedAgentData.data?.twitter_stream_rules}
                placeholder={'grumpy cat OR #catmeme, #MadeWithMagick'}
                onChange={e => {
                  setSelectedAgentData({
                    ...selectedAgentData,
                    data: {
                      ...selectedAgentData.data,
                      twitter_stream_rules: e.target.value,
                    },
                  })
                }}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Modal>
  )
}

export default VariableModal
