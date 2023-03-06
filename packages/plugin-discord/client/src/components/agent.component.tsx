import axios from 'axios'
import { useSnackbar } from 'notistack'
import React, { FC, useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import { KeyInput } from './utils'
import { debounce } from 'lodash'

type PluginProps = {
  agentData: any
  props
}
import { API_ROOT_URL } from '@magickml/engine'
import { Switch } from '@magickml/client-core'

export const DiscordAgentWindow: FC<any> = props => {
  props = props.props
  const { agentData, setAgentData, update } = props
  const debouncedFunction = debounce((id, data) => update(id, data), 1000)

  const { enqueueSnackbar } = useSnackbar()
  const [playingAudio, setPlayingAudio] = useState(false)

  const testVoice = async () => {
    if (
      (agentData.data?.voice_provider && agentData.data?.voice_character) ||
      playingAudio
    ) {
      if (
        agentData.data?.voice_provider === 'tiktalknet' &&
        agentData.data?.tiktalknet_url?.length <= 0
      ) {
        return
      }

      const resp = await axios.get(`${API_ROOT_URL}/text_to_speech`, {
        params: {
          text: 'Hello there! How are you?',
          voice_provider: agentData.data?.voice_provider,
          voice_character: agentData.data?.voice_character,
          voice_language_code: agentData.data?.voice_language_code,
          tiktalknet_url: agentData.data?.tiktalknet_url,
        },
      })

      const url =
        agentData.data?.voice_provider === 'google' ||
        agentData.data?.voice_provider === 'tiktalknet'
          ? (import.meta as any).env.VITE_APP_FILE_SERVER_URL + '/' + resp.data
          : resp.data
      if (url && url.length > 0) {
        setPlayingAudio(true)
        console.log('url:', url)
        const audio = new Audio(url)
        audio.onended = function () {
          setPlayingAudio(false)
        }
        audio.play()
      }
    } else {
      enqueueSnackbar(
        'You need to setup the voice variables to test the voice or already playing another test',
        {
          variant: 'error',
        }
      )
    }
  }
  return (
    <div
      style={{
        backgroundColor: '#222',
        padding: '2em',
        position: 'relative',
      }}
    >
      <h3>Discord</h3>
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
          checked={agentData.data?.discord_enabled}
          onChange={e => {
            debouncedFunction(agentData.id, {
              ...agentData,
              data: {
                ...agentData.data,
                discord_enabled: e.target.checked,
              },
            })
            setAgentData({
              ...agentData,
              data: {
                ...agentData.data,
                discord_enabled: e.target.checked,
              },
            })
          }}
          style={{ float: 'right' }}
        />
      </div>

      {agentData.data?.discord_enabled && (
        <>
          <Grid container>
            <Grid item xs={12}>
              <div className="form-item">
                <span className="form-item-label">API Key</span>
                <KeyInput
                  value={agentData.data?.discord_api_key}
                  setValue={value =>
                    setAgentData({
                      ...agentData,
                      data: {
                        ...agentData.data,
                        discord_api_key: value,
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
                  defaultValue={agentData.data?.discord_starting_words}
                  placeholder={'Starting Words (,)'}
                  onChange={e => {
                    setAgentData({
                      ...agentData,
                      data: {
                        ...agentData.data,
                        discord_starting_words: e.target.value,
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
                  defaultValue={agentData.data?.discord_bot_name_regex}
                  placeholder={'Bot Name Regex'}
                  onChange={e => {
                    setAgentData({
                      ...agentData,
                      data: {
                        ...agentData.data,
                        discord_bot_name_regex: e.target.value,
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
                  defaultValue={agentData.data?.discord_bot_name}
                  placeholder={'Bot Name'}
                  onChange={e => {
                    setAgentData({
                      ...agentData,
                      data: {
                        ...agentData.data,
                        discord_bot_name: e.target.value,
                      },
                    })
                  }}
                />
              </div>
            </Grid>
          </Grid>

          <div style={{ position: 'relative' }}>
            <Switch
              label={'Voice Enabled'}
              checked={agentData.data?.use_voice === 'on'}
              onChange={e => {
                debouncedFunction(agentData.id, {
                  ...agentData,
                  data: {
                    ...agentData.data,
                    use_voice:
                      agentData?.data?.use_voice === 'on' ? 'off' : 'on',
                  },
                })

                setAgentData({
                  ...agentData,
                  data: {
                    ...agentData.data,
                    use_voice:
                      agentData?.data?.use_voice === 'on' ? 'off' : 'on',
                  },
                })
              }}
            />
          </div>

          {agentData.data?.use_voice === 'on' && (
            <>
              <Grid container>
                <Grid item xs={3} style={{ paddingRight: '1em' }}>
                  <div className="form-item">
                    <span className="form-item-label">Voice Provider</span>
                    <select
                      name="voice_provider"
                      id="voice_provider"
                      className="select"
                      value={agentData.data?.voice_provider ?? 'Google'}
                      onChange={e => {
                        setAgentData({
                          ...agentData,
                          data: {
                            ...agentData.data,
                            voice_provider: e.target.value,
                          },
                        })
                      }}
                    >
                      <option value={'google'}>Google</option>
                      <option value={'tiktalknet'}>Tiktalknet</option>
                    </select>
                  </div>
                </Grid>
                <Grid item xs={3} style={{ paddingRight: '1em' }}>
                  <div className="form-item">
                    <span className="form-item-label">Character</span>
                    {agentData.data?.voice_provider === 'google' ? (
                      <select
                        className="select"
                        name="voice_character"
                        id="voice_character"
                        value={
                          agentData.data?.voice_character ?? 'en-US-Standard-A'
                        }
                        onChange={e => {
                          setAgentData({
                            ...agentData,
                            data: {
                              ...agentData.data,
                              voice_character: e.target.value,
                            },
                          })
                        }}
                      >
                        <option value={'en-US-Standard-A'}>
                          en-US-Standard-A
                        </option>
                        <option value={'en-US-Standard-B'}>
                          en-US-Standard-B
                        </option>
                        <option value={'en-US-Standard-C'}>
                          en-US-Standard-C
                        </option>
                        <option value={'en-US-Standard-D'}>
                          en-US-Standard-D
                        </option>
                        <option value={'en-US-Standard-E'}>
                          en-US-Standard-E
                        </option>
                        <option value={'en-US-Standard-F'}>
                          en-US-Standard-F
                        </option>
                        <option value={'en-US-Standard-G'}>
                          en-US-Standard-G
                        </option>
                        <option value={'en-US-Standard-H'}>
                          en-US-Standard-H
                        </option>
                        <option value={'en-US-Standard-I'}>
                          en-US-Standard-I
                        </option>
                        <option value={'en-US-Standard-J'}>
                          en-US-Standard-J
                        </option>
                        <option value={'en-US-Wavenet-A'}>
                          en-US-Wavenet-A
                        </option>
                        <option value={'en-US-Wavenet-B'}>
                          en-US-Wavenet-B
                        </option>
                        <option value={'en-US-Wavenet-C'}>
                          en-US-Wavenet-C
                        </option>
                        <option value={'en-US-Wavenet-D'}>
                          en-US-Wavenet-D
                        </option>
                        <option value={'en-US-Wavenet-E'}>
                          en-US-Wavenet-E
                        </option>
                        <option value={'en-US-Wavenet-F'}>
                          en-US-Wavenet-F
                        </option>
                        <option value={'en-US-Wavenet-G'}>
                          en-US-Wavenet-G
                        </option>
                        <option value={'en-US-Wavenet-H'}>
                          en-US-Wavenet-H
                        </option>
                        <option value={'en-US-Wavenet-I'}>
                          en-US-Wavenet-I
                        </option>
                        <option value={'en-US-Wavenet-J'}>
                          en-US-Wavenet-J
                        </option>
                      </select>
                    ) : (
                      <select
                        name="voice_character"
                        id="voice_character"
                        className="select"
                        value={agentData.data?.voice_character}
                        onChange={e => {
                          setAgentData({
                            ...agentData,
                            data: {
                              ...agentData.data,
                              voice_character: e.target.value,
                            },
                          })
                        }}
                      >
                        <option hidden></option>
                        <option value={'1_ztAbe5YArCMwyyQ_G9lUiz74ym5xJKC'}>
                          test voice 1
                        </option>
                        <option value={'1_ztAbe5YArCMwyyQ_G9lUiz74ym5xJKC'}>
                          text voice 2
                        </option>
                        <option value={'17PEym3KJs4mXLEjQC9kZvtG17plEcCM4'}>
                          jarad
                        </option>
                        <option value={'1QnOliOAmerMUNuo2wXoH-YoainoSjZen'}>
                          twilight sparkle
                        </option>
                      </select>
                    )}
                  </div>
                </Grid>
                <Grid item xs={3} style={{ paddingRight: '1em' }}>
                  <div className="form-item">
                    <span className="form-item-label">Language Code</span>
                    <select
                      name="voice_language_code"
                      id="voice_language_code"
                      className="select"
                      value={agentData.data?.voice_language_code ?? 'none'}
                      onChange={e => {
                        setAgentData({
                          ...agentData,
                          data: {
                            ...agentData.data,
                            voice_language_code: e.target.value,
                          },
                        })
                      }}
                    >
                      <option value={'en-US'}>none</option>
                      <option value={'en-GB'}>en-GB</option>
                    </select>
                  </div>
                </Grid>
                <Grid item xs={3}>
                  {agentData.data?.voice_provider === 'tiktalknet' && (
                    <div className="form-item">
                      <span className="form-item-label">Provider URL</span>
                      <input
                        type="text"
                        defaultValue={agentData.data?.tiktalknet_url}
                        placeholder={'http://voice.metaverse.com/tts'}
                        onChange={e => {
                          setAgentData({
                            ...agentData,
                            data: {
                              ...agentData.data,
                              tiktalknet_url: e.target.value,
                            },
                          })
                        }}
                      />
                    </div>
                  )}
                </Grid>
              </Grid>
              <div className="form-item">
                <button
                  onClick={() => testVoice()}
                  style={{ marginRight: '10px', cursor: 'pointer' }}
                >
                  Test
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
