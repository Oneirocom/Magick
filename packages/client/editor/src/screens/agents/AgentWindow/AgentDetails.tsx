// DOCUMENTED
import { IconBtn, CustomizedSwitch, useFeathers } from 'client/core'
import { ClientPluginManager, pluginManager } from 'shared/core'

import { Close, Done, Edit } from '@mui/icons-material'
import { Avatar, Button, Input, Typography, Tooltip } from '@mui/material'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useConfig } from 'client/core'
import AgentPubVariables from './AgentPubVariables'
import styles from './index.module.scss'
import { tooltip_text } from './tooltip_texts'
import { useTreeData } from '../../../../../core/client/src/contexts/TreeDataProvider'

/**
 * RenderComp renders the given component with the given props.
 *
 * @param props - The properties of the component to render.
 */
const RenderComp = (props: any) => {
  return <props.element props={props} />
}

interface AgentDetailsProps {
  selectedAgentData: any
  setSelectedAgentData: any
  updateData: (data: object) => void
  onLoadEnables: object
}

/**
 * AgentDetails component displays agent details and provides functionalities to interact with agents.
 *
 * @param selectedAgentData - The data of the selected agent.
 * @param setSelectedA gentData - Function to update the selected agent data.
 * @param updateCallback - Callback function to update data.
 * @param onLoadEnables - The boolean value to show enabled components on load.
 */
