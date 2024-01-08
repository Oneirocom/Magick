// DOCUMENTED
import React, { FC, useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import { Modal, Switch } from 'client/core'
import md5 from 'md5'
import { Button, Input } from '@mui/material'
import { enqueueSnackbar } from 'notistack'
import { debounce } from 'lodash'
import { API_ROOT_URL } from 'shared/config'
import { Tooltip } from '@mui/material'

function removeTrailingSlash(url) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}


const fetchGetExample = (selectedAgentData, content) => `
    fetch("${removeTrailingSlash(API_ROOT_URL)}/api/${selectedAgentData.id
  }?content=${encodeURIComponent(content)}", {
    method: 'GET',
    headers: {
        'Authorization': ${selectedAgentData.data?.rest_api_key}
    }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
    console.error('Error:', error);
    });
`

const fetchDeleteExample = (selectedAgentData, content) => `
    fetch("${removeTrailingSlash(API_ROOT_URL)}/api/${selectedAgentData.id
  }?content=${encodeURIComponent(content)}", {
    method: 'GET',
    headers: {
        'Authorization': ${selectedAgentData.data?.rest_api_key}
    }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
    console.error('Error:', error);
    });
`

const fetchPutExample = (selectedAgentData, content) => `
    fetch("${removeTrailingSlash(API_ROOT_URL)}/api/${selectedAgentData.id}", {
    method: 'PUT',
    headers: {
        'Authorization': ${selectedAgentData.data?.rest_api_key},
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content: "Hello, world" })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
    console.error('Error:', error);
    });
`

const fetchPostExample = (selectedAgentData, content) => `
    fetch("${removeTrailingSlash(API_ROOT_URL)}/api", {
    method: 'POST',
    headers: {
        'Authorization': ${selectedAgentData.data?.rest_api_key},
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content: "Hellom world", agentId: ${selectedAgentData.id} })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
    console.error('Error:', error);
    });
`

/**
 * RestAgentWindow component enables users to control the REST API settings.
 * @param {object} props - Props for the RestAgentWindow component.
 * @returns {React.JSX.Element} - RestAgentWindow component.
 */
