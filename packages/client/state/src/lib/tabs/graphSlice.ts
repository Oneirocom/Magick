import { Slice, createSlice } from '@reduxjs/toolkit'
import {
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  applyNodeChanges,
} from 'reactflow'

export type GraphState = {
  nodes: Node[]
  edges: Edge[]
}

const initialState: GraphState = {
  nodes: [],
  edges: [],
}

export const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    setNodes: (state, action) => {
      state.nodes = action.payload
    },
    setEdges: (state, action) => {
      state.edges = action.payload
    },
    onEdgesChange: (state, action) => {
      state.edges = applyEdgeChanges(action.payload, state.edges)
    },
    onNodesChange: (state, action) => {
      state.nodes = applyNodeChanges(action.payload, state.nodes)
    },
    onConnect: (state, action) => {
      state.edges = addEdge(action.payload, state.edges)
    },
  },
})

export const { setNodes, setEdges, onEdgesChange, onNodesChange, onConnect } =
  graphSlice.actions

export default graphSlice.reducer
