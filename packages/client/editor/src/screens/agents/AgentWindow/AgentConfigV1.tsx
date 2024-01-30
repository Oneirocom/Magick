import { ClientPluginManager, pluginManager } from 'shared/core'
import { Input, Tooltip } from '@mui/material'
import AgentPubVariables from './AgentPubVariables'
import { tooltip_text } from './tooltip_texts'
import styles from './index.module.scss'
import { useEffect, useState } from 'react'
import { RootState, setCurrentSpellReleaseId, useGetSpellReleasesByAgentIdQuery, useGetSpellsByReleaseIdQuery, useLazyGetSpellQuery } from 'client/state'
import { SpellInterface, SpellReleaseInterface } from 'server/schemas'
import { useDispatch, useSelector } from 'react-redux'
import { enqueueSnackbar } from 'notistack'
import SpellVersionSelector from './SpellVersionSelector'

/**
 * RenderComp renders the given component with the given props.
 *
 * @param props - The properties of the component to render.
 */
const RenderComp = (props: any) => {
  return <props.element props={props} />
}

export const AgentConfigV1 = ({ selectedAgentData, setSelectedAgentData, onLoadEnables, update, isDraft }) => {
  const dispatch = useDispatch()
  const { currentSpellReleaseId } = useSelector<
    RootState,
    RootState['globalConfig']
  >(state => state.globalConfig)
  const [getSpellById, { data: rootSpell }] = useLazyGetSpellQuery({})
  const [enable] = useState(onLoadEnables)

  const { data: spellListData } = useGetSpellsByReleaseIdQuery({
    spellReleaseId: currentSpellReleaseId || null,
  })
  const { data: spellReleaseData } = useGetSpellReleasesByAgentIdQuery({
    agentId: selectedAgentData?.id,
  })
  const [spellList, setSpellList] = useState<SpellInterface[]>([])
  const [spellReleaseList, setSpellReleaseList] = useState<SpellReleaseInterface[]>([])

  const onSpellVersionChange = async (spellReleaseId: string) => {
    try {
      await dispatch(setCurrentSpellReleaseId(spellReleaseId))
      enqueueSnackbar('Updated spell version', { variant: 'success' })
    } catch (e) {
      enqueueSnackbar('Error updating spell version', { variant: 'error' })
    }
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


  useEffect(() => {
    if (!selectedAgentData) return

    // if root spell is the same as the last one, return
    if (rootSpell && rootSpell.id === selectedAgentData.rootSpellId) return

    // Fetch root spell if available
    selectedAgentData?.rootSpellId &&
      getSpellById({ id: selectedAgentData.rootSpellId })
    selectedAgentData?.rootSpell?.id &&
      getSpellById({ id: selectedAgentData.rootSpell.id })

    // Set spell list and release list
    spellListData && setSpellList(spellListData)
    spellReleaseData && setSpellReleaseList(spellReleaseData)
  }, [selectedAgentData, spellListData, spellReleaseData, getSpellById])

  useEffect(() => {
    // Update public variables based on rootSpell
    rootSpell && updatePublicVar(rootSpell)
  }, [rootSpell])

  useEffect(() => {
    if (!spellReleaseData) return
    setSpellReleaseList(spellReleaseData.data)
  }, [spellReleaseData])

  useEffect(() => {
    if (rootSpell) {
      updatePublicVar(rootSpell)
    }
  }, [rootSpell])


  return (
    <>
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
      <div className="form-item agent-select">
        <Tooltip
          title={tooltip_text.rootSpell}
          placement="right"
          disableInteractive
          arrow
        >
          <span className="form-item-label">Root Spell</span>
        </Tooltip>
        <select
          name="rootSpell"
          id="rootSpellId"
          value={
            selectedAgentData?.rootSpellId ||
            selectedAgentData?.rootSpell?.id ||
            'default'
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
          {spellList &&
            spellList?.length > 0 &&
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
      <div>
        {(pluginManager as ClientPluginManager)
          .getSecrets(true)
          .map((value, index) => {
            return (
              <div key={value.name + index} style={{ marginBottom: '1em' }}>
                <Tooltip
                  title={tooltip_text[value.name]}
                  placement="right"
                  disableInteractive
                  arrow
                >
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
                    Object.keys(
                      JSON.parse(selectedAgentData.secrets || '{}')
                    ).length !== 0
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
        {(pluginManager as ClientPluginManager)
          .getAgentComponents()
          .map((value, index, array) => {
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
      <div style={{ height: 50 }}></div>
    </>
  )
}