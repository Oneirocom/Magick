import { magickApiRootUrl } from '../../../config'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import { ReactDOM } from 'react'

/* Import All Agent Window Components */
import { pluginManager } from '@magickml/engine'

const RenderComp = (props) =>{
  console.log(props)
  return (
    <props.element props={props} />
  )
}

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

  

  const [use_voice, setUseVoice] = useState(false)
  const [voice_provider, setVoiceProvider] = useState<string | null>(null)
  const [voice_character, setVoiceCharacter] = useState('')
  const [voice_language_code, setVoiceLanguageCode] = useState('')
  const [voice_default_phrases, setVoiceDefaultPhrases] = useState('')
  const [tiktalknet_url, setTikTalkNetUrl] = useState('')


  const [ discordValue, setDiscordValue] = useState([])
  const agentDatVal = React.useRef(null);
  const [agentDataValue, setAgentDataValue] = useState({})
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
        `${magickApiRootUrl}/text_to_speech`,
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
          `${magickApiRootUrl}/agents/` + id
        )
        console.log('res    //@ts-ignore is', res)

        if (res.data === null) {
          enqueueSnackbar('Agent not found', {
            variant: 'error',
          })
          return
        }

        console.log('res data', res.data)

        let agentData = res.data.data
        setEnabled(res.data.enabled === true)

        console.log('agentData', agentData)

        if (agentData !== null && agentData !== undefined) {
        setUseVoice(agentData !== undefined && agentData.use_voice === true)
        agentDatVal.current = agentData
        setVoiceProvider(agentData.voice_provider)
        setVoiceCharacter(agentData.voice_character)
        setVoiceLanguageCode(agentData.voice_language_code)
        setVoiceDefaultPhrases(agentData.voice_default_phrases)
        setTikTalkNetUrl(agentData.tiktalknet_url)

        setOpenaiApiKey(agentData.openai_api_key)
        setEthPrivateKey(agentData.eth_private_key)
        setEthPublicAddress(agentData.eth_public_address)

        setLoopEnabled(agentData.loop_enabled === true)
        setLoopInterval(agentData.loop_interval)
        setLoopAgentName(agentData.loop_agent_name)
        setLoopSpellHandler(agentData.loop_spell_handler)
        }
        setLoaded(true)
      })()
    }
  }, [loaded])

  useEffect(() => {
    ;(async () => {
      const res = await axios.get(`${magickApiRootUrl}/spells`)
      setSpellList(res.data)
    })()
  }, [])

  const _delete = () => {
    axios
      .delete(`${magickApiRootUrl}/agents/` + id)
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
        ...discordValue,
        openai_api_key,
        eth_private_key,
        eth_public_address,
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
      .patch(`${magickApiRootUrl}/agents/${id}`, _data)
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
        openai_api_key,
        ...discordValue,
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
      (discordValue as any).discord_bot_name ?? 'agent'
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
      {pluginManager.getAgentComponents().map((value, index, array) => {
          return <RenderComp key={index} element={value} agentData={agentDatVal.current} spellList={spellList} setDiscordValue={setDiscordValue}/>
      })}
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
            <KeyInput value={openai_api_key} setValue={setOpenaiApiKey} secret={true} />
          </div>
          <div className="form-item">
            <span className="form-item-label">Ethereum Private Key</span>
            {/*password input field that, when changed, sets the openai key*/}
            <KeyInput value={eth_private_key} setValue={setEthPrivateKey} secret={true} />
          </div>
          <div className="form-item">
            <span className="form-item-label">Ethereum Public Address</span>
            {/*password input field that, when changed, sets the openai key*/}
            <KeyInput value={eth_public_address} setValue={setEthPublicAddress} secret={false} />
          </div>

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

const KeyInput = ({ value, setValue, secret }: { value: string, setValue: any, secret: boolean }) => {

  const addKey = (str: string) => {
    // discount random key presses, could def have better sense checking
    // ethereum addresses are 42 chars
    if (str.length > 41) {
      setValue(str)
    }
  }

  const removeKey = () => {
    setValue('')
  }

  const obfuscateKey = (str: string) => {
    const first = str.substring(0, 6)
    const last = str.substring(str.length - 4, str.length)
    return `${first}....${last}`
  }

  return value ? (
    <>
      <p>{secret ? obfuscateKey(value) : value}</p>
      <button onClick={removeKey}>remove</button>
    </>
  ) : (
    <input type={secret ? "password" : "input"} defaultValue={value} onChange={e => { addKey(e.target.value) }} />
  )
}

export default AgentWindow
