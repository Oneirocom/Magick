import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import {
  ArrayVariable,
  ArrayVariableData,
} from '../../values/Array/ArrayVariable'

export const jsonStringify = makeFlowNodeDefinition({
  typeName: 'action/documents/get',
  category: NodeCategory.Action,
  label: 'Get Documents (old)',
  configuration: {},
  in: {
    flow: 'flow',
    embedding: 'embedding',
    type: 'string',
    maxCount: 'integer',
    trigger: 'trigger',
  },
  out: {
    flow: 'flow',
    string: 'string',
  },
  initialState: undefined,
  triggered: ({ commit, read, write, configuration }) => {
    const options = configuration?.valueTypeOptions
    const value = read(options.socketName)
    const string = JSON.stringify(value, (_, value) => {
      if (ArrayVariable.isInstance(value)) {
        return (value as ArrayVariableData).data
      }

      return value
    })
    write('string', string)
    commit('flow')
  },
})
