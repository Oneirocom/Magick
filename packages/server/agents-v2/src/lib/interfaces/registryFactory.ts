import { GraphNodes, IGraph, IRegistry } from '@magickml/behave-graph'

export type RegistryFactory = () => Promise<{
  registry: IRegistry
  init: (graph: IGraph, graphNodes: GraphNodes) => void
}>
