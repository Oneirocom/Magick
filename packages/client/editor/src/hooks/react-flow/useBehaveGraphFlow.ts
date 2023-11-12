import { GraphJSON, NodeSpecJSON } from '@magickml/behave-graph'
import { useCallback, useEffect, useState } from 'react'
import { Node, Edge, NodeChange, EdgeChange, Connection } from 'reactflow'

import { behaveToFlow } from '../../utils/transformers/behaveToFlow.js'
import { flowToBehave } from '../../utils/transformers/flowToBehave.js'
import { autoLayout } from '../../utils/autoLayout.js'
import { hasPositionMetaData } from '../../utils/hasPositionMetaData.js'
import { useCustomNodeTypes } from './useCustomNodeTypes.js'
import { Tab } from '@magickml/providers'
import {
  selectTabEdges,
  selectTabNodes,
  setNodes as _setNodes,
  setEdges as _setEdges,
  onEdgesChange as _onEdgesChange,
  onNodesChange as _onNodesChange,
  onConnect as _onConnect,
} from 'client/state'
import { useDispatch, useSelector } from 'react-redux'

export const fetchBehaviorGraphJson = async (url: string) =>
  // eslint-disable-next-line unicorn/no-await-expression-member
  (await (await fetch(url)).json()) as GraphJSON

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
  const dispatch = useDispatch()

  const nodes = useSelector(selectTabNodes(tab.id))
  const edges = useSelector(selectTabEdges(tab.id))

  const setNodes = (nodes: Node[]) => {
    dispatch(_setNodes(nodes))
  }

  const setEdges = (edges: Edge[]) => {
    dispatch(_setEdges(edges))
  }

  const onNodesChange = (nodes: NodeChange[]) => {
    dispatch(_onNodesChange(nodes))
  }

  const onEdgesChange = (edges: EdgeChange[]) => {
    dispatch(_onEdgesChange(edges))
  }

  const onConnect = (connection: Connection) => {
    dispatch(_onConnect(connection))
  }

  const [graphJson, setStoredGraphJson] = useState<GraphJSON | undefined>()

  const setGraphJson = useCallback((graphJson: GraphJSON) => {
    if (!graphJson) return

    const [nodes, edges] = behaveToFlow(graphJson)

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

  useEffect(() => {
    if (!specJson) return
    console.log('Udating stored graph json')
    // when nodes and edges are updated, update the graph json with the flow to behave behavior
    const graphJson = flowToBehave(nodes, edges, specJson)
    setStoredGraphJson(graphJson)
  }, [nodes, edges, specJson])

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
