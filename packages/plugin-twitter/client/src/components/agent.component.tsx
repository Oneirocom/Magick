import React, { FC, useState } from 'react'
import Grid from '@mui/material/Grid'
import { KeyInput } from './utils'
import { debounce } from 'lodash'
import { Switch } from '@magickml/client-core'

export const TwitterAgentWindow: FC<any> = props => {
  props = props.props
  const { selectedAgentData, setSelectedAgentData, update } = props
  const debouncedFunction = debounce((id, data) => update(id, data), 1000)

  return (
    <div
      style={{
        backgroundColor: '#222',
        padding: '2em',
        position: 'relative',
      }}
    >
      <h3>Twitter</h3>
      <div
        style={{
          position: 'absolute',
          right: '1em',
          top: '0',
          paddingTop: '1em',
        }}
      >
        <Switch
          label={null}
          checked={selectedAgentData.data?.twitter_enabled}
          onChange={e => {
            debouncedFunction(selectedAgentData.id, {
              ...selectedAgentData,
              data: {
                ...selectedAgentData.data,
                twitter_enabled: e.target.checked,
              },
            })
            setSelectedAgentData({
              ...selectedAgentData,
              data: {
                ...selectedAgentData.data,
                twitter_enabled: e.target.checked,
              },
            })
          }}
          style={{ float: 'right' }}
        />
      </div>

      {selectedAgentData.data?.twitter_enabled && (
        <>
          <Grid container>
          <Grid item xs={3} style={{ paddingRight: '1em' }}>
          <span className="form-item-label">User ID</span>
                <input
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
            </Grid>
            <Grid item xs={3}>
                <span className="form-item-label">Bearer Token (API v2)</span>
                <KeyInput
                  value={selectedAgentData.data?.twitter_bearer_token}
                  setValue={value =>
                    setSelectedAgentData({
                      ...selectedAgentData,
                      data: {
                        ...selectedAgentData.data,
                        twitter_bearer_token: value,
                      },
                    })
                  }
                  secret={true}
                />
            </Grid>
            <Grid item xs={3}>
                <span className="form-item-label">App Token</span>
                <KeyInput
                  value={selectedAgentData.data?.twitter_app_token}
                  setValue={value =>
                    setSelectedAgentData({
                      ...selectedAgentData,
                      data: {
                        ...selectedAgentData.data,
                        twitter_app_token: value,
                      },
                    })
                  }
                  secret={true}
                />
            </Grid>
            <Grid item xs={3}>
                <span className="form-item-label">App Token Secret</span>
                <KeyInput
                  value={selectedAgentData.data?.twitter_app_token_secret}
                  setValue={value =>
                    setSelectedAgentData({
                      ...selectedAgentData,
                      data: {
                        ...selectedAgentData.data,
                        twitter_app_token_secret: value,
                      },
                    })
                  }
                  secret={true}
                />
            </Grid>
            <Grid item xs={3}>
                <span className="form-item-label">Access Token</span>
                <KeyInput
                  value={selectedAgentData.data?.twitter_access_token}
                  setValue={value =>
                    setSelectedAgentData({
                      ...selectedAgentData,
                      data: {
                        ...selectedAgentData.data,
                        twitter_access_token: value,
                      },
                    })
                  }
                  secret={true}
                />
            </Grid>
            <Grid item xs={3}>
                <span className="form-item-label">Access Token Secret</span>
                <KeyInput
                  value={selectedAgentData.data?.twitter_access_token_secret}
                  setValue={value =>
                    setSelectedAgentData({
                      ...selectedAgentData,
                      data: {
                        ...selectedAgentData.data,
                        twitter_access_token_secret: value,
                      },
                    })
                  }
                  secret={true}
                />
            </Grid>
          </Grid>

          <div style={{ position: 'relative' }}>
            <Switch
              label={'Enable Feed'}
              checked={selectedAgentData.data?.twitter_feed_enable === 'on'}
              onChange={e => {
                debouncedFunction(selectedAgentData.id, {
                  ...selectedAgentData,
                  data: {
                    ...selectedAgentData.data,
                    twitter_feed_enable:
                      selectedAgentData?.data?.twitter_feed_enable === 'on' ? 'off' : 'on',
                  },
                })

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
                <Grid item xs={3}>
                      <span className="form-item-label">Keywords</span>
                      <input
                        type="text"
                        defaultValue={selectedAgentData.data?.twitter_feed_keywords}
                        placeholder={'food, technology'}
                        onChange={e => {
                          setSelectedAgentData({
                            ...selectedAgentData,
                            data: {
                              ...selectedAgentData.data,
                              twitter_feed_keywords: e.target.value,
                            },
                          })
                        }}
                      />
                </Grid>
                <Grid item xs={3}>
                      <span className="form-item-label">User IDs</span>
                      <input
                        type="text"
                        defaultValue={selectedAgentData.data?.twitter_feed_userids}
                        placeholder={'gpt4bot, magickml'}
                        onChange={e => {
                          setSelectedAgentData({
                            ...selectedAgentData,
                            data: {
                              ...selectedAgentData.data,
                              twitter_feed_userids: e.target.value,
                            },
                          })
                        }}
                      />
                </Grid>
              </Grid>
            </>
          )}
        </>
      )}
    </div>
  )
}
