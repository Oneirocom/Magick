import {
  NodeCategory,
  SocketsList,
  makeFunctionNodeDefinition,
} from '@magickml/behave-graph'
import { ArrayVariable } from './ArrayVariable'

export const arrayRandomElement = makeFunctionNodeDefinition({
  typeName: 'logic/array/randomElement',
  category: NodeCategory.Logic,
  label: 'Random Element',
  configuration: {
    hiddenProperties: {
      valueType: 'array',
      defaultValue: [
        'hiddenProperties',
        'valueTypes',
        'socketOutputs',
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
    socketOutputs: {
      valueType: 'array',
      defaultValue: [],
    },
  },
  in: {
    array: 'array',
  },
  out: configuration => {
    const startSockets: SocketsList = []

    const socketArray =
      configuration?.socketOutputs?.length > 0
        ? configuration.socketOutputs
        : []

    return [...startSockets, ...socketArray]
  },
  exec: async ({ read, write, configuration }) => {
    const options = configuration?.valueTypeOptions
    const array = read('array') as ArrayVariable<any>
    const arrayCopy = [...array]

    const item = arrayCopy[Math.floor(Math.random() * arrayCopy.length)]

    write(options?.socketName || 'Item', item)
  },
})
