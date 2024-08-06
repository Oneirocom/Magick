import type { Spell } from '@magickml/spells/runtime/utils'
// We should re-export these from behave-graph in our node/spell packages
import {
  createNode,
  makeGraphApi,
  makeOrGenerateSockets,
} from '@magickml/behave-graph'
import { useRuntimeConfig } from 'nitro/runtime'

const exampleSpell: Spell = {
  id: 'example-spell',
  name: 'Example Spell',
  description: 'A simple example spell',
  graph: {
    name: 'Example Graph',
    nodes: {},
    variables: {},
    customEvents: {},
    metadata: {},
  },
}

// Add nodes to the graph
const graph = makeGraphApi({
  ...useRuntimeConfig().registry,
  variables: exampleSpell.graph.variables,
  customEvents: exampleSpell.graph.customEvents,
})

// e we have our defineNode definers but these behave-graph utils are still useful
// I feel like this createNode is better for programmatic use
// where our defineNode is better for declarative use/conntected to the registry/editor

const startNode = createNode({
  id: 'start',
  graph,
  registry: useRuntimeConfig().registry, // replace this with useNodeSpec()
  nodeTypeName: 'lifecycle/onStart',
})

const logNode = createNode({
  id: 'log',
  graph,
  registry: useRuntimeConfig().registry,
  nodeTypeName: 'debug/log',
  nodeConfiguration: {
    text: 'Hello from Example Spell!',
  },
})

exampleSpell.graph.nodes[startNode.id] = startNode
exampleSpell.graph.nodes[logNode.id] = logNode

// implement sometihng like this to grab node config
// const nodeConfig = useNodeSpec()

// we can store a node config in the nitro object
// or generate on the fly

export default exampleSpell
