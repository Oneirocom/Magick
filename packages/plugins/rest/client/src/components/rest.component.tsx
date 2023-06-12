// DOCUMENTED
import React, { FC, useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import { Modal, Switch } from '@magickml/client-core'
import md5 from 'md5'
import { Button, Input } from '@mui/material'
import { enqueueSnackbar } from 'notistack'
import { debounce } from 'lodash'
import { API_ROOT_URL } from '@magickml/core'

/**
 * Generate a random hash.
 * @returns {string} - A random hash generated using the md5 function.
 */
const randomHash = (): string => {
  return md5(Math.random().toString())
}

/**
 * RestAgentWindow component enables users to control the REST API settings.
 * @param {object} props - Props for the RestAgentWindow component.
 * @returns {JSX.Element} - RestAgentWindow component.
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

  useEffect(() => {
    if (!selectedAgentData.data?.rest_api_key) {
      setSelectedAgentData({
        ...selectedAgentData,
        data: {
          ...selectedAgentData.data,
          rest_api_key: randomHash(),
        },
      })
    }
  }, [selectedAgentData.data])

  return (
    <>
      <div
        style={{
          backgroundColor: '#222',
          padding: '2em',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: disable ? 'none' : 'auto',
          opacity: disable ? 0.2 : 1,
        }}
      >
        <h3>REST API</h3>
        <div
          style={{
            display: 'flex',
            paddingTop: '1em',
          }}
        >
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
                <span className="form-item-label modal-element">Agent ID</span>
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
                <span
                  style={{ marginTop: '2em' }}
                  className="form-item-label modal-element"
                >
                  API Key
                </span>
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
                <span
                  style={{ marginTop: '2em' }}
                  className="form-item-label modal-element"
                >
                  URL
                </span>
                <Input
                  value={`${API_ROOT_URL}/api/${selectedAgentData.id}`}
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
                  <h4>GET Example</h4>
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
                      value={`fetch('${API_ROOT_URL}/api/${selectedAgentData.id}?apiKey=${selectedAgentData.data?.rest_api_key}&content=Hello+World')`}
                      readOnly
                      className="modal-element"
                      style={{
                        textDecoration: 'none',
                        border: 'none',
                      }}
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `fetch('${API_ROOT_URL}/api/${selectedAgentData.id}?apiKey=${selectedAgentData.data?.rest_api_key}&content=Hello+World')`
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
                  <h4>POST Example</h4>
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
                      value={`fetch('${API_ROOT_URL}/api', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: '${selectedAgentData.id}',
    apiKey: '${selectedAgentData.data?.rest_api_key}',
    content: 'Hello World'
  }),
})`}
                      readOnly
                      onClick={() => {
                        // copy the value of the input
                        navigator.clipboard.writeText(
                          `fetch('${API_ROOT_URL}/api/${selectedAgentData.id}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ apiKey: '${selectedAgentData.data?.rest_api_key}', content: 'Hello World' }),
})`
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
                  <h4>PUT Example</h4>
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
                      value={`fetch('${API_ROOT_URL}/api', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: '${selectedAgentData.id}',
    apiKey: '${selectedAgentData.data?.rest_api_key}',
    content: 'Hello World'
  }),
})`}
                      readOnly
                      onClick={() => {
                        // copy the value of the input
                        navigator.clipboard.writeText(
                          `fetch('${API_ROOT_URL}/api', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: '${selectedAgentData.id}',
    apiKey: '${selectedAgentData.data?.rest_api_key}',
    content: 'Hello World'
  }),
})`
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
                  <h4>DELETE Example</h4>
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
                      value={`fetch('${API_ROOT_URL}/api/${selectedAgentData.id}?apiKey=${selectedAgentData.data?.rest_api_key}&content=Hello+World', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    apiKey: '${selectedAgentData.data?.rest_api_key}',
    content: 'Hello World' // optional
  }),
})`}
                      readOnly
                      className="modal-element"
                      style={{
                        textDecoration: 'none',
                        border: 'none',
                      }}
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `fetch('${API_ROOT_URL}/api/${selectedAgentData.id}?apiKey=${selectedAgentData.data?.rest_api_key}&content=Hello+World', {
method: 'DELETE',
headers: {
  'Content-Type': 'application/json',
},
body: JSON.stringify({
  apiKey: '${selectedAgentData.data?.rest_api_key}',
  content: 'Hello World' // optional
}),
})`
                        )
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
