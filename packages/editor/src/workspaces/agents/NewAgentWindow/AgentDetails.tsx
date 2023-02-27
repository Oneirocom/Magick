import { Icon, IconBtn, Switch } from '@magickml/client-core'
import { Avatar, Button, Typography } from '@mui/material'
import Accordion from './Accordion'
import styles from './index.module.scss'
import { useEffect, useState } from 'react'
import AgentPubVariables from './AgentPubVariables'
import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import { useConfig } from '../../../contexts/ConfigProvider'
import { pluginManager } from '@magickml/engine'

const RenderComp = props => {
  return <props.element props={props} />
}

const AgentDetails = ({ agentData, setSelectedAgent, updateCallback }) => {
  const [root_spell, setRootSpell] = useState('default')
  const [spellList, setSpellList] = useState<any[]>([])
  const [updatedPubVars, setPublicVars] = useState<any>('')
  const config = useConfig()

  const [selectedSpellPublicVars, setSelectedSpellPublicVars] = useState<any[]>(
    []
  )

  useEffect(() => {
    setSelectedSpellPublicVars(
      Object.values(
        spellList?.find(spell => spell.name === root_spell)?.graph.nodes || {}
      ).filter(node => node?.data?.Public)
    )
    console.log('selectedSpellPublicVars', selectedSpellPublicVars)
  }, [root_spell, spellList])

  const update = (id, _data = agentData) => {
    if (_data.hasOwnProperty('id')) {
      delete _data.id
    }
    // Avoid server-side validation error
    _data.spells = Array.isArray(_data?.spells) ? _data.spells : []

    axios
      .patch(`${config.apiUrl}/agents/${id}`, _data)
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
    const fileName = 'agent'
    const json = JSON.stringify(agentData)
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

  useEffect(() => {
    ;(async () => {
      const res = await fetch(
        `${config.apiUrl}/spells?projectId=${config.projectId}`
      )
      const json = await res.json()

      console.log('res', json)
      console.log('spellList', json)
      setSpellList(json.data)
    })()
  }, [])

  return (
    <div>
      <div className={`${styles.agentDetailsContainer}`}>
        <div className={styles.agentDescription}>
          <Avatar className={styles.avatar}>A</Avatar>
          <div>
            <Typography variant="h5">{agentData.name}</Typography>
          </div>
        </div>
        <div className={styles.btns}>
          <Button
            onClick={() => {
              update(agentData?.id)
            }}
          >
            Update
          </Button>
          <Button onClick={() => exportEntity()}>Export</Button>
        </div>
        <Switch
          label={null}
          checked={agentData.enabled}
          onChange={() => {
            setSelectedAgent({ ...agentData, enabled: !agentData.enabled })
          }}
          style={{ alignSelf: 'self-start' }}
        />
      </div>
      <div className="form-item agent-select">
        <span className="form-item-label">Root Spell</span>
        <select
          style={{
            appearance: 'none',
          }}
          name="root_spell"
          id="root_spell"
          value={root_spell}
          onChange={event => {
            setRootSpell(event.target.value)
          }}
        >
          <option disabled value="default" key={0}>
            Select Spell
          </option>
          {spellList?.length > 0 &&
            spellList.map((spell, idx) => (
              <option value={spell.name} key={idx}>
                {spell.name}
              </option>
            ))}
        </select>
      </div>
      <div
        style={{
          height: `${selectedSpellPublicVars.length === 0 ? 'auto' : '150px'}`,
          overflow: 'auto',
          marginBottom: '10px',
        }}
      >
        {selectedSpellPublicVars.length !== 0 ? (
          <AgentPubVariables
            setPublicVars={setPublicVars}
            publicVars={selectedSpellPublicVars}
          />
        ) : (
          <Typography>No Public Variables</Typography>
        )}
      </div>
      <div
        className={`${
          selectedSpellPublicVars.length === 0
            ? styles.connectorsLong
            : styles.connectors
        }`}
      >
        {pluginManager.getAgentComponents().map((value, index, array) => {
          return (
            <RenderComp
              key={index}
              element={value}
              agentData={agentData}
              setAgentData={setSelectedAgent}
            />
          )
        })}
      </div>
    </div>
  )
}

export default AgentDetails
