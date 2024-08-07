import { GraphJSON } from '@magickml/behave-graph'
import { MagickNodeType, MagickEdgeType } from '@magickml/client-types'
import { createAction, createReducer } from '@reduxjs/toolkit'
import {
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  applyNodeChanges,
  EdgeChange,
  Connection,
  NodeChange,
} from '@xyflow/react'

export type GraphState = {
  nodes: MagickNodeType[]
  edges: MagickEdgeType[]
  graphJson?: GraphJSON
}

export type TabState = {
  [tabId: string]: GraphState
}

const initialState: TabState = {}

const setNodes = createAction<{ tabId: string; nodes: Node[] }>(
  'graph/setNodes'
)
const setEdges = createAction<{ tabId: string; edges: Edge[] }>(
  'graph/setEdges'
)
const onEdgesChange = createAction<{
  tabId: string
  edgeChanges: EdgeChange[]
}>('graph/onEdgesChange')

const onNodesChange = createAction<{
  tabId: string
  nodeChanges: NodeChange[]
}>('graph/onNodesChange')

const onConnect = createAction<{
  tabId: string
  connection: Connection
}>('graph/onConnect')

const setGraphJson = createAction<{
  tabId: string
  graphJson: GraphJSON
}>('graph/onGraphChange')

const graphReducer = createReducer(initialState, builder => {
  builder
    .addCase(setNodes, (state, action) => {
      const { tabId, nodes } = action.payload
      if (!state[tabId]) state[tabId] = { nodes: [], edges: [] }
      state[tabId].nodes = nodes as MagickNodeType[]
    })
    .addCase(setEdges, (state, action) => {
      const { tabId, edges } = action.payload
      if (!state[tabId]) state[tabId] = { nodes: [], edges: [] }
      state[tabId].edges = edges as MagickEdgeType[]
    })
    .addCase(onEdgesChange, (state, action) => {
      const { tabId, edgeChanges } = action.payload
      if (state[tabId]) {
        state[tabId].edges = applyEdgeChanges(
          edgeChanges,
          state[tabId].edges
        ) as MagickEdgeType[]
      }
    })
    .addCase(onNodesChange, (state, action) => {
      const { tabId, nodeChanges } = action.payload
      if (state[tabId]) {
        state[tabId].nodes = applyNodeChanges(
          nodeChanges,
          state[tabId].nodes
        ) as MagickNodeType[]
      }
    })
    .addCase(onConnect, (state, action) => {
      const { tabId, connection } = action.payload
      if (state[tabId]) {
        state[tabId].edges = addEdge(
          connection,
          state[tabId].edges
        ) as MagickEdgeType[]
      }
    })
    .addCase(setGraphJson, (state, action) => {
      const { tabId, graphJson } = action.payload
      if (state[tabId]) {
        state[tabId].graphJson = graphJson
      }
    })
})

export const graphActions = {
  setNodes,
  setEdges,
  onEdgesChange,
  onNodesChange,
  onConnect,
  setGraphJson,
}

export default graphReducer
