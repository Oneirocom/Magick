import {
  NodeCategory,
  SocketsList,
  makeFlowNodeDefinition,
} from '@magickml/behave-graph'

export const jsonStringify = makeFlowNodeDefinition({
  typeName: 'action/json/stringify',
  category: NodeCategory.Action,
  label: 'Json Stringify',
  configuration: {
    hiddenProperties: {
      valueType: 'array',
      defaultValue: [
        'hiddenProperties',
        'valueTypes',
        'socketInputs',
        'valueTypeOptions',
      ],
    },
    valueType: {
      valueType: 'string',
      defaultValue: '',
    },
    valueTypeOptions: {
      valueType: 'object',
      defaultValue: {
        values: ['string', 'number', 'float', 'boolean', 'object', 'array'],
        socketName: 'Item',
      },
    },
    socketInputs: {
      valueType: 'array',
      defaultValue: [],
    },
  },
  in: configuration => {
    const startSockets: SocketsList = [{ key: 'flow', valueType: 'flow' }]

    const socketArray =
      configuration?.socketInputs?.length > 0 ? configuration.socketInputs : []

    return [...startSockets, ...socketArray]
  },
  out: {
    flow: 'flow',
    string: 'string',
  },
  initialState: undefined,
  triggered: ({ commit, read, write, configuration }) => {
    const options = configuration?.valueTypeOptions
    const value = read(options.socketName)

    debugger
    const string = JSON.stringify(value)
    write('string', string)
    commit('flow')
  },
})
