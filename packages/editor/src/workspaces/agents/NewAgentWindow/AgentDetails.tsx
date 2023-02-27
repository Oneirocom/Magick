import { Icon, IconBtn, Switch} from '@magickml/client-core'
import { Accordion, Avatar, Button, Typography } from '@mui/material'
import styles from './index.module.scss'
import { useEffect, useState } from 'react'
import AgentPubVariables from './AgentPubVariables'
import axios from 'axios'
import { id } from 'ethers/lib/utils.js'
import { enqueueSnackbar } from 'notistack'
import { useConfig } from '../../../contexts/ConfigProvider'
import { pluginManager } from '@magickml/engine'

const RenderComp = props => {
  return <props.element props={props} />
}

const AgentDetails = ({ agentData: _agentData, updateCallback = () => {console.log('callback')} }) => {
  const [root_spell, setRootSpell] = useState('default')
  const [spellList, setSpellList] = useState<any[]>([])
  const [agentData, setAgentData] = useState<any>(_agentData)

  const config = useConfig()

  const [selectedSpellPublicVars, setSelectedSpellPublicVars] = useState<any[]>([])

  useEffect(() => {
    setSelectedSpellPublicVars(Object.values(
      spellList?.find(spell => spell.name === root_spell)?.graph.nodes || {}
    ).filter(node => node?.data?.Public))
  }, [root_spell, spellList])

  const update = (_data = agentData) => {
    axios
      .patch(`${config.apiUrl}/agents/${id}`, _data)
      .then(res => {
        if (typeof res.data === 'string' && res.data === 'internal error') {
          enqueueSnackbar('internal error updating agent', {
            variant: 'error',
          })
        } else {
          enqueueSnackbar('updated agent', {
            variant: 'success',
          })
          let responseData = res && JSON.parse(res?.config?.data)

          setAgentData(responseData)

          updateCallback()
        }
      })
      .catch(e => {
        console.error('ERROR', e)
        enqueueSnackbar('internal error updating entity', {
          variant: 'error',
        })
      })
  }

  const _delete = () => {
    axios
      .delete(`${config.apiUrl}/agents/` + id)
      .then(res => {
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
      
      setSpellList(json.data)
    })()
  }, [])

  return (
    <div>
      <div
        className={`${styles.agentDetailsContainer}`}
      >
        <div className={styles.agentDescription}>
          <Avatar className={styles.avatar}>A</Avatar>
          <div>
            <Typography variant="h5">{agentData.name}</Typography>
          </div>
        </div>
        <div className="form-item entBtns">
        <Button
          onClick={() => {
            update()
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
            setAgentData({ ...agentData, enabled: !agentData.enabled })
          }}
          style={{ alignSelf: 'self-start' }}
        />
      </div>
      <div className="form-item agent-select">
        <span className="form-item-label">Root Spell</span>
        <select
        style={{
          appearance: 'none'
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
      <Accordion title="Variables">
        <div>
          {selectedSpellPublicVars.length !== 0 && (
            <AgentPubVariables
              update={update}
              publicVars={selectedSpellPublicVars}
            />
          )}
        </div>
      </Accordion>
      <Accordion title="Connectors">
        <div>
        {pluginManager.getAgentComponents().map((value, index, array) => {
            return (
              <RenderComp
                key={index}
                element={value}
                agentData={agentData}
                setAgentData={setAgentData}
              />
            )
          })}
        </div>
      </Accordion>
    </div>
  )
}

export default AgentDetails