const AgentDetails = ({
  selectedAgentData,
  setSelectedAgentData,
  updateData,
  onLoadEnables,
}: AgentDetailsProps) => {
  const [spellList, setSpellList] = useState<any[]>([])
  const config = useConfig()
  const [editMode, setEditMode] = useState<boolean>(false)
  const [oldName, setOldName] = useState<string>('')
  const [enable] = useState(onLoadEnables)
  const globalConfig = useSelector((state: any) => state.globalConfig)
  const token = globalConfig?.token
  const { setAgentUpdate } = useTreeData()

  const [rootSpell, setRootSpell] = useState<any>(null)
  useEffect(() => {
    if (spellList.length === 0) {
      return
    }

    // Fix for legacy agents with no root spell id
    if (!selectedAgentData.rootSpellId && selectedAgentData.rootSpell) {
      const rootSpell = spellList.find(
        spell => spell.id === selectedAgentData.rootSpell.id
      )
      setRootSpell(rootSpell)
      return
    }

    const rootSpell = spellList.find(
      spell => spell.id === selectedAgentData.rootSpellId
    )
    setRootSpell(rootSpell)
  }, [selectedAgentData, spellList])

  const { client } = useFeathers()

  /**
   * update agent data by agent id.
   *
   * @param id - Agent id to update.
   * @param data - Data to update.
   */
  const update = (id: string, data = undefined) => {
    setAgentUpdate(false)
    const _data = data || { ...selectedAgentData }
    id = id || _data.id
    if (_data['id']) {
      delete _data.id
      delete _data?.dirty
    }

    // Avoid server-side validation error
    _data.enabled = _data.enabled ? true : false
    _data.updatedAt = new Date().toISOString()
    _data.secrets = _data.secrets ? _data.secrets : '{}'

    fetch(`${config.apiUrl}/agents/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(_data),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.statusText)
        }
        return res.json()
      })
      .then(data => {
        enqueueSnackbar('Updated agent', {
          variant: 'success',
        })
        setAgentUpdate(true)
        setSelectedAgentData(data)

        // update data instead of refetching data to avoid agent window flashes
        updateData(data)
      })
      .catch(e => {
        console.error('ERROR', e)
        enqueueSnackbar(e, {
          variant: 'error',
        })
      })
  }

  const formatPublicVars = _nodes => {
    // todo could type this better
    const nodes = Object.values(_nodes) as any[]
    return (
      nodes
        // get the public nodes
        .filter((node: { data }) => node?.data?.isPublic)
        // map to an array of objects
        .map((node: { data; id; name }) => {
          return {
            id: node?.id,
            name: node?.data?.name,
            value:
              node?.data?.value ||
              node?.data?.text ||
              node?.data?.fewshot ||
              node?.data?._var,
            type: node?.name,
          }
        })
        // map to an object with the id as the key
        .reduce((acc, cur) => {
          acc[cur.id] = cur
          return acc
        }, {})
    )
  }

  const updatePublicVar = spell => {
    setSelectedAgentData({
      ...selectedAgentData,
      rootSpellId: spell.id,
      publicVariables: JSON.stringify(formatPublicVars(spell.graph.nodes)),
    })
  }

  useEffect(() => {
    ; (async () => {
      try {
        const spells = await client.service('spells').find({
          query: {
            projectId: config.projectId,
          },
        })

        setSpellList(spells.data)

        if (selectedAgentData.rootSpellId) {
          const agentRootSpell = await client
            .service('spells')
            .get(selectedAgentData.rootSpellId)

          updatePublicVar(agentRootSpell)
        }
      } catch (err) {
        if (err instanceof Error) {
          enqueueSnackbar(err.message, {
            variant: 'error',
          })
        }
      }
    })()
  }, [])

  return (
    <div style={{ overflowY: 'scroll', height: '100vh' }}>
      <div className={styles.agentDetailsContainer}>
        <div className={styles.agentDescription}>
          {editMode ? (
            <>
              <input
                type="text"
                name="name"
                value={selectedAgentData.name}
                onChange={e =>
                  setSelectedAgentData({
                    ...selectedAgentData,
                    name: e.target.value,
                  })
                }
                placeholder="Add new agent name here"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    update(selectedAgentData.id)
                    setEditMode(false)
                    setOldName('')
                  }
                }}
              />
              <IconBtn
                label={'Done'}
                Icon={<Done />}
                onClick={e => {
                  update(selectedAgentData.id)
                  setEditMode(false)
                  setOldName('')
                }}
              />
              <IconBtn
                label={'close'}
                Icon={<Close />}
                onClick={e => {
                  setSelectedAgentData({ ...selectedAgentData, name: oldName })
                  setOldName('')
                  setEditMode(false)
                }}
              />
            </>
          ) : (
            <>
              <Avatar className={styles.avatar}>
                {selectedAgentData?.name?.slice(0, 1)[0]}{' '}
              </Avatar>
              <div>
                <Typography variant="h5">{selectedAgentData.name}</Typography>
              </div>
              <IconBtn
                label={'edit'}
                Icon={<Edit />}
                onClick={e => {
                  setEditMode(true)
                  setOldName(selectedAgentData.name)
                }}
              />
            </>
          )}
          <Tooltip
            title={
              !selectedAgentData.rootSpellId
                ? 'Root Spell must be set before enabling the agent'
                : ''
            }
            placement="right-start"
            disableInteractive
            arrow
          >
            <span style={{ marginLeft: '20px' }}>
              <CustomizedSwitch
                label={selectedAgentData.enabled ? 'On' : 'Off'}
                checked={selectedAgentData.enabled ? true : false}
                onChange={() => {
                  update(selectedAgentData.id, {
                    ...selectedAgentData,
                    enabled: selectedAgentData.enabled ? false : true,
                  })
                }}
                disabled={!selectedAgentData.rootSpellId}
                style={{
                  alignSelf: 'self-start',
                }}
              />
            </span>
          </Tooltip>
        </div>
        <div className={styles.btns}>
          <Button
            onClick={() => {
              update(selectedAgentData?.id)
            }}
            style={{
              margin: '1em',
              color: 'white',
              backgroundColor: 'var(--primary-dark)',
            }}
          >
            Update
          </Button>
        </div>
      </div>
      <div className="form-item agent-select">
        <Tooltip title={tooltip_text.rootSpell} placement="right" disableInteractive arrow>
          <span className="form-item-label">Root Spell</span>
        </Tooltip>
        <select
          style={{
            appearance: 'none',
          }}
          name="rootSpell"
          id="rootSpellId"
          value={rootSpell?.name || 'default'}
          onChange={event => {
            const newRootSpell = spellList.find(
              spell => spell.name === event.target.value
            )

            setSelectedAgentData({
              ...selectedAgentData,
              rootSpellId: newRootSpell.id,
            })

            updatePublicVar(newRootSpell)
          }}
        >
          <option disabled value={'default'}>
            Select Spell
          </option>
          {spellList?.length > 0 &&
            spellList
              .sort((a, b) => a.name.localeCompare(b.name)) // Sort the spellList alphabetically by name
              .map((spell, idx) => {
                return (
                  <option value={spell.name} key={idx}>
                    {spell.name}
                  </option>
                )
              })}
        </select>
      </div>
      <div>
        {(pluginManager as ClientPluginManager).getSecrets(true).map((value, index) => {

          return (
            <div key={value.name + index} style={{ marginBottom: '1em' }}>
              <Tooltip title={tooltip_text[value.name]} placement="right" disableInteractive arrow>
                <div style={{ width: '100%', marginBottom: '1em' }}>
                  {value.name}
                </div>
              </Tooltip>
              <Input
                type="password"
                name={value.key}
                id={value.key}
                style={{ width: '100%' }}
                value={
                  Object.keys(JSON.parse(selectedAgentData.secrets || '{}'))
                    .length !== 0
                    ? JSON.parse(selectedAgentData.secrets)[value.key]
                    : ''
                }
                onChange={event => {
                  setSelectedAgentData({
                    ...selectedAgentData,
                    secrets: JSON.stringify({
                      ...JSON.parse(selectedAgentData.secrets),
                      [value.key]: event.target.value,
                    }),
                  })
                }}
              />
            </div>
          )
        })}
      </div>
      {selectedAgentData.publicVariables &&
        selectedAgentData.publicVariables !== '{}' && (
          <AgentPubVariables
            setPublicVars={data => {
              setSelectedAgentData({
                ...selectedAgentData,
                publicVariables: JSON.stringify(data),
              })
            }}
            // todo we need to decide if we need to handle this.
            setUpdateNeeded={() => { }}
            publicVars={JSON.parse(selectedAgentData.publicVariables)}
          />
        )}
      <div
        className={`${selectedAgentData.publicVariables !== '{}'
            ? styles.connectorsLong
            : styles.connectors
          }`}
      >
        {(pluginManager as ClientPluginManager).getAgentComponents().map((value, index, array) => {

          return (
            <Tooltip title="kkkk" disableInteractive arrow>
              <RenderComp
                key={index}
                enable={enable}
                element={value}
                selectedAgentData={selectedAgentData}
                setSelectedAgentData={setSelectedAgentData}
                update={update}
              />
            </Tooltip>

          )
        })}
      </div>
    </div>
  )
}

export default AgentDetails
