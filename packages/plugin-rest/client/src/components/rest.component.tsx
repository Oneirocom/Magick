import React, { FC, useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import { Switch } from '@magickml/client-core'
import md5 from 'md5'
import { Button, Input } from '@mui/material'
import { enqueueSnackbar } from 'notistack'

const randomHash = () => {
  return md5(Math.random().toString())
}

export const RestAgentWindow: FC<any> = props => {
  props = props.props
  const { agentData, setAgentData } = props

  const [showGetExample, setShowGetExample] = useState(false)
  const [showPostExample, setShowPostExample] = useState(false)

  useEffect(() => {
    if (!agentData.data?.rest_api_key) {
      setAgentData({
        ...agentData,
        data: {
          ...agentData.data,
          rest_api_key: randomHash(),
        },
      })
    }
  }, [agentData.data])

  return (
    <div
      style={{
        backgroundColor: '#222',
        padding: '2em',
        position: 'relative',
      }}
    >
      <h3>REST API</h3>
      <div style={{ position: 'absolute', right: '1em', top: '0' }}>
        <Switch
          checked={agentData.data?.rest_enabled}
          onChange={e => {
            setAgentData({
              ...agentData,
              data: {
                ...agentData.data,
                rest_enabled: e.target.checked ? true : false,
              },
            })
          }}
          label={''}
        />
      </div>
      {agentData.data?.rest_enabled && (
        <div className="form-item">
          <Grid container>
            <Grid item xs={12}>
              <span className="form-item-label">API Key</span>
              <Input
                value={agentData.data?.rest_api_key}
                readOnly
                style={{ width: '20em' }}
                onClick={() => {
                  navigator.clipboard.writeText(agentData.data?.rest_api_key)
                  enqueueSnackbar('Copied to clipboard', { variant: 'success' })
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <span style={{ marginTop: '2em' }} className="form-item-label">
                URL
              </span>
              <Input
                value={`${import.meta.env.VITE_APP_API_URL}/api/${
                  agentData.data?.rest_api_key
                }`}
                readOnly
                style={{
                  width: '100%',
                  textDecoration: 'none',
                  border: 'none',
                }}
                onClick={() => {
                  navigator.clipboard.writeText(agentData.data?.rest_api_key)
                  enqueueSnackbar('Copied to clipboard', { variant: 'success' })
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <span style={{ marginTop: '2em' }} className="form-item-label">
                <Button
                  variant="contained"
                  onClick={() => {
                    setShowGetExample(!showGetExample)
                  }}
                  style={{
                    float: 'right',
                  }}
                >
                  {showGetExample ? 'Hide' : 'Show'}
                </Button>
                <h4>GET Example</h4>
              </span>
              {showGetExample && (
                <div>
                  <span className="form-item-label">cURL</span>
                  <Input
                    value={`curl -X GET ${
                      import.meta.env.VITE_APP_API_URL
                    }/api/${agentData.data?.rest_api_key}?text=Hello+World`}
                    readOnly
                    style={{
                      width: '100%',
                      textDecoration: 'none',
                      border: 'none',
                    }}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `curl -X GET ${import.meta.env.VITE_APP_API_URL}/api/${
                          agentData.data?.rest_api_key
                        }?text=Hello+World`
                      )
                      enqueueSnackbar('Copied to clipboard', {
                        variant: 'success',
                      })
                    }}
                  />
                  {/* now in fetch */}
                  <span
                    style={{ marginTop: '1em' }}
                    className="form-item-label"
                  >
                    Fetch
                  </span>
                  <Input
                    value={`fetch('${import.meta.env.VITE_APP_API_URL}/api/${
                      agentData.data?.rest_api_key
                    }?text=Hello+World')`}
                    readOnly
                    style={{
                      width: '100%',
                      textDecoration: 'none',
                      border: 'none',
                    }}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `fetch('${import.meta.env.VITE_APP_API_URL}/api/${
                          agentData.data?.rest_api_key
                        }?text=Hello+World')`
                      )
                    }}
                  />
                  {/* now for python */}
                  <span
                    style={{ marginTop: '1em' }}
                    className="form-item-label"
                  >
                    Python
                  </span>
                  <textarea
                    value={`import requests
requests.get('${import.meta.env.VITE_APP_API_URL}/api/${
                      agentData.data?.rest_api_key
                    }?text=Hello+World')`}
                    readOnly
                    style={{
                      resize: 'none',
                      width: '100%',
                      textDecoration: 'none',
                      border: 'none',
                    }}
                    onClick={() => {
                      navigator.clipboard.writeText(`import requests
requests.get('${import.meta.env.VITE_APP_API_URL}/api/${
                        agentData.data?.rest_api_key
                      }?text=Hello+World')`)
                    }}
                  />
                </div>
              )}
            </Grid>
            <Grid item xs={12}>
              <span style={{ marginTop: '2em' }} className="form-item-label">
                <Button
                  variant="contained"
                  onClick={() => {
                    setShowPostExample(!showPostExample)
                  }}
                  style={{
                    float: 'right',
                  }}
                >
                  {showPostExample ? 'Hide' : 'Show'}
                </Button>
                <h4>POST Example</h4>
              </span>
              {showPostExample && (
                <div>
                  <span className="form-item-label">cURL</span>
                  <Input
                    value={`curl -X POST -H "Content-Type: application/json" -d '{"text": "Hello World"}' ${
                      import.meta.env.VITE_APP_API_URL
                    }/api/${agentData.data?.rest_api_key}?text=Hello+World`}
                    readOnly
                    style={{
                      width: '100%',
                      textDecoration: 'none',
                      border: 'none',
                    }}
                    onClick={() => {
                      // copy the value of the input
                      navigator.clipboard.writeText(
                        `curl -X POST -H "Content-Type: application/json" -d '{"text": "Hello World"}' ${
                          import.meta.env.VITE_APP_API_URL
                        }/api/${agentData.data?.rest_api_key}?text=Hello+World`
                      )
                      enqueueSnackbar('Copied to clipboard', {
                        variant: 'success',
                      })
                    }}
                  />
                  {/* now in fetch */}
                  <span
                    style={{ marginTop: '1em' }}
                    className="form-item-label"
                  >
                    Fetch
                  </span>
                  <Input
                    value={`fetch('${import.meta.env.VITE_APP_API_URL}/api/${
                      agentData.data?.rest_api_key
                    }', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ text: 'Hello World' }),
})`}
                    readOnly
                    onClick={() => {
                      // copy the value of the input
                      navigator.clipboard.writeText(
                        `fetch('${import.meta.env.VITE_APP_API_URL}/api/${
                          agentData.data?.rest_api_key
                        }', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ text: 'Hello World' }),
})`
                      )
                    }}
                    style={{
                      width: '100%',
                      textDecoration: 'none',
                      border: 'none',
                    }}
                  />
                  {/* now for python */}
                  <span
                    style={{ marginTop: '1em' }}
                    className="form-item-label"
                  >
                    Python
                  </span>
                  <textarea
                    value={`import requests
requests.post('${import.meta.env.VITE_APP_API_URL}/api/${
                      agentData.data?.rest_api_key
                    }', json={"text": "Hello World"})`}
                    readOnly
                    // no resize
                    style={{
                      resize: 'none',
                      width: '100%',
                      textDecoration: 'none',
                      border: 'none',
                    }}
                  />
                </div>
              )}
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  )
}
