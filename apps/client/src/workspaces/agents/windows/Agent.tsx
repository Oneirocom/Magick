import { magickApiRootUrl } from '../../../config'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'

const AgentWindow = ({
  id,
  updateCallback,
}: {
  id: number
  updateCallback: any
}) => {
  const { enqueueSnackbar } = useSnackbar()

  const [loaded, setLoaded] = useState(false)

  const [enabled, setEnabled] = useState(false)
  const [openai_api_key, setOpenaiApiKey] = useState('')
  const [eth_private_key, setEthPrivateKey] = useState('')
  const [eth_public_address, setEthPublicAddress] = useState('')

  const [discord_enabled, setDiscordEnabled] = useState(false)
  const [discord_api_key, setDiscordApiKey] = useState('')

  const [use_voice, setUseVoice] = useState(false)
  const [voice_provider, setVoiceProvider] = useState<string | null>(null)
  const [voice_character, setVoiceCharacter] = useState('')
  const [voice_language_code, setVoiceLanguageCode] = useState('')
  const [voice_default_phrases, setVoiceDefaultPhrases] = useState('')
  const [tiktalknet_url, setTikTalkNetUrl] = useState('')

  const [discord_starting_words, setDiscordStartingWords] = useState('')
  const [discord_bot_name_regex, setDiscordBotNameRegex] = useState('')
  const [discord_bot_name, setDiscordBotName] = useState('')
  const [discord_empty_responses, setDiscordEmptyResponses] = useState('')

  const [discord_spell_handler_incoming, setDiscordSpellHandlerIncoming] =
    useState('')
  const [discord_spell_handler_update, setDiscordSpellHandlerUpdate] =
    useState('')

  const [playingAudio, setPlayingAudio] = useState(false)

  const [loop_enabled, setLoopEnabled] = useState(false)
  const [loop_interval, setLoopInterval] = useState('')
  const [loop_agent_name, setLoopAgentName] = useState('')
  const [loop_spell_handler, setLoopSpellHandler] = useState('')

  const testVoice = async () => {
    if ((voice_provider && voice_character) || playingAudio) {
      if (voice_provider === 'tiktalknet' && tiktalknet_url?.length <= 0) {
        return
      }

      const resp = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/text_to_speech`,
        {
          params: {
            text: 'Hello there! How are you?',
            voice_provider: voice_provider,
            voice_character: voice_character,
            voice_language_code: voice_language_code,
            tiktalknet_url: tiktalknet_url,
          },
        }
      )

      const url =
        voice_provider === 'google' || voice_provider === 'tiktalknet'
          ? import.meta.env.VITE_APP_FILE_SERVER_URL + '/' + resp.data
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

  const [spellList, setSpellList] = useState<any[]>([])
  useEffect(() => {
    if (!loaded) {
      ;(async () => {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/agents?is=` + id
        )
        console.log('res is', res)
        let agentData = res.data.data ? JSON.parse(res.data.data) : {}
        setEnabled(res.data.enabled === true)
        setDiscordEnabled(agentData.discord_enabled === true)
        setUseVoice(agentData.use_voice === true)
        setVoiceProvider(agentData.voice_provider)
        setVoiceCharacter(agentData.voice_character)
        setVoiceLanguageCode(agentData.voice_language_code)
        setVoiceDefaultPhrases(agentData.voice_default_phrases)
        setTikTalkNetUrl(agentData.tiktalknet_url)

        setOpenaiApiKey(agentData.openai_api_key)
        setDiscordApiKey(agentData.discord_api_key)
        setDiscordStartingWords(agentData.discord_starting_words)
        setDiscordBotNameRegex(agentData.discord_bot_name_regex)
        setDiscordBotName(agentData.discord_bot_name)
        setDiscordEmptyResponses(agentData.discord_empty_responses)
        setDiscordSpellHandlerIncoming(
          agentData.discord_spell_handler_incoming
        )
        setDiscordSpellHandlerUpdate(agentData.discord_spell_handler_update)

        setEthPrivateKey(agentData.eth_private_key)
        setEthPublicAddress(agentData.eth_public_address)

        setLoopEnabled(agentData.loop_enabled === true)
        setLoopInterval(agentData.loop_interval)
        setLoopAgentName(agentData.loop_agent_name)
        setLoopSpellHandler(agentData.loop_spell_handler)

        setLoaded(true)
      })()
    }
  }, [loaded])

  useEffect(() => {
    ;(async () => {
      const res = await axios.get(`${import.meta.env.VITE_APP_API_URL}/spells`)
      setSpellList(res.data)
    })()
  }, [])

  const _delete = () => {
    axios
      .delete(`${import.meta.env.VITE_APP_API_URL}/agent/` + id)
      .then(res => {
        console.log('deleted', res)
        if (res.data === 'internal error') {
          enqueueSnackbar('Server Error deleting agent with id: ' + id, {
            variant: 'error',
          })
        } else {
          enqueueSnackbar('Entity with id: ' + id + ' deleted successfully', {
            variant: 'success',
          })
        }
        setLoaded(false)
        updateCallback()
      })
      .catch(e => {
        enqueueSnackbar('Server Error deleting entity with id: ' + id, {
          variant: 'error',
        })
      })
  }

  const update = () => {
    console.log('Update called')
    const _data = {
      enabled,
      data: {
        discord_enabled,
        openai_api_key,
        eth_private_key,
        eth_public_address,
        discord_api_key,
        discord_starting_words,
        discord_bot_name_regex,
        discord_bot_name,
        discord_empty_responses,
        discord_spell_handler_incoming,
        discord_spell_handler_update,
        use_voice,
        voice_provider,
        voice_character,
        voice_language_code,
        voice_default_phrases,
        tiktalknet_url,
        loop_enabled,
        loop_interval,
        loop_agent_name,
        loop_spell_handler,
      },
    }
    axios
      .patch(`${import.meta.env.VITE_APP_API_URL}/agents/${id}`, _data)
      .then(res => {
        console.log('RESPONSE DATA', res.data)
        if (typeof res.data === 'string' && res.data === 'internal error') {
          enqueueSnackbar('internal error updating agent', {
            variant: 'error',
          })
        } else {
          enqueueSnackbar('updated agent', {
            variant: 'success',
          })
          console.log('response on update', JSON.parse(res.config.data))
          let responseData = res && JSON.parse(res?.config?.data)

          console.log('responseData', responseData)

          setEnabled(responseData.enabled)
          setDiscordEnabled(responseData.data.discord_enabled)
          setOpenaiApiKey(responseData.data.openai_api_key)
          setDiscordApiKey(responseData.data.discord_api_key)
          setDiscordStartingWords(responseData.data.discord_starting_words)
          setDiscordBotNameRegex(responseData.data.discord_bot_name_regex)
          setDiscordBotName(responseData.data.discord_bot_name)
          setDiscordEmptyResponses(responseData.data.discord_empty_responses)
          setDiscordSpellHandlerIncoming(
            responseData.data.discord_spell_handler_incoming
          )
          setDiscordSpellHandlerUpdate(
            responseData.data.discord_spell_handler_update
          )
          setLoopEnabled(responseData.data.loop_enabled)
          setLoopInterval(responseData.data.loop_interval)
          setLoopAgentName(responseData.data.loop_agent_name)
          setLoopSpellHandler(responseData.data.loop_spell_handler)

          updateCallback()
        }
      })
      .catch(e => {
        console.log('ERROR', e)
        enqueueSnackbar('internal error updating entity', {
          variant: 'error',
        })
      })
  }

  const exportEntity = () => {
    const _data = {
      enabled,
      data: {
        discord_enabled,
        openai_api_key,
        discord_api_key,
        discord_starting_words,
        discord_bot_name_regex,
        discord_bot_name,
        discord_empty_responses,
        discord_spell_handler_incoming,
        discord_spell_handler_update,
        use_voice,
        voice_provider,
        voice_character,
        voice_language_code,
        voice_default_phrases,
        tiktalknet_url,
        loop_enabled,
        loop_interval,
        loop_agent_name,
        loop_spell_handler,
      },
    }
    const fileName =
      discord_bot_name ?? 'agent'
    const json = JSON.stringify(_data)
    const blob = new Blob([json], { type: 'application/json' })
    const url = window.URL.createObjectURL(new Blob([blob]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${fileName}.ent.json`)
    // Append to html link element page
    document.body.appendChild(link)
    // Start download
    link.click()
    if (!link.parentNode) return
    // Clean up and remove the link
    link.parentNode.removeChild(link)
  }

  function ChatBox({
    spell_handler,
    client,
    channel,
    channelType,
    sender,
    observer,
    agentId
  }) {
    const [messages, setMessages] = useState(['Welcome to the room!'])
    const [value, setValue] = useState('')
    const handleSubmit = async event => {
      event.preventDefault()
      console.log('value is: ', value)
      try {
        const url = encodeURI(`${magickApiRootUrl}/spells/${spell_handler}`)
        console.log('url is: ', url)
        const response = await axios
          .post(`${url}`, {
            inputs: {
              content: value,
              sender,
              observer,
              client,
              channelType,
              agentId: agentId,
              channel,
            },
          })
          .then(response => {
            const data = response.data

            // get the output from data
            const outputs = data.outputs

            // get the first key from outputs
            const outputKey = Object.keys(outputs)[0]

            // get the output from outputs
            const output = outputs[outputKey]

            setMessages([...messages, output])
            console.log(response)
          })
      } catch (error) {
        console.error(error)
      }
    }

    return (
      <div style={{ width: '80%' }}>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}

        <form onSubmit={handleSubmit}>
          <label htmlFor="message">Message:</label>
          <input
            type="text"
            name="message"
            value={value}
            onChange={e => {
              setValue(e.target.value)
            }}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    )
  }

  return !loaded ? (
    <>Loading...</>
  ) : (
    <div className="agentWindow">
      <div className="form-item">
        <span className="form-item-label">Enabled</span>
        <input
          type="checkbox"
          defaultChecked={enabled}
          onChange={e => {
            setEnabled(e.target.checked)
          }}
        />
      </div>
      <ChatBox
        client={'AgentWindow'}
        spell_handler={discord_spell_handler_incoming}
        channelType={'AgentWindow'}
        agentId={id}
        sender={'Speaker'}
        observer={'Agent'}
        channel={'AgentWindow'}
      />
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
        <React.Fragment>
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
                <option value={'en-US-Standard-A'}>en-US-Standard-A</option>
                <option value={'en-US-Standard-B'}>en-US-Standard-B</option>
                <option value={'en-US-Standard-C'}>en-US-Standard-C</option>
                <option value={'en-US-Standard-D'}>en-US-Standard-D</option>
                <option value={'en-US-Standard-E'}>en-US-Standard-E</option>
                <option value={'en-US-Standard-F'}>en-US-Standard-F</option>
                <option value={'en-US-Standard-G'}>en-US-Standard-G</option>
                <option value={'en-US-Standard-H'}>en-US-Standard-H</option>
                <option value={'en-US-Standard-I'}>en-US-Standard-I</option>
                <option value={'en-US-Standard-J'}>en-US-Standard-J</option>
                <option value={'en-US-Wavenet-A'}>en-US-Wavenet-A</option>
                <option value={'en-US-Wavenet-B'}>en-US-Wavenet-B</option>
                <option value={'en-US-Wavenet-C'}>en-US-Wavenet-C</option>
                <option value={'en-US-Wavenet-D'}>en-US-Wavenet-D</option>
                <option value={'en-US-Wavenet-E'}>en-US-Wavenet-E</option>
                <option value={'en-US-Wavenet-F'}>en-US-Wavenet-F</option>
                <option value={'en-US-Wavenet-G'}>en-US-Wavenet-G</option>
                <option value={'en-US-Wavenet-H'}>en-US-Wavenet-H</option>
                <option value={'en-US-Wavenet-I'}>en-US-Wavenet-I</option>
                <option value={'en-US-Wavenet-J'}>en-US-Wavenet-J</option>
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

          {voice_provider === 'tiktalknet' && (
            <div className="form-item">
              <span className="form-item-label">
                Tiktalknet URL - URL where Tiktalknet is hosted and the requests
                will be sent there
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

          <div className="form-item">
            <button onClick={() => testVoice()} style={{ marginRight: '10px' }}>
              Test
            </button>
          </div>
        </React.Fragment>
      )}
      {enabled && (
        <>
          <div className="form-item">
            <span className="form-item-label">OpenAI Key</span>
            {/*password input field that, when changed, sets the openai key*/}
            <input
              type="password"
              defaultValue={openai_api_key}
              onChange={e => {
                setOpenaiApiKey(e.target.value)
              }}
            />
          </div>
          <div className="form-item">
            <span className="form-item-label">Ethereum Private Key</span>
            {/*password input field that, when changed, sets the openai key*/}
            <input
              type="password"
              defaultValue={eth_private_key}
              onChange={e => {
                setEthPrivateKey(e.target.value)
              }}
            />
          </div>
          <div className="form-item">
            <span className="form-item-label">Ethereum Public Address</span>
            {/*password input field that, when changed, sets the openai key*/}
            <input
              type="input"
              defaultValue={eth_public_address}
              onChange={e => {
                setEthPublicAddress(e.target.value)
              }}
            />
          </div>
          <div className="form-item">
            <span className="form-item-label">Discord Enabled</span>
            <input
              type="checkbox"
              value={discord_enabled.toString()}
              defaultChecked={discord_enabled}
              onChange={e => {
                setDiscordEnabled(e.target.checked)
              }}
            />
          </div>

          {discord_enabled && (
            <>
              <div className="form-item">
                <span className="form-item-label">Discord API Key</span>
                <input
                  type="password"
                  defaultValue={discord_api_key}
                  onChange={e => {
                    setDiscordApiKey(e.target.value)
                  }}
                />
              </div>

              <div className="form-item">
                <span className="form-item-label">
                  Discord Starting Words - Separated by ,
                </span>
                <input
                  type="text"
                  defaultValue={discord_starting_words}
                  onChange={e => {
                    setDiscordStartingWords(e.target.value)
                  }}
                />
              </div>

              <div className="form-item">
                <span className="form-item-label">Discord Bot Name Regex</span>
                <input
                  type="text"
                  defaultValue={discord_bot_name_regex}
                  onChange={e => {
                    setDiscordBotNameRegex(e.target.value)
                  }}
                />
              </div>

              <div className="form-item">
                <span className="form-item-label">Discord Bot Name</span>
                <input
                  type="text"
                  defaultValue={discord_bot_name}
                  onChange={e => {
                    setDiscordBotName(e.target.value)
                  }}
                />
              </div>

              <div className="form-item">
                <span className="form-item-label">
                  Discord Empty Responses - Separated by |
                </span>
                <input
                  type="text"
                  defaultValue={discord_empty_responses}
                  onChange={e => {
                    setDiscordEmptyResponses(e.target.value)
                  }}
                />
              </div>

              <div className="form-item agent-select">
                <span className="form-item-label">
                  Spell Handler (Incoming Message Handler)
                </span>
                <select
                  name="spellHandlerIncoming"
                  id="spellHandlerIncoming"
                  value={discord_spell_handler_incoming}
                  onChange={event => {
                    setDiscordSpellHandlerIncoming(event.target.value)
                  }}
                >
                  <option hidden></option>
                  {spellList.length > 0 &&
                    spellList.map((spell, idx) => (
                      <option value={spell.name} key={idx}>
                        {spell.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-item agent-select">
                <span className="form-item-label">Interval Update Handler</span>
                <select
                  name="spellHandlerUpdate"
                  id="spellHandlerUpdate"
                  value={discord_spell_handler_update}
                  onChange={event => {
                    setDiscordSpellHandlerUpdate(event.target.value)
                  }}
                >
                  <option value="null">
                    --Disabled--
                  </option>
                  {spellList.length > 0 &&
                    spellList.map((spell, idx) => (
                      <option value={spell.name} key={idx}>
                        {spell.name}
                      </option>
                    ))}
                </select>
              </div>
            </>
          )}

          {loop_enabled && (
            <>
              <div className="form-item">
                <span className="form-item-label">Loop Interval</span>
                <input
                  type="text"
                  pattern="[0-9]*"
                  defaultValue={loop_interval}
                  onChange={e => {
                    setLoopInterval(e.target.value)
                  }}
                />
              </div>
              <div className="form-item">
                <span className="form-item-label">Loop Agent Name</span>
                <input
                  type="text"
                  defaultValue={loop_agent_name}
                  onChange={e => {
                    setLoopAgentName(e.target.value)
                  }}
                />
              </div>
              <div className="form-item agent-select">
                <span className="form-item-label">Spell Handler</span>
                <select
                  name="spellHandlerIncoming"
                  id="spellHandlerIncoming"
                  value={loop_spell_handler}
                  onChange={event => {
                    setLoopSpellHandler(event.target.value)
                  }}
                >
                  {spellList.length > 0 &&
                    spellList.map((spell, idx) => (
                      <option value={spell.name} key={idx}>
                        {spell.name}
                      </option>
                    ))}
                </select>
              </div>
            </>
          )}
        </>
      )}
      <div className="form-item entBtns">
        <button onClick={() => update()} style={{ marginRight: '10px' }}>
          Update
        </button>
        <button onClick={() => _delete()} style={{ marginRight: '10px' }}>
          Delete
        </button>
        <button onClick={() => exportEntity()}>Export</button>
      </div>
    </div>
  )
}

export default AgentWindow