export const RestAgentWindow: FC<any> = props => {
  props = props.props
  const { selectedAgentData, setSelectedAgentData, update } = props
  const debouncedFunction = debounce((id, data) => update(id, data), 500)
  const [showGetExample, setShowGetExample] = useState(false)
  const [showPostExample, setShowPostExample] = useState(false)
  const [showPutExample, setShowPutExample] = useState(false)
  const [showDeleteExample, setShowDeleteExample] = useState(false)
  const [viewMode, setViewMode] = useState<boolean>(false)
  const [checked, setChecked] = useState(selectedAgentData.data?.rest_enabled)
  const [disable, setDisable] = useState(false)

  const handleClose = () => {
    setViewMode(false)
  }

  useEffect(() => {
    if (props.enable['RestPlugin'] === false) {
      setChecked(false)
      setDisable(true)
    }

    if (props.enable['RestPlugin'] === true) {
      setChecked(selectedAgentData.data?.rest_enabled)
      setDisable(false)
    }
  }, [props.enable, selectedAgentData])

  return (
    <>
      <div className='connector-layout'>
        <Tooltip title="add your rest Api seetings here" placement="left" arrow>
          <h3>REST API</h3>
        </Tooltip>
        <div className='controls'>
          <button
            onClick={() => {
              setViewMode(true)
            }}
            style={{ marginRight: '10px', cursor: 'pointer' }}
          >
            View
          </button>
          <Switch
            checked={checked}
            onChange={e => {
              setChecked(!checked)
              debouncedFunction(selectedAgentData.id, {
                ...selectedAgentData,
                data: {
                  ...selectedAgentData.data,
                  rest_enabled: e.target.checked,
                },
              })
              setSelectedAgentData({
                ...selectedAgentData,
                data: {
                  ...selectedAgentData.data,
                  rest_enabled: e.target.checked,
                },
              })
            }}
            label={''}
          />
        </div>
      </div>
      {viewMode && (
        <Modal open={viewMode} onClose={handleClose}>
          <div className="form-item">
            <Grid container>
              <Grid item xs={12}>
                <Tooltip title="add your agentId here" placement="bottom" arrow>
                  <span className="form-item-label modal-element">
                    Agent ID
                  </span>
                </Tooltip>
                <Input
                  value={selectedAgentData.id}
                  readOnly
                  className="modal-element"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedAgentData.id)
                    enqueueSnackbar('Copied to clipboard', {
                      variant: 'success',
                    })
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Tooltip title="add your api key here" placement="bottom" arrow>
                  <span
                    style={{ marginTop: '2em' }}
                    className="form-item-label modal-element"
                  >
                    API Key
                  </span>
                </Tooltip>
                <Input
                  value={selectedAgentData.data?.rest_api_key}
                  readOnly
                  className="modal-element"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      selectedAgentData.data?.rest_api_key
                    )
                    enqueueSnackbar('Copied to clipboard', {
                      variant: 'success',
                    })
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Tooltip title="add your url here" placement="bottom" arrow>
                  <span
                    style={{ marginTop: '2em' }}
                    className="form-item-label modal-element"
                  >
                    URL
                  </span>
                </Tooltip>
                <Input
                  value={`${removeTrailingSlash(API_ROOT_URL)}/api`}
                  readOnly
                  className="modal-element"
                  style={{
                    textDecoration: 'none',
                    border: 'none',
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      selectedAgentData.data?.rest_api_key
                    )
                    enqueueSnackbar('Copied to clipboard', {
                      variant: 'success',
                    })
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <span
                  style={{ marginTop: '2em' }}
                  className="form-item-label modal-element"
                >
                  <Button
                    variant="contained"
                    onClick={() => {
                      setShowGetExample(!showGetExample)
                    }}
                    style={{
                      float: 'right',
                      color: 'white',
                      backgroundColor: 'purple',
                    }}
                  >
                    {showGetExample ? 'Hide' : 'Show'}
                  </Button>
                  <Tooltip title="Your Get url" placement="bottom" arrow>
                    <h4>GET Example</h4>
                  </Tooltip>
                </span>
                {showGetExample && (
                  <div>
                    <span
                      style={{ marginTop: '1em' }}
                      className="form-item-label modal-element"
                    >
                      Fetch
                    </span>

                    <Input
                      value={fetchGetExample(selectedAgentData, 'Hello, World')}
                      readOnly
                      className="modal-element"
                      style={{
                        textDecoration: 'none',
                        border: 'none',
                      }}
                      onClick={() => {
                        navigator.clipboard.writeText(
                          fetchGetExample(selectedAgentData, 'Hello, World')
                        )
                      }}
                    />
                  </div>
                )}
              </Grid>
              <Grid item xs={12}>
                <span
                  style={{ marginTop: '2em' }}
                  className="form-item-label modal-element"
                >
                  <Button
                    variant="contained"
                    onClick={() => {
                      setShowPostExample(!showPostExample)
                    }}
                    style={{
                      float: 'right',
                      color: 'white',
                      backgroundColor: 'purple',
                    }}
                  >
                    {showPostExample ? 'Hide' : 'Show'}
                  </Button>
                  <Tooltip title="Your Post url" placement="bottom" arrow>
                    <h4>POST Example</h4>
                  </Tooltip>
                </span>
                {showPostExample && (
                  <div>
                    <span
                      style={{ marginTop: '1em' }}
                      className="form-item-label modal-element"
                    >
                      Fetch
                    </span>
                    <Input
                      value={fetchPostExample(
                        selectedAgentData,
                        'Hello, World'
                      )}
                      readOnly
                      onClick={() => {
                        // copy the value of the input
                        navigator.clipboard.writeText(
                          fetchPostExample(selectedAgentData, 'Hello, World')
                        )
                      }}
                      className="modal-element"
                      style={{
                        textDecoration: 'none',
                        border: 'none',
                      }}
                    />
                  </div>
                )}
              </Grid>
              <Grid item xs={12}>
                <span
                  style={{ marginTop: '2em' }}
                  className="form-item-label modal-element"
                >
                  <Button
                    variant="contained"
                    onClick={() => {
                      setShowPutExample(!showPutExample)
                    }}
                    style={{
                      float: 'right',
                      color: 'white',
                      backgroundColor: 'purple',
                    }}
                  >
                    {showPutExample ? 'Hide' : 'Show'}
                  </Button>
                  <Tooltip title="Your Put url" placement="bottom" arrow>
                    <h4>PUT Example</h4>
                  </Tooltip>
                </span>
                {showPutExample && (
                  <div>
                    <span
                      style={{ marginTop: '1em' }}
                      className="form-item-label modal-element"
                    >
                      Fetch
                    </span>
                    <Input
                      value={fetchPutExample(selectedAgentData, 'Hello, World')}
                      readOnly
                      onClick={() => {
                        // copy the value of the input
                        navigator.clipboard.writeText(
                          fetchPutExample(selectedAgentData, 'Hello, World')
                        )
                      }}
                      className="modal-element"
                      style={{
                        textDecoration: 'none',
                        border: 'none',
                      }}
                    />
                  </div>
                )}
              </Grid>
              <Grid item xs={12}>
                <span
                  style={{ marginTop: '2em' }}
                  className="form-item-label modal-element"
                >
                  <Button
                    variant="contained"
                    onClick={() => {
                      setShowDeleteExample(!showDeleteExample)
                    }}
                    style={{
                      float: 'right',
                      color: 'white',
                      backgroundColor: 'purple',
                    }}
                  >
                    {showDeleteExample ? 'Hide' : 'Show'}
                  </Button>
                  <Tooltip title="Your Delete url" placement="bottom" arrow>
                    <h4>DELETE Example</h4>
                  </Tooltip>
                </span>
                {showDeleteExample && (
                  <div>
                    <span
                      style={{ marginTop: '1em' }}
                      className="form-item-label modal-element"
                    >
                      Fetch
                    </span>
                    <Input
                      value={fetchDeleteExample(
                        selectedAgentData,
                        'Hello, World'
                      )}
                      readOnly
                      onClick={() => {
                        // copy the value of the input
                        navigator.clipboard.writeText(
                          fetchDeleteExample(selectedAgentData, 'Hello, World')
                        )
                      }}
                      className="modal-element"
                      style={{
                        textDecoration: 'none',
                        border: 'none',
                      }}
                    />
                  </div>
                )}
              </Grid>
            </Grid>
          </div>
        </Modal>
      )}
    </>
  )
}
