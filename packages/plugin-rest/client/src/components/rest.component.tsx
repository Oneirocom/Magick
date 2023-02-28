import axios from 'axios'
import { useSnackbar } from 'notistack'
import React, { FC, useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import { KeyInput } from './utils'
import { Switch } from '@magickml/client-core'

type PluginProps = {
  agentData: any
  props
}
import { API_ROOT_URL } from '@magickml/engine'

export const RestAgentWindow: FC<any> = props => {
  props = props.props
  const { agentData, setAgentData } = props
  const [rest_enabled, setRestEnabled] = useState(undefined)
  const [rest_api_key, setRestApiKey] = useState('')
  const { enqueueSnackbar } = useSnackbar()
  const [rest_starting_words, setRestStartingWords] = useState('')
  const [rest_bot_name_regex, setRestBotNameRegex] = useState('')
  const [rest_bot_name, setRestBotName] = useState('')
  const [rest_use_voice, setUseVoice] = useState(false)
  const [rest_voice_provider, setVoiceProvider] = useState<string | null>(null)
  const [rest_voice_character, setVoiceCharacter] = useState('')
  const [rest_voice_language_code, setVoiceLanguageCode] = useState('')
  const [rest_voice_default_phrases, setVoiceDefaultPhrases] = useState('')
  const [rest_tiktalknet_url, setTikTalkNetUrl] = useState('')
  const [playingAudio, setPlayingAudio] = useState(false)

  useEffect(() => {
    if (agentData !== null && agentData !== undefined) {
      console.log(agentData)
      setRestEnabled(agentData.data?.rest_enabled)
      setRestApiKey(agentData.data?.rest_api_key)
      setRestStartingWords(agentData.data?.rest_starting_words)
      setRestBotNameRegex(agentData.data?.rest_bot_name_regex)
      setRestBotName(agentData.data?.rest_bot_name)
      setUseVoice(
        agentData !== undefined && agentData.data?.rest_use_voice === true
      )
      setVoiceProvider(agentData.data?.rest_voice_provider)
      setVoiceCharacter(agentData.data?.rest_voice_character)
      setVoiceLanguageCode(agentData.data?.rest_voice_language_code)
      setVoiceDefaultPhrases(agentData.data?.rest_voice_default_phrases)
      setTikTalkNetUrl(agentData.data?.rest_tiktalknet_url)
      setAgentData({
        ...agentData,
        data: {
          ...agentData.data,
          rest_enabled: rest_enabled,
          rest_api_key: rest_api_key,
          rest_starting_words: rest_starting_words,
          rest_bot_name: rest_bot_name,
          rest_bot_name_regex: rest_bot_name_regex,
          rest_use_voice: rest_use_voice,
          rest_voice_provider: rest_voice_provider,
          rest_voice_character: rest_voice_character,
          rest_voice_language_code: rest_voice_language_code,
          rest_voice_default_phrases: rest_voice_default_phrases,
          rest_tiktalknet_url: rest_tiktalknet_url,
        },
      })
    }
  }, [])

  useEffect(() => {
    setAgentData({
      ...agentData,
      data: {
        ...agentData.data,
        rest_enabled: rest_enabled,
        rest_api_key: rest_api_key,
        rest_starting_words: rest_starting_words,
        rest_bot_name: rest_bot_name,
        rest_bot_name_regex: rest_bot_name_regex,
        rest_use_voice: rest_use_voice,
        rest_voice_provider: rest_voice_provider,
        rest_voice_character: rest_voice_character,
        rest_voice_language_code: rest_voice_language_code,
        rest_voice_default_phrases: rest_voice_default_phrases,
        rest_tiktalknet_url: rest_tiktalknet_url,
      },
    })
  }, [
    rest_enabled,
    rest_api_key,
    rest_starting_words,
    rest_bot_name,
    rest_bot_name_regex,
    rest_use_voice,
    rest_voice_provider,
    rest_voice_character,
    rest_voice_language_code,
    rest_voice_default_phrases,
    rest_tiktalknet_url,
  ])

  const testVoice = async () => {
    if (
      (agentData.data?.rest_voice_provider &&
        agentData.data?.rest_voice_character) ||
      playingAudio
    ) {
      if (
        agentData.data?.rest_voice_provider === 'tiktalknet' &&
        agentData.data?.rest_tiktalknet_url?.length <= 0
      ) {
        return
      }

      const resp = await axios.get(`${API_ROOT_URL}/text_to_speech`, {
        params: {
          text: 'Hello there! How are you?',
          voice_provider: agentData.data?.rest_voice_provider,
          voice_character: agentData.data?.rest_voice_character,
          voice_language_code: agentData.data?.rest_voice_language_code,
          tiktalknet_url: agentData.data?.rest_tiktalknet_url,
        },
      })

      const url =
        agentData.data?.rest_voice_provider === 'google' ||
        agentData.data?.rest_voice_provider === 'tiktalknet'
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
      <h3>REST API</h3>
      <div style={{ position: 'absolute', right: '1em', top: '0' }}>
        <Switch
          checked={agentData.data?.rest_enabled}
          onChange={e => {
            if (!e.target.checked) {
              setAgentData({
                ...agentData,
                data: {
                  ...agentData.data,
                  rest_use_voice: false,
                  rest_bot_name_regex: '',
                  rest_api_key: '',
                  rest_bot_name: '',
                  rest_starting_words: '',
                  rest_voice_character: '',
                  rest_voice_provider: '',
                  rest_voice_language_code: '',
                  rest_tiktalknet_url: '',
                  rest_enabled: false,
                },
              })
            } else {
              setRestEnabled(e.target.checked)
            }
          }}
          label={''}
        />
      </div>
      {agentData.data?.rest_enabled && (
        <div className="form-item">
          <Grid container>
            <Grid item xs={6}>
              <div className="form-item">
                <span className="form-item-label">API Key</span>
                <KeyInput
                  value={rest_api_key}
                  setValue={setRestApiKey}
                  secret={true}
                />
              </div>
            </Grid>
          </Grid>
        </div>
      )}

      {agentData.data?.rest_enabled && (
        <>
          <Grid container justifyContent="space-between">
            <Grid item xs={3}>
              <div className="form-item">
                <span className="form-item-label">
                  Starting Words (word1, word2, etc)
                </span>
                <input
                  type="text"
                  defaultValue={agentData.data?.rest_starting_words}
                  onChange={e => {
                    setRestStartingWords(e.target.value)
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="form-item">
                <span className="form-item-label">Bot Name Regex</span>
                <input
                  type="text"
                  defaultValue={agentData.data?.rest_bot_name_regex}
                  onChange={e => {
                    setRestBotNameRegex(e.target.value)
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="form-item">
                <span className="form-item-label">Bot Name</span>
                <input
                  type="text"
                  defaultValue={agentData.data?.rest_bot_name}
                  onChange={e => {
                    setRestBotName(e.target.value)
                  }}
                />
              </div>
            </Grid>
          </Grid>
          <div className="form-item">
            <span className="form-item-label">Voice Enabled</span>
            <input
              type="checkbox"
              value={agentData.data?.rest_use_voice}
              defaultChecked={rest_use_voice}
              onChange={e => {
                setUseVoice(e.target.checked)
              }}
            />
          </div>

          {agentData.data?.rest_use_voice && (
            <>
              <Grid container>
                <Grid item xs={3}>
                  <div className="form-item">
                    <span className="form-item-label">Voice Provider</span>
                    <select
                      name="voice_provider"
                      id="voice_provider"
                      className="select"
                      value={agentData.data?.rest_voice_provider?.toString()}
                      onChange={event => {
                        setVoiceProvider(event.target.value)
                        setVoiceCharacter('')
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
                    {agentData.data?.rest_voice_provider === 'google' ? (
                      <select
                        name="voice_provider"
                        id="voice_provider"
                        className="select"
                        value={agentData.data?.rest_voice_character}
                        onChange={event => {
                          setVoiceCharacter(event.target.value)
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
                        name="voice_provider"
                        id="voice_provider"
                        className="select"
                        value={agentData.data?.rest_voice_character}
                        onChange={event => {
                          setVoiceCharacter(event.target.value)
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
                      name="voice_provider"
                      id="voice_provider"
                      className="select"
                      value={agentData.data?.rest_voice_language_code}
                      onChange={event => {
                        setVoiceLanguageCode(event.target.value)
                      }}
                    >
                      <option value={'en-US'}>none</option>
                      <option value={'en-GB'}>en-GB</option>
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
                      defaultValue={agentData.data?.rest_voice_default_phrases}
                      onChange={e => {
                        setVoiceDefaultPhrases(e.target.value)
                      }}
                    />
                  </div>
                </Grid>
                <Grid item xs={3}>
                  {agentData.data?.rest_voice_provider === 'tiktalknet' && (
                    <div className="form-item">
                      <span className="form-item-label">
                        Tiktalknet URL - URL where Tiktalknet is hosted and the
                        requests will be sent there
                      </span>
                      <input
                        type="text"
                        defaultValue={agentData.data?.rest_tiktalknet_url}
                        onChange={e => {
                          setTikTalkNetUrl(e.target.value)
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
