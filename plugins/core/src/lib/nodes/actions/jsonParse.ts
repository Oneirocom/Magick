import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { jsonrepair } from 'jsonrepair'

export const jsonParse = makeFlowNodeDefinition({
  typeName: 'action/json/parse',
  category: NodeCategory.Action,
  label: 'Json Parse',
  in: {
    json: 'string',
    flow: 'flow',
  },
  out: {
    object: 'object',
    flow: 'flow',
  },
  initialState: undefined,
  triggered: ({ read, write, commit }) => {
    const json = read('json') as string
    const repaired = jsonrepair(json)
    const object = JSON.parse(repaired as string)
    write('object', object)
    commit('flow')
  },
})
