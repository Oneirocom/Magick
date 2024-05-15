import {
  NodeCategory,
  SocketsList,
  makeFunctionNodeDefinition,
} from '@magickml/behave-graph'

export const objectDestructure = makeFunctionNodeDefinition({
  typeName: 'logic/object/destructure',
  aliases: [],
  category: NodeCategory.Logic,
  label: 'Destructure',
  configuration: {
    hiddenProperties: {
      valueType: 'array',
      defaultValue: [
        'hiddenProperties',
        'textEditorOptions',
        'textEditorData',
        'socketValues',
      ],
    },
    socketValues: {
      valueType: 'array',
      defaultValue: [
        'string',
        'array',
        'boolean',
        'integer',
        'float',
        'object',
      ],
    },
    socketOutputs: {
      valueType: 'array',
      defaultValue: [],
    },
  },
  in: {
    object: 'object',
  },
  out: configuration => {
    const startSockets = []

    const socketArray = configuration?.socketOutputs.length
      ? configuration.socketOutputs
      : []

    const sockets: SocketsList =
      socketArray.map(socketOutput => {
        return {
          key: socketOutput.name,
          name: socketOutput.name,
          valueType: socketOutput.valueType,
        }
      }) || []

    return [...startSockets, ...sockets]
  },
  exec: ({ write, read, configuration }) => {
    const object = (read('object') as Record<string, any>) || {}
    configuration.socketOutputs.forEach(socketOutput => {
      const value = object[socketOutput.name]
      write(socketOutput.name, value)
    })
  },
})
