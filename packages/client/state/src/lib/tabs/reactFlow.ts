import { graphActions } from './graphSlice'

import { createStore } from '../store'
import { Connection, Edge, EdgeChange, Node, NodeChange } from 'reactflow'

export const setNodes = (nodes: Node[]) => {
  const store = createStore()
  store.dispatch(graphActions.setNodes(nodes))
}

export const setEdges = (edges: Edge[]) => {
  const store = createStore()
  store.dispatch(graphActions.setEdges(edges))
}

export const onNodesChange = (nodes: NodeChange[]) => {
  const store = createStore()
  store.dispatch(graphActions.onNodesChange(nodes))
}

export const onEdgesChange = (edges: EdgeChange[]) => {
  const store = createStore()
  store.dispatch(graphActions.onEdgesChange(edges))
}

export const onConnect = (connection: Connection) => {
  const store = createStore()
  store.dispatch(graphActions.onConnect(connection))
}
