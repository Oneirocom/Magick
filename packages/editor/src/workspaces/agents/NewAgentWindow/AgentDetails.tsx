import { IconBtn, Switch } from '@magickml/client-core'
import { Avatar, Box, Button, Typography } from '@mui/material'
import styles from './index.module.scss'
import { useEffect, useState } from 'react'
import AgentPubVariables from './AgentPubVariables'
import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import { useConfig } from '../../../contexts/ConfigProvider'
import { pluginManager } from '@magickml/engine'
import { Edit, Done, Close } from '@mui/icons-material'

const RenderComp = props => {
  return <props.element props={props} />
}

const AgentDetails = ({ agentData, setSelectedAgent, updateCallback }) => {
  const [root_spell, setRootSpell] = useState('default')
  const [editMode, setEditMode] = useState(false)
  const [spellList, setSpellList] = useState<any[]>([])
  const [updatedPubVars, setPublicVars] = useState<any>('')
  const [name, setName] = useState<string>(agentData?.name || '')
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
      console.log('GETTING SPELLS')
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
          <Avatar className={styles.avatar}>
            {agentData?.name?.at(0) || 'A'}
          </Avatar>
          <div
            onDoubleClick={() => {
              setEditMode(true)
            }}
          >
            {editMode ? (
              <>
                <Box component="div" sx={{ display: 'inline-block' }}>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onClick={e => e.stopPropagation()}
                    onChange={e => setName(e.target.value)}
                    placeholder="Add new agent name here"
                  />
                </Box>
                <Box component="div" sx={{ display: 'inline-block' }}>
                  <div>
                    <IconBtn
                      label={'Done'}
                      Icon={<Done />}
                      onClick={e => {
                        e.stopPropagation()
                        update(agentData.id, { name })
                        setEditMode(true)
                      }}
                    />
                    <IconBtn
                      label={'close'}
                      Icon={<Close />}
                      onClick={e => {
                        e.stopPropagation()
                        setEditMode(false)
                        setName(agentData.name)
                      }}
                    />
                  </div>
                </Box>
              </>
            ) : (
              <Typography variant="h5">{agentData.name}</Typography>
            )}
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
          checked={agentData.enabled ? true : false}
          onChange={() => {
            setSelectedAgent({
              ...agentData,
              enabled: agentData.enabled ? false : true,
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
