import { graphActions } from './graphSlice'

import { createStore } from '../store'
import { Connection, Edge, EdgeChange, Node, NodeChange } from 'reactflow'

export const setNodes = (tabId: string, nodes: Node[]) => {
  const store = createStore()
  store.dispatch(graphActions.setNodes({ tabId, nodes }))
}

export const setEdges = (tabId: string, edges: Edge[]) => {
  const store = createStore()
  store.dispatch(graphActions.setEdges({ tabId, edges }))
}

export const onNodesChange = (tabId: string) => {
  return (nodeChanges: NodeChange[]) => {
    const store = createStore()
    store.dispatch(graphActions.onNodesChange({ tabId, nodeChanges }))
  }
}

export const onEdgesChange = (tabId: string) => {
  return (edgeChanges: EdgeChange[]) => {
    const store = createStore()
    store.dispatch(graphActions.onEdgesChange({ tabId, edgeChanges }))
  }
}

export const onConnect = (tabId: string) => {
  return (connection: Connection) => {
    const store = createStore()
    store.dispatch(graphActions.onConnect({ tabId, connection }))
  }
}
