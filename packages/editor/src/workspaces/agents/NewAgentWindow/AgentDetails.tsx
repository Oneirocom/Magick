import { Switch } from '@magickml/client-core'
import { Avatar, Button, Typography } from '@mui/material'
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

const AgentDetails = ({ selectedAgentData, setSelectedAgentData, updateCallback }) => {
  const [rootSpell, setRootSpell] = useState('default')
  const [spellList, setSpellList] = useState<any[]>([])
  const config = useConfig()

  const [selectedSpellPublicVars, setSelectedSpellPublicVars] = useState<any[]>(
    []
  )

  useEffect(() => {
    setSelectedAgentData(
      {
        ...selectedAgentData,
        publicVariables: Object.values(
        spellList?.find(spell => spell.name === rootSpell)?.graph.nodes || {}
      ).filter((node: { data }) => node?.data?.isPublic)
    }
    )
    console.log('selectedSpellPublicVars', selectedSpellPublicVars)
  }, [rootSpell, spellList])

  const update = (id, _data = selectedAgentData) => {
    if (_data.hasOwnProperty('id')) {
      delete _data.id
    }
    // Avoid server-side validation error
    _data.spells = Array.isArray(_data?.spells) ? _data.spells : []
    _data.dirty = true
    _data.enabled = _data.enabled ? true : false
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

  const exportEntity = () => {
    const fileName = 'agent'
    const json = JSON.stringify(selectedAgentData)
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
      <div className={`${styles.agentDetailsContainer}`}>
        <div className={styles.agentDescription}>
          <Avatar className={styles.avatar}>A</Avatar>
          <div>
            <Typography variant="h5">{selectedAgentData.name}</Typography>
          </div>
        </div>
        <div className={styles.btns}>
          <Button
            onClick={() => {
              update(selectedAgentData?.id)
            }}
            style={{
              margin: '1em',
              color: 'white',
              backgroundColor: 'purple',
            }}
          >
            Update
          </Button>
          <Button
            style={{
              margin: '1em',
              color: 'white',
              backgroundColor: 'purple',
            }}
            onClick={() => exportEntity()}
          >
            Export
          </Button>
        </div>
        <Switch
          label={null}
          checked={selectedAgentData.enabled ? true : false}
          onChange={() => {
            setSelectedAgentData({
              ...selectedAgentData,
              enabled: selectedAgentData.enabled ? false : true,
            })
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
          name="rootSpell"
          id="rootSpell"
          value={rootSpell}
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
            setPublicVars={(data) => {
              setSelectedAgentData({
                ...selectedAgentData,
                publicVariables: data,
            })
          }}
            publicVars={selectedAgentData.publicVariables}
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
              selectedAgentData={selectedAgentData}
              setSelectedAgentData={setSelectedAgentData}
            />
          )
        })}
      </div>
    </div>
  )
}

export default AgentDetails
