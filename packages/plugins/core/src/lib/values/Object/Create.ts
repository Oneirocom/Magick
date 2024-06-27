import {
  InputSocketSpecJSON,
  NodeCategory,
  SocketsList,
  makeFunctionNodeDefinition,
} from '@magickml/behave-graph'

export const ObjectCreate = makeFunctionNodeDefinition({
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
    const startSockets: SocketsList = []

    const socketArray = configuration?.socketInputs.length
      ? configuration.socketInputs
      : []

    const sockets: SocketsList =
      socketArray.map((socketInput: InputSocketSpecJSON) => {
        return {
          key: socketInput.name,
          name: socketInput.name,
          valueType: socketInput.valueType,
        }
      }) || []

    return [...startSockets, ...sockets]
  },
  out: {
    object: 'object',
  },
  exec: async ({ read, write, configuration }) => {
    const newArray = configuration.socketInputs.reduce(
      (acc: any, socketInput: InputSocketSpecJSON) => {
        const item = read(socketInput.name)
        acc[socketInput.name] = item
        return acc
      },
      {}
    )

    write('object', newArray)
  },
})
