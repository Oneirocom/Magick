import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'

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
    const json = read('json')
    const object = JSON.parse(json as string)
    write('object', object)
    commit('flow')
  },
})
