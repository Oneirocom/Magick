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
  const { selectedAgentData, setSelectedAgentData } = props

  const [showGetExample, setShowGetExample] = useState(false)
  const [showPostExample, setShowPostExample] = useState(false)

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
          checked={selectedAgentData.data?.rest_enabled}
          onChange={e => {
            setSelectedAgentData({
              ...selectedAgentData,
              data: {
                ...selectedAgentData.data,
                rest_enabled: e.target.checked ? true : false,
              },
            })
          }}
          label={''}
        />
      </div>
      {selectedAgentData.data?.rest_enabled && (
        <div className="form-item">
          <Grid container>
            <Grid item xs={12}>
              <span className="form-item-label">API Key</span>
              <Input
                value={selectedAgentData.data?.rest_api_key}
                readOnly
                style={{ width: '20em' }}
                onClick={() => {
                  navigator.clipboard.writeText(selectedAgentData.data?.rest_api_key)
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
                  selectedAgentData.data?.rest_api_key
                }`}
                readOnly
                style={{
                  width: '100%',
                  textDecoration: 'none',
                  border: 'none',
                }}
                onClick={() => {
                  navigator.clipboard.writeText(selectedAgentData.data?.rest_api_key)
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
                    color: 'white',
                    backgroundColor: 'purple'
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
                    }/api/${selectedAgentData.id}?apiKey=${
                      selectedAgentData.data?.rest_api_key
                    }&content=Hello+World`}
                    readOnly
                    style={{
                      width: '100%',
                      textDecoration: 'none',
                      border: 'none',
                    }}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `curl -X GET ${import.meta.env.VITE_APP_API_URL}/api/${
                          selectedAgentData.id
                        }?apiKey=${
                          selectedAgentData.data?.rest_api_key
                        }&content=Hello+World`
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
                      selectedAgentData.id
                    }?apiKey=${
                      selectedAgentData.data?.rest_api_key
                    }&content=Hello+World')`}
                    readOnly
                    style={{
                      width: '100%',
                      textDecoration: 'none',
                      border: 'none',
                    }}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `fetch('${import.meta.env.VITE_APP_API_URL}/api/${
                          selectedAgentData.id
                        }?apiKey=${
                          selectedAgentData.data?.rest_api_key
                        }&content=Hello+World')`
                      )
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
                    color: 'white',
                    backgroundColor: 'purple'
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
                    value={`curl -X POST -H "Content-Type: application/json" -d '{"apiKey": ${
                      selectedAgentData.data?.rest_api_key
                    }", "content": "Hello World"}' ${
                      import.meta.env.VITE_APP_API_URL
                    }/api/${selectedAgentData.id}`}
                    readOnly
                    style={{
                      width: '100%',
                      textDecoration: 'none',
                      border: 'none',
                    }}
                    onClick={() => {
                      // copy the value of the input
                      navigator.clipboard.writeText(
                        `curl -X POST -H "Content-Type: application/json" -d '{"content": "Hello World"}' ${
                          import.meta.env.VITE_APP_API_URL
                        }/api/${selectedAgentData.data?.rest_api_key}`
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
                      selectedAgentData.id
                    }', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ apiKey: '${
    selectedAgentData.data?.rest_api_key
  }', content: 'Hello World' }),
})`}
                    readOnly
                    onClick={() => {
                      // copy the value of the input
                      navigator.clipboard.writeText(
                        `fetch('${import.meta.env.VITE_APP_API_URL}/api/${
                          selectedAgentData.id
                        }', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ apiKey: '${
    selectedAgentData.data?.rest_api_key
  }', content: 'Hello World' }),
})`
                      )
                    }}
                    style={{
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
