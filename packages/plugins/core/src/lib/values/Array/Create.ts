import {
  InputSocketSpecJSON,
  NodeCategory,
  SocketsList,
  makeFlowNodeDefinition,
  makeFunctionNodeDefinition,
} from '@magickml/behave-graph'

export const arrayCreate = makeFlowNodeDefinition({
  typeName: 'action/array/create',
  category: NodeCategory.Action,
  label: 'Array Create',
  configuration: {
    hiddenProperties: {
      valueType: 'array',
      defaultValue: ['hiddenProperties', 'valueTypes', 'valueTypeOptions'],
    },
    valueType: {
      valueType: 'string',
      defaultValue: 'string',
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
    flow: 'flow',
    array: 'array',
  },
  initialState: undefined,
  triggered: async ({ commit, read, write, configuration }) => {
    const newArray = configuration.socketInputs.reduce(
      (acc: any, socketInput: InputSocketSpecJSON) => {
        const item = read(socketInput.name)
        acc.push(item)
        return acc
      },
      []
    )

    write('array', newArray)
    commit('flow')
  },
})

export const arrayCreateFunction = makeFunctionNodeDefinition({
  typeName: 'logic/array/create',
  category: NodeCategory.Logic,
  label: 'Array Create',
  configuration: {
    hiddenProperties: {
      valueType: 'array',
      defaultValue: ['hiddenProperties', 'valueTypes', 'valueTypeOptions'],
    },
    valueType: {
      valueType: 'string',
      defaultValue: 'string',
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
    array: 'array',
  },
  exec: async ({ read, write, configuration }) => {
    const newArray = configuration.socketInputs.reduce(
      (acc: string[], socketInput: InputSocketSpecJSON) => {
        const item = read(socketInput.name)
        acc.push(item as string)
        return acc
      },
      []
    )

    write('array', newArray)
  },
})
