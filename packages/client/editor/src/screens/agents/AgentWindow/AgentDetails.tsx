// DOCUMENTED
import { CustomizedSwitch } from 'client/core'
import { ClientPluginManager, pluginManager } from 'shared/core'
import { SpellInterface } from 'server/schemas'
import { Button, Input, Tooltip } from '@mui/material'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import AgentPubVariables from './AgentPubVariables'
import styles from './index.module.scss'
import { tooltip_text } from './tooltip_texts'
import { InputEdit } from './InputEdit'

import { SmallAgentAvatarCard } from './SmallAgentAvatarCard'
import {
  RootState,
  setCurrentSpellReleaseId,
  useGetSpellsByReleaseIdQuery,
  useLazyGetSpellByJustIdQuery,
  useUpdateAgentMutation
} from 'client/state'
import SpellVersionSelector from './SpellVersionSelector'
import { useGetSpellReleasesByAgentIdQuery } from 'client/state'
import { SpellRelease } from 'packages/server/core/src/services/spellReleases/spellReleases'
import { useDispatch, useSelector } from 'react-redux'

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
  setSelectedAgentData?: any
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
  onLoadEnables,
}: AgentDetailsProps) => {
  const [updateAgent] = useUpdateAgentMutation()
  const { currentSpellReleaseId } = useSelector<RootState, RootState['globalConfig']>(
    state => state.globalConfig
  )
  const { data: spellListData } = useGetSpellsByReleaseIdQuery({
    spellReleaseId: currentSpellReleaseId || null,
  })
  const { data: spellReleaseData } = useGetSpellReleasesByAgentIdQuery({ agentId: selectedAgentData?.id })
  const [spellList, setSpellList] = useState<SpellInterface[]>([])
  const [spellReleaseList, setSpellReleaseList] = useState<SpellRelease[]>([])
  const [editMode, setEditMode] = useState<boolean>(false)
  const [oldName, setOldName] = useState<string>('')
  const [enable] = useState(onLoadEnables)

  const [getSpellById, { data: rootSpell }] = useLazyGetSpellByJustIdQuery({})
  const dispatch = useDispatch()

  const isDraft = selectedAgentData?.currentSpellReleaseId === null;

  useEffect(() => {
    if (!selectedAgentData) return;

    // Fetch root spell if available
    selectedAgentData?.rootSpellId && getSpellById({ id: selectedAgentData.rootSpellId });
    selectedAgentData?.rootSpell?.id && getSpellById(selectedAgentData.rootSpell.id);

    // Set spell list and release list
    spellListData && setSpellList(spellListData.data);
    spellReleaseData && setSpellReleaseList(spellReleaseData.data);
  }, [selectedAgentData, spellListData, spellReleaseData, getSpellById]);

  useEffect(() => {
    // Update public variables based on rootSpell
    rootSpell && updatePublicVar(rootSpell);
  }, [rootSpell]);


  useEffect(() => {
    if (!spellReleaseData) return
    setSpellReleaseList(spellReleaseData.data)
  }, [spellReleaseData])

  useEffect(() => {
    if (rootSpell) {
      updatePublicVar(rootSpell)
    }
  }, [rootSpell])

  /**
   * update agent data by agent id.
   *
   * @param id - Agent id to update.
   * @param data - Data to update.
   */
  const update = (data = {}) => {
    const _data = { ...selectedAgentData, ...data }
    // Avoid server-side validation error
    _data.enabled = _data.enabled ? true : false
    _data.updatedAt = new Date().toISOString()
    _data.secrets = _data.secrets ? _data.secrets : '{}'
    _data.pingedAt = new Date().toISOString()

    updateAgent(_data)
      .unwrap()
      .then(data => {
        enqueueSnackbar('Updated agent', {
          variant: 'success',
        })
        setSelectedAgentData(data)
      })
      .catch(e => {
        console.error(e)
        enqueueSnackbar('Error updating agent', {
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
    const spellsPublicVariables = formatPublicVars(spell.graph.nodes)
    const agentPublicVariables = JSON.parse(selectedAgentData.publicVariables)

    // combine the two objects, and replace the values of spells public variables with the agents public variables
    const newPublicVariables = {
      ...spellsPublicVariables,
      ...agentPublicVariables,
    }

    setSelectedAgentData({
      ...selectedAgentData,
      publicVariables: JSON.stringify(newPublicVariables),
      rootSpellId: spell.id,
    })
  }

  const onSpellVersionChange = async (spellReleaseId: string) => {
    try {
      await dispatch(setCurrentSpellReleaseId(spellReleaseId));
      enqueueSnackbar('Updated spell version', { variant: 'success' });
    } catch (e) {
      enqueueSnackbar('Error updating spell version', { variant: 'error' });
    }
  };

  return (
    <div style={{ overflowY: 'scroll', height: '100vh', padding: '40px 100px' }}>
      <div className={styles.agentDetailsContainer}>
        <div className={styles.agentDescription}>
          {editMode ? (
            <InputEdit
              selectedAgentData={selectedAgentData}
              setSelectedAgentData={setSelectedAgentData}
              update={() => update()}
              setEditMode={setEditMode}
              setOldName={setOldName}
              oldName={oldName}
            />
          ) : (
            <SmallAgentAvatarCard
              agent={selectedAgentData}
              setEditMode={setEditMode}
              setOldName={setOldName}
            />
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
                  update({
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
            onClick={() => update()}
            style={{
              margin: '1em',
              color: 'white',
              backgroundColor: 'var(--primary)',
            }}
          >
            Save changes
          </Button>
        </div>
      </div>
      <div className="form-item agent-select">
        <Tooltip title={tooltip_text.rootSpell} placement="right" disableInteractive arrow>
          <span className="form-item-label">Root Spell</span>
        </Tooltip>
        <select
          name="rootSpell"
          id="rootSpellId"
          value={
            selectedAgentData?.rootSpellId
            || selectedAgentData?.rootSpell?.id
            || 'default'
          }
          onChange={event => {
            setSelectedAgentData({
              ...selectedAgentData,
              rootSpellId: event.target.value,
            })
          }}
        >
          <option disabled value={'default'}>
            Select Spell
          </option>
          {spellList && spellList?.length > 0 &&
            [...spellList]
              .sort((a, b) => a.name.localeCompare(b.name)) // Sort the spellList alphabetically by name
              .map((spell, idx) => {
                return (
                  <option value={spell.id} key={idx}>
                    {spell.name}
                  </option>
                )
              })}
        </select>
      </div>
      {!isDraft && (
        <div>
          <SpellVersionSelector
            spellReleaseList={spellReleaseList}
            activeSpellReleaseId={selectedAgentData?.currentSpellReleaseId}
            onChange={onSpellVersionChange}
            tooltipText={''}
          />
        </div>
      )}
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
            setUpdateNeeded={() => {}}
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
                update={() => update()}
              />
            </Tooltip>

          )
        })}
      </div>
      <div style={{ height: 50 }}></div>
    </div>
  )
}

export default AgentDetails
