import {
  NodeCategory,
  SocketsList,
  makeFlowNodeDefinition,
} from '@magickml/behave-graph'

export const ObjectCreate = makeFlowNodeDefinition({
  typeName: 'action/object/create',
  category: NodeCategory.Action,
  label: 'Object Create',
  configuration: {
    hiddenProperties: {
      valueType: 'array',
      defaultValue: ['hiddenProperties', 'valueTypes', 'valueTypeOptions'],
    },
    socketValues: {
      valueType: 'array',
      defaultValue: ['string', 'array', 'boolean', 'integer'],
    },
    socketInputs: {
      valueType: 'array',
      defaultValue: [],
    },
  },
  in: configuration => {
    const startSockets: SocketsList = [{ key: 'flow', valueType: 'flow' }]

    const socketArray = configuration?.socketInputs.length
      ? configuration.socketInputs
      : []

    const sockets: SocketsList =
      socketArray.map(socketInput => {
        return {
          key: socketInput.name,
          name: socketInput.name,
          valueType: socketInput.valueType,
        }
      }) || []

    return [...startSockets, ...sockets]
  },
  out: {
    flow: 'flow',
    object: 'object',
  },
  initialState: undefined,
  triggered: async ({ commit, read, write, configuration }) => {
    const newArray = configuration.socketInputs.reduce((acc, socketInput) => {
      const item = read(socketInput.name)
      acc[socketInput.name] = item
      return acc
    }, {})

    write('object', newArray)
    commit('flow')
  },
})
