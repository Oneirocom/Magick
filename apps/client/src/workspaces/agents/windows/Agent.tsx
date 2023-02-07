import { magickApiRootUrl } from '../../../config'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import { useEffect, useState, useRef } from 'react'

/* Import All Agent Window Components */
import { pluginManager } from '@magickml/engine'
const RenderComp = (props) =>{
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

  const [loop_enabled, setLoopEnabled] = useState(false)
  const [loop_interval, setLoopInterval] = useState('')

  const [root_spell, setRootSpell] = useState('');

  const agentDatVal = useRef(null);
  const [agentDataState, setAgentDataState] = useState<any>({})
  const [spellList, setSpellList] = useState<any[]>([])
  useEffect(() => {
    if (!loaded) {
      ;(async () => {
        const res = await axios.get(
          `${magickApiRootUrl}/agents/` + id
        )

        if (res.data === null) {
          enqueueSnackbar('Agent not found', {
            variant: 'error',
          })
          return
        }

        console.log('res data', res.data)

        let agentData = res.data.data
        setEnabled(res.data.enabled === true)
        if (agentData !== null && agentData !== undefined) {
        agentDatVal.current = agentData
        setOpenaiApiKey(agentData.openai_api_key)
        setRootSpell(agentData.root_spell)
        setEthPrivateKey(agentData.eth_private_key)
        setEthPublicAddress(agentData.eth_public_address)

        setLoopEnabled(agentData.loop_enabled === true)
        setLoopInterval(agentData.loop_interval)
        }
        setLoaded(true)
      })()
    }
  }, [loaded])

  useEffect(() => {
    ;(async () => {
      const res = await axios.get(`${magickApiRootUrl}/spells`)
      console.log('res', res.data)
      console.log('spellList', res.data)
      setSpellList(res.data?.data)
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
        ...agentDataState,
        openai_api_key,
        eth_private_key,
        eth_public_address,
        loop_enabled,
        loop_interval,
        root_spell,
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
        ...agentDataState,
        openai_api_key,
        loop_enabled,
        loop_interval
      },
    }
    const fileName = 'agent'
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
  const agentComponents = pluginManager.getAgentComponents()
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
      {enabled && (
        <>
          {pluginManager.getAgentComponents().map((value, index, array) => {
          return <RenderComp key={index} element={value} agentData={agentDatVal.current} setAgentDataState={setAgentDataState}/>
          })}
          <div className="form-item agent-select">
                <span className="form-item-label">Spell Handler</span>
                <select
                  name="spellHandlerIncoming"
                  id="spellHandlerIncoming"
                  value={root_spell}
                  onChange={event => {
                    setRootSpell(event.target.value)
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
          <div className="form-item">
            <span className="form-item-label">OpenAI Key</span>
            {/*password input field that, when changed, sets the openai key*/}
            <KeyInput value={openai_api_key} setValue={setOpenaiApiKey} secret={true} />
          </div>
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
