import {
  NodeCategory,
  OutputSocketSpecJSON,
  SocketsList,
  makeFunctionNodeDefinition,
} from '@magickml/behave-graph'
import { parseValue } from '../../utils/parseValue'

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
    const startSockets = [] as any[]

    const socketArray = configuration?.socketOutputs.length
      ? configuration.socketOutputs
      : []

    const sockets: SocketsList =
      socketArray.map((socketOutput: OutputSocketSpecJSON) => {
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
    configuration.socketOutputs.forEach(
      (socketOutput: OutputSocketSpecJSON) => {
        let value = object[socketOutput.name]

        value = parseValue(value, socketOutput.valueType)

        write(socketOutput.name, value)
      }
    )
  },
})
