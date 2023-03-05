import React, { FC } from 'react'
import Grid from '@mui/material/Grid'
import { KeyInput } from './utils'

import { Switch } from '@magickml/client-core'

export const TwitterAgentWindow: FC<any> = props => {
  props = props.props
  const { selectedAgentData, setSelectedAgentData } = props

  return (
    <div
      style={{
        backgroundColor: '#222',
        padding: '2em',
        position: 'relative',
      }}
    >
      <Switch
        label={null}
        checked={selectedAgentData.data?.twitter_enabled}
        onChange={e => {
          if (!e.target.checked) {
            setSelectedAgentData({
              ...selectedAgentData,
              data: {
                ...selectedAgentData.data,
                use_voice: 'off',
                twitter_bot_name_regex: '',
                twitter_api_key: '',
                twitter_bot_name: '',
                twitter_starting_words: '',
                voice_character: '',
                voice_provider: '',
                voice_language_code: '',
                tiktalknet_url: '',
                twitter_enabled: false,
              },
            })
          } else {
            setSelectedAgentData({
              ...selectedAgentData,
              data: { ...selectedAgentData.data, twitter_enabled: e.target.checked },
            })
          }
        }}
        style={{ float: 'right' }}
      />
      <h3>Twitter</h3>
      {selectedAgentData.data?.twitter_enabled && (
        <>
          <Grid container>
            <Grid item xs={12}>
              <div className="form-item">
                <span className="form-item-label">API Key</span>
                <KeyInput
                  value={selectedAgentData.data?.twitter_api_key}
                  setValue={value =>
                    setSelectedAgentData({
                      ...selectedAgentData,
                      data: {
                        ...selectedAgentData.data,
                        twitter_api_key: value,
                      },
                    })
                  }
                  secret={true}
                />
              </div>
            </Grid>
            <Grid item xs={4} style={{ paddingRight: '1em' }}>
              <div className="form-item">
                <input
                  type="text"
                  defaultValue={selectedAgentData.data?.twitter_starting_words}
                  placeholder={'Starting Words (,)'}
                  onChange={e => {
                    setSelectedAgentData({
                      ...selectedAgentData,
                      data: {
                        ...selectedAgentData.data,
                        twitter_starting_words: e.target.value,
                      },
                    })
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={4} style={{ paddingRight: '1em' }}>
              <div className="form-item">
                <input
                  type="text"
                  defaultValue={selectedAgentData.data?.twitter_bot_name_regex}
                  placeholder={'Bot Name Regex'}
                  onChange={e => {
                    setSelectedAgentData({
                      ...selectedAgentData,
                      data: {
                        ...selectedAgentData.data,
                        twitter_bot_name_regex: e.target.value,
                      },
                    })
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={4} style={{ paddingRight: '1em' }}>
              <div className="form-item">
                <input
                  type="text"
                  defaultValue={selectedAgentData.data?.twitter_bot_name}
                  placeholder={'Bot Name'}
                  onChange={e => {
                    setSelectedAgentData({
                      ...selectedAgentData,
                      data: {
                        ...selectedAgentData.data,
                        twitter_bot_name: e.target.value,
                      },
                    })
                  }}
                />
              </div>
            </Grid>
          </Grid>
        </>
      )}
    </div>
  )
}
