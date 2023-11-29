import { GraphJSON, NodeSpecJSON } from '@magickml/behave-graph'
import { useCallback, useEffect, useState } from 'react'

import { behaveToFlow } from '../../utils/transformers/behaveToFlow.js'
import { flowToBehave } from '../../utils/transformers/flowToBehave.js'
import { autoLayout } from '../../utils/autoLayout.js'
import { hasPositionMetaData } from '../../utils/hasPositionMetaData.js'
import { useCustomNodeTypes } from './useCustomNodeTypes.js'
import { Tab, usePubSub } from '@magickml/providers'
import {
  selectTabEdges,
  selectTabNodes,
  setNodes,
  setEdges,
  onEdgesChange,
  onNodesChange,
  onConnect,
} from 'client/state'
import { useSelector } from 'react-redux'
import { debounce } from 'lodash'

/**
 * Hook that returns the nodes and edges for react-flow, and the graphJson for the behave-graph.
 * If nodes or edges are changes, the graph json is updated automatically.
 * The graph json can be set manually, in which case the nodes and edges are updated to match the graph json.
 * @param param0
 * @returns
 */
export const useBehaveGraphFlow = ({
  initialGraphJson,
  specJson,
  tab,
}: {
  initialGraphJson: GraphJSON
  specJson: NodeSpecJSON[] | undefined
  tab: Tab
}) => {
  const { events, publish } = usePubSub()
  const nodes = useSelector(selectTabNodes(tab.id))
  const edges = useSelector(selectTabEdges(tab.id))

  const [graphJson, setStoredGraphJson] = useState<GraphJSON | undefined>()

  const setGraphJson = useCallback((graphJson: GraphJSON) => {
    if (!graphJson) return

    console.log('GRAPJH JSON CALLBACK', graphJson)

    const [nodes, edges] = behaveToFlow(graphJson)

    console.log('NODES', nodes)
    console.log('EDGES', edges)

    if (hasPositionMetaData(graphJson) === false) {
      autoLayout(nodes, edges)
    }

    setNodes(nodes)
    setEdges(edges)
    setStoredGraphJson(graphJson)
  }, [])

  useEffect(() => {
    if (!initialGraphJson) return
    setGraphJson(initialGraphJson)
  }, [initialGraphJson, setGraphJson])

  // Make sure we are only doing this conversion when the graph changes
  // Debounce because changes stream in.
  const debouncedUpdate = useCallback(
    debounce(specJson => {
      const graphJson = flowToBehave(nodes, edges, specJson)
      setStoredGraphJson(graphJson)
      publish(events.$SAVE_SPELL_DIFF(tab.id), { graph: graphJson })
    }, 1000),
    [nodes, edges] // Dependencies array is empty to ensure this function is created once
  )

  useEffect(() => {
    if (!specJson) return

    debouncedUpdate(specJson)

    // Cleanup function to cancel the debounced call if component unmounts
    return () => {
      debouncedUpdate.cancel()
    }
  }, [debouncedUpdate, nodes, edges, specJson])

  const nodeTypes = useCustomNodeTypes({
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
