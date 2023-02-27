import axios from 'axios'
import { useSnackbar } from 'notistack'
import React, { FC, useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import { KeyInput } from './utils'
type PluginProps = {
  agentData: any
  props
}
import { API_ROOT_URL } from '@magickml/engine'
import { Switch } from '@magickml/client-core'

export const DiscordAgentWindow: FC<any> = props => {
  props = props.props
  const { agentData, setAgentData } = props
  const { enqueueSnackbar } = useSnackbar()
  const [playingAudio, setPlayingAudio] = useState(false)

  const testVoice = async () => {
    if ((voice_provider && voice_character) || playingAudio) {
      if (voice_provider === 'tiktalknet' && tiktalknet_url?.length <= 0) {
        return
      }

      const resp = await axios.get(`${API_ROOT_URL}/text_to_speech`, {
        params: {
          text: 'Hello there! How are you?',
          voice_provider: voice_provider,
          voice_character: voice_character,
          voice_language_code: voice_language_code,
          tiktalknet_url: tiktalknet_url,
        },
      })

      const url =
        voice_provider === 'google' || voice_provider === 'tiktalknet'
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
        padding: '1em',
        position: 'relative',
      }}
    >
      <Switch
        label={null}
        checked={agentData.discord_enabled}
        onChange={e => {
          setAgentData({...agentData, discord_enabled: e.target.checked})
        }}
        style={{ float: 'right' }}
      />
      <h1>Discord</h1>
      {agentData.discord_enabled && (
        <>
          <Grid container style={{ padding: '1em' }}>
            <Grid item xs={6}>
              <div className="form-item">
                <span className="form-item-label">API Key</span>
                <KeyInput
                  value={agentData.discord_api_key}
                  setValue={e => setAgentData({...agentData, discord_api_key: e.target.value})}
                  secret={true}
                />
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="form-item">
                <span className="form-item-label">Starting Words (,)</span>
                <input
                  type="text"
                  defaultValue={agentData.discord_starting_words}
                  onChange={e => {
                    setAgentData({...agentData, discord_starting_words: e.target.value})
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="form-item">
                <span className="form-item-label">Bot Name Regex</span>
                <input
                  type="text"
                  defaultValue={agentData.discord_bot_name_regex}
                  onChange={e => {
                    setAgentData({...agentData, discord_bot_name_regex: e.target.value})
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="form-item">
                <span className="form-item-label">Bot Name</span>
                <input
                  type="text"
                  defaultValue={agentData.discord_bot_name}
                  onChange={e => {
                    setAgentData({...agentData, discord_bot_name: e.target.value})
                  }}
                />
              </div>
            </Grid>
          </Grid>

          <Switch
            label={null}
            checked={agentData.use_voice}
            onChange={e => {
              setAgentData({...agentData, use_voice: e.target.value})
            }}
            style={{ float: 'right' }}
          />

          <h3>Voice Enabled</h3>

          {agentData.use_voice && (
            <>
              <Grid container>
                <Grid item xs={3}>
                  <div className="form-item agent-select">
                    <span className="form-item-label">Voice Provider</span>
                    <select
                      name="voice_provider"
                      id="voice_provider"
                      value={agentData.voice_provider}
                      onChange={e => {
                        setAgentData({...agentData, voice_provider: e.target.value, voice_character: ''})
                      }}
                    >
                      <option hidden></option>
                      <option value={'google'}>Google</option>
                      <option value={'tiktalknet'}>Tiktalknet</option>
                    </select>
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div className="form-item">
                    <span className="form-item-label">Character</span>
                    {agentData.voice_provider === 'google' ? (
                      <select
                        name="voice_character"
                        id="voice_character"
                        value={agentData.voice_character}
                        onChange={e => {
                          setAgentData({...agentData, voice_character: e.target.value})
                        }}
                      >
                        <option hidden></option>
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
                        value={agentData.voice_character}
                        onChange={e => {
                          setAgentData({...agentData, voice_character: e.target.value})
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
                <Grid item xs={3}>
                  <div className="form-item">
                    <span className="form-item-label">Language Code</span>
                    <select
                      name="voice_language_code"
                      id="voice_language_code"
                      value={agentData.voice_language_code}
                      onChange={e => {
                        setAgentData({...agentData, voice_language_code: e.target.value})
                      }}
                    >
                      <option value={'en-US'}>none</option>
                      <option value={'en-US'}>en-GB</option>
                    </select>
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div className="form-item">
                    <span className="form-item-label">
                      Voice Default Phrases (n1|n2|...|nN)
                    </span>
                    <input
                      type="text"
                      defaultValue={agentData.voice_default_phrases}
                      onChange={e => {
                        setAgentData({...agentData, voice_language_code: e.target.value})
                      }}
                    />
                  </div>
                </Grid>
                <Grid item xs={3}>
                  {agentData.voice_provider === 'tiktalknet' && (
                    <div className="form-item">
                      <span className="form-item-label">
                        Tiktalknet URL - URL where Tiktalknet is hosted and the
                        requests will be sent there
                      </span>
                      <input
                        type="text"
                        defaultValue={agentData.tiktalknet_url}
                        onChange={e => {
                          setAgentData({...agentData, tiktalknet_url: e.target.value})
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
