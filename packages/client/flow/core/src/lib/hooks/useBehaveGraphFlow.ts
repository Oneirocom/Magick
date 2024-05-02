import { GraphJSON, NodeSpecJSON } from '@magickml/behave-graph'
import { useCallback, useEffect, useState } from 'react'
import { behaveToFlow } from '../utils/transformers/behaveToFlow'
import { flowToBehave } from '../utils/transformers/flowToBehave'
import { autoLayout } from '../utils/autoLayout'
import { hasPositionMetaData } from '../utils/hasPositionMetaData'
import { useCustomNodeTypes } from './useCustomNodeTypes'
import { Tab, usePubSub } from '@magickml/providers'
import {
  selectTabEdges,
  selectTabNodes,
  setNodes,
  setEdges,
  onEdgesChange,
  onNodesChange,
  onConnect,
  graphActions,
  // setIsDirty,
  // selectIsDirty,
} from 'client/state'
import { useDispatch, useSelector } from 'react-redux'
import { debounce } from 'lodash'
import { SpellInterfaceWithGraph } from 'server/schemas'

/**
 * Hook that returns the nodes and edges for react-flow, and the graphJson for the behave-graph.
 * If nodes or edges are changes, the graph json is updated automatically.
 * The graph json can be set manually, in which case the nodes and edges are updated to match the graph json.
 * The graph json is also updated when the specJson changes.
 * @returns
 */
export const useBehaveGraphFlow = ({
  spell,
  specJson,
  tab,
}: {
  spell: SpellInterfaceWithGraph
  specJson: NodeSpecJSON[] | undefined
  tab: Tab
}) => {
  const { events, publish, subscribe } = usePubSub()
  const { $RELOAD_GRAPH } = events
  const dispatch = useDispatch()
  const nodes = useSelector(selectTabNodes(tab.id))
  const edges = useSelector(selectTabEdges(tab.id))
  // TODO: we need to set isDirty to false somewhere. currently future state gets weird
  // const isDirty = useSelector(selectIsDirty)

  const [graphJson, setStoredGraphJson] = useState<GraphJSON | undefined>()

  const setGraphJson = useCallback(
    (graphJson: GraphJSON) => {
      if (!graphJson) return

      const [nodes, edges] = behaveToFlow(graphJson, spell)

      if (hasPositionMetaData(graphJson) === false) {
        autoLayout(nodes, edges)
      }
      setNodes(tab.id, nodes)
      setEdges(tab.id, edges)
      setStoredGraphJson(graphJson)
    },
    [spell]
  )

  useEffect(() => {
    // we only want to do this on initial load
    // since the graph json is kept in sync with the nodes and edges
    if (!spell || graphJson) return
    setGraphJson(spell.graph)
  }, [spell, setGraphJson])

  useEffect(() => {
    if (!graphJson) return
    dispatch(graphActions.setGraphJson({ tabId: tab.id, graphJson }))
  }, [graphJson])

  // Make sure we are only doing this conversion when the graph changes
  // Debounce because changes stream in.
  const debouncedUpdate = useCallback(
    debounce((specJson, spell) => {
      const graphJson = flowToBehave(nodes, edges, specJson, spell.graph)
      setStoredGraphJson(graphJson)
      publish(events.$SAVE_SPELL_DIFF(tab.id), { graph: graphJson })
    }, 1000),
    [nodes, edges] // Dependencies array is empty to ensure this function is created once
  )

  useEffect(() => {
    if (!specJson || !spell) return

    debouncedUpdate(specJson, spell)

    // Cleanup function to cancel the debounced call if component unmounts
    return () => {
      debouncedUpdate.cancel()
    }
  }, [debouncedUpdate, nodes, edges, specJson, spell])

  useEffect(() => {
    const reloadGraphEvent = subscribe($RELOAD_GRAPH(tab.id), (event, data) => {
      setGraphJson(data.spellState.graph)
    })

    return () => {
      reloadGraphEvent()
    }
  }, [$RELOAD_GRAPH, tab.id, setGraphJson, subscribe])

  const nodeTypes = useCustomNodeTypes({
    spellId: spell.id,
    specJson,
  })

  return {
    nodes,
    edges,
    onConnect,
    onEdgesChange,
    onNodesChange,
    setGraphJson,
    graphJson,
    nodeTypes,
  }
}

export type BehaveGraphFlow = ReturnType<typeof useBehaveGraphFlow>
