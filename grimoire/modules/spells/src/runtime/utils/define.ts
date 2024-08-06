import {
  type GraphJSON,
  type IRegistry,
  type GraphInstance,
  readGraphFromJSON,
} from '@magickml/behave-graph'

export function defineSpellGraph(graphDefinition: GraphJSON): GraphInstance {
  // TODO: Get the real registry
  const registry = {} as IRegistry
  return readGraphFromJSON({ graphJson: graphDefinition, registry })
}
