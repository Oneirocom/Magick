import { ThothComponent } from '@magickml/core'

export type ModuleComponent = ThothComponent<unknown> & {
  run: Function
}

export type NodeConnections = {
  node: number
  input?: string
  output?: string
  data: Record<string, unknown>
}

export type NodeOutputs = {
  [outputKey: string]: {
    connections: NodeConnections[]
  }
}

export type NodeData = {
  socketKey?: string
  name?: string
  [DataKey: string]: unknown
}

export type Node = {
  id: number
  data: NodeData
  name: string
  inputs: NodeOutputs
  outputs?: NodeOutputs
  position: number[]
}
export type Module = { name: string; id: string; data: Graph }

export type Spell = {
  name: string
  graph: Graph
  gameState: Record<string, unknown>
  createdAt: number
  updatedAt: number
  modules: Module[]
}

export type Graph = {
  id: string
  nodes: Record<number, Node>
}
