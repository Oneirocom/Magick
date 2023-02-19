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

export const DiscordAgentWindow: FC<any> = props => {
  props = props.props
  const { enqueueSnackbar } = useSnackbar()
  const [discord_enabled, setDiscordEnabled] = useState(undefined)
  const [discord_api_key, setDiscordApiKey] = useState('')
  const [discord_starting_words, setDiscordStartingWords] = useState('')
  const [discord_bot_name_regex, setDiscordBotNameRegex] = useState('')
  const [discord_bot_name, setDiscordBotName] = useState('')

  const [use_voice, setUseVoice] = useState(false)
  const [voice_provider, setVoiceProvider] = useState<string | null>(null)
  const [voice_character, setVoiceCharacter] = useState('')
  const [voice_language_code, setVoiceLanguageCode] = useState('')
  const [voice_default_phrases, setVoiceDefaultPhrases] = useState('')
  const [tiktalknet_url, setTikTalkNetUrl] = useState('')
  const [playingAudio, setPlayingAudio] = useState(false)

  useEffect(() => {
    if (props.agentData !== null && props.agentData !== undefined) {
      console.log(props.agentData)
      setDiscordEnabled(props.agentData.discord_enabled)
      setDiscordApiKey(props.agentData.discord_api_key)
      setDiscordStartingWords(props.agentData.discord_starting_words)
      setDiscordBotNameRegex(props.agentData.discord_bot_name_regex)
      setDiscordBotName(props.agentData.discord_bot_name)
      setUseVoice(
        props.agentData !== undefined && props.agentData.use_voice === true
      )
      setVoiceProvider(props.agentData.voice_provider)
      setVoiceCharacter(props.agentData.voice_character)
      setVoiceLanguageCode(props.agentData.voice_language_code)
      setVoiceDefaultPhrases(props.agentData.voice_default_phrases)
      setTikTalkNetUrl(props.agentData.tiktalknet_url)
      props.setAgentDataState({
        discord_enabled: discord_enabled,
        discord_api_key: discord_api_key,
        discord_starting_words: discord_starting_words,
        discord_bot_name: discord_bot_name,
        discord_bot_name_regex: discord_bot_name,
        use_voice: use_voice,
        voice_provider: voice_provider,
        voice_character: voice_character,
        voice_language_code: voice_language_code,
        voice_default_phrases: voice_default_phrases,
        tiktalknet_url: tiktalknet_url,
      })
    }
  }, [])
  useEffect(() => {
    //console.log(discord_enabled, discord_api_key, discord_starting_words, discord_bot_name, discord_bot_name_regex, use_voice, voice_provider, voice_character, voice_default_phrases, voice_language_code, tiktalknet_url)
    props.setAgentDataState({
      discord_enabled: discord_enabled,
      discord_api_key: discord_api_key,
      discord_starting_words: discord_starting_words,
      discord_bot_name: discord_bot_name,
      discord_bot_name_regex: discord_bot_name,
      use_voice: use_voice,
      voice_provider: voice_provider,
      voice_character: voice_character,
      voice_language_code: voice_language_code,
      voice_default_phrases: voice_default_phrases,
      tiktalknet_url: tiktalknet_url,
    })
  }, [
    discord_enabled,
    discord_api_key,
    discord_starting_words,
    discord_bot_name,
    discord_bot_name_regex,
    use_voice,
    voice_provider,
    voice_character,
    voice_default_phrases,
    voice_language_code,
    tiktalknet_url,
  ])

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
      }}
    >
      <h1>Discord</h1>
      <div className="form-item">
        <Grid container style={{ padding: '1em' }}>
          <Grid item xs={3}>
            <span className="form-item-label">Enabled</span>
            <input
              key={Math.random()}
              type="checkbox"
              value={discord_enabled}
              defaultChecked={discord_enabled}
              onChange={e => {
                setDiscordEnabled(e.target.checked)
              }}
            />
          </Grid>
          {discord_enabled && (
            <Grid item xs={6}>
              <div className="form-item">
                <span className="form-item-label">API Key</span>
                <KeyInput
                  value={discord_api_key}
                  setValue={setDiscordApiKey}
                  secret={true}
                />
              </div>
            </Grid>
          )}
        </Grid>
      </div>

      {discord_enabled && (
        <>
          <Grid container style={{ padding: '1em' }}>
            <Grid item xs={3}>
              <div className="form-item">
                <span className="form-item-label">
                  Starting Words (word1, word2, etc)
                </span>
                <input
                  type="text"
                  defaultValue={discord_starting_words}
                  onChange={e => {
                    setDiscordStartingWords(e.target.value)
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="form-item">
                <span className="form-item-label">Bot Name Regex</span>
                <input
                  type="text"
                  defaultValue={discord_bot_name_regex}
                  onChange={e => {
                    setDiscordBotNameRegex(e.target.value)
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="form-item">
                <span className="form-item-label">Bot Name</span>
                <input
                  type="text"
                  defaultValue={discord_bot_name}
                  onChange={e => {
                    setDiscordBotName(e.target.value)
                  }}
                />
              </div>
            </Grid>
          </Grid>
          <div className="form-item">
            <span className="form-item-label">Voice Enabled</span>
            <input
              type="checkbox"
              value={use_voice.toString()}
              defaultChecked={use_voice}
              onChange={e => {
                setUseVoice(e.target.checked)
              }}
            />
          </div>

          {use_voice && (
            <>
              <Grid container>
                <Grid item xs={3}>
                  <div className="form-item agent-select">
                    <span className="form-item-label">Voice Provider</span>
                    <select
                      name="voice_provider"
                      id="voice_provider"
                      value={voice_provider?.toString()}
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
                    {voice_provider === 'google' ? (
                      <select
                        name="voice_provider"
                        id="voice_provider"
                        value={voice_character}
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
                        value={voice_character}
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
                      value={voice_language_code}
                      onChange={event => {
                        setVoiceLanguageCode(event.target.value)
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
                      Voice Default Phrases - Separate using | (n1|n2|...|nN)
                    </span>
                    <input
                      type="text"
                      defaultValue={voice_default_phrases}
                      onChange={e => {
                        setVoiceDefaultPhrases(e.target.value)
                      }}
                    />
                  </div>
                </Grid>
                <Grid item xs={3}>
                  {voice_provider === 'tiktalknet' && (
                    <div className="form-item">
                      <span className="form-item-label">
                        Tiktalknet URL - URL where Tiktalknet is hosted and the
                        requests will be sent there
                      </span>
                      <input
                        type="text"
                        defaultValue={tiktalknet_url}
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
                  style={{ marginRight: '10px' }}
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
