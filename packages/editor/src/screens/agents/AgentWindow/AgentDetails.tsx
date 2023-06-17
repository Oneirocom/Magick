// DOCUMENTED
import { IconBtn, CustomizedSwitch } from '@magickml/client-core'
import { ClientPluginManager, pluginManager } from '@magickml/core'
import { DEFAULT_USER_TOKEN, STANDALONE } from '@magickml/config'

import { Close, Done, Edit } from '@mui/icons-material'
import { Avatar, Button, Input, Typography, Tooltip } from '@mui/material'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useConfig } from '@magickml/client-core'
import AgentPubVariables from './AgentPubVariables'
import styles from './index.module.scss'
import validateSpellData from './spellValidator'

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
  const [updateNeeded, setUpdateNeeded] = useState<boolean>(false)
  const [enable, setEnable] = useState(onLoadEnables)
  const globalConfig = useSelector((state: any) => state.globalConfig)
  const token = globalConfig?.token
  const headers = STANDALONE
    ? { Authorization: `Bearer ${DEFAULT_USER_TOKEN}` }
    : { Authorization: `Bearer ${token}` }

  /**
   * update agent data by agent id.
   *
   * @param id - Agent id to update.
   * @param data - Data to update.
   */
  const update = (id: string, data = undefined) => {
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
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(data => {
        enqueueSnackbar('Updated agent', {
          variant: 'success',
        })
        setSelectedAgentData(data)

        // update data instead of refetching data to avoid agent window flashes
        updateData(data)
        setUpdateNeeded(false)
      })
      .catch(e => {
        console.error('ERROR', e)
        enqueueSnackbar(e, {
          variant: 'error',
        })
      })
  }

  /**
   * export the agent data to a file.
   */
  const exportAgent = () => {
    const fileName = 'agent'

    const exportAgentData = { ...selectedAgentData }

    exportAgentData.secrets = {}

    Object.keys(exportAgentData.data).forEach(key => {
      if (
        key.includes('api') ||
        key.includes('token') ||
        key.includes('secret')
      ) {
        delete exportAgentData.data[key]
      }
    })

    const json = JSON.stringify(exportAgentData, null, 4)

    const blob = new Blob([json], { type: 'application/json' })
    const url = window.URL.createObjectURL(new Blob([blob]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${fileName}.agent.json`)
    // Append to html link element page
    document.body.appendChild(link)
    // Start download
    link.click()
    if (!link.parentNode) return
    // Clean up and remove the link
    link.parentNode.removeChild(link)
  }

  const isPublicVarsChanged = (old, newObj): boolean => {
    // Get the keys of both objects
    const oldObjKeys = Object.keys(old);
    const newObjKeys = Object.keys(newObj);

    // Check if the number of keys is different
    if (oldObjKeys.length !== newObjKeys.length) {
      return true;
    }

    // Compare property values
    for (const prop in old) {
      //Check if the value prop of inner object has changed
      if (old[prop].value !== newObj[prop].value) {
        return true;
      }
    }

    return false;
  }

  const formatPublicVars = (nodes) => {
    return Object.values(nodes)
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
  }

  const updatePublicVar = (spell) => {
    setSelectedAgentData({
      ...selectedAgentData,
      rootSpell: spell,
      publicVariables: JSON.stringify(formatPublicVars(spell.graph.nodes)),
    })
  }

  useEffect(() => {
    ; (async () => {
      await fetch(
        `${config.apiUrl}/spells?projectId=${config.projectId}`,
        { headers }
      ).then(async res => {
        const json = await res.json()
        setSpellList(json.data)
        if (selectedAgentData.rootSpell?.name) {
          const rootSpell = json.data.find(
            spell => spell.name === selectedAgentData.rootSpell?.name
          )

          if (isPublicVarsChanged(JSON.parse(selectedAgentData.publicVariables), formatPublicVars(rootSpell.graph.nodes))) {
            updatePublicVar(rootSpell)
            setUpdateNeeded(true)
          }
        }

      }).catch(err => {
        enqueueSnackbar(err.message, {
          variant: 'error',
        })
      })

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
              !selectedAgentData.rootSpell || !selectedAgentData.rootSpell.id
                ? 'Root Spell must be set before enabling the agent'
                : ''
            }
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
                disabled={
                  !selectedAgentData.rootSpell || !selectedAgentData.rootSpell.id
                }
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
            disabled={!updateNeeded}
            style={{
              margin: '1em',
              color: 'white',
              backgroundColor: updateNeeded ? 'purple' : '#424242',
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
            onClick={() => exportAgent()}
          >
            Export
          </Button>
        </div>
      </div>
      <div className="form-item agent-select">
        <span className="form-item-label">Root Spell</span>
        <select
          style={{
            appearance: 'none',
          }}
          name="rootSpell"
          id="rootSpell"
          value={selectedAgentData.rootSpell?.name || 'default'}
          onChange={event => {
            const newRootSpell = spellList.find(
              spell => spell.name === event.target.value
            )
            const inputs = (pluginManager as ClientPluginManager).getInputByName()
            const plugin_list = (pluginManager as ClientPluginManager).getPlugins()
            for (const key of Object.keys(plugin_list)) {
              if (!newRootSpell) continue
              plugin_list[key] = validateSpellData(newRootSpell, inputs[key])
            }
            setEnable(plugin_list)
            enqueueSnackbar(
              'Greyed out components are not available because of the selected spell.',
              {
                variant: 'info',
              }
            )
            setSelectedAgentData({
              enabled: true,
              ...selectedAgentData,
            })
            updatePublicVar(newRootSpell)
            setUpdateNeeded(true)
          }}
        >
          <option disabled value={'default'}>
            Select Spell
          </option>
          {spellList?.length > 0 &&
            spellList.map((spell, idx) => {
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
              <div style={{ width: '100%', marginBottom: '1em' }}>
                {value.name}
              </div>
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
                  setUpdateNeeded(true)
                }}
              />
            </div>
          )
        })}
      </div>
      {selectedAgentData.publicVariables && selectedAgentData.publicVariables !== '{}' && (
        <AgentPubVariables
          setUpdateNeeded={setUpdateNeeded}
          setPublicVars={data => {
            setSelectedAgentData({
              ...selectedAgentData,
              publicVariables: JSON.stringify(data),
            })
          }}
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
            <RenderComp
              key={index}
              enable={enable}
              element={value}
              selectedAgentData={selectedAgentData}
              setSelectedAgentData={setSelectedAgentData}
              update={update}
            />
          )
        })}
      </div>
    </div>
  )
}

export default AgentDetails
