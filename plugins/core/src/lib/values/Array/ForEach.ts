import {
  NodeCategory,
  SocketsList,
  makeFlowNodeDefinition,
} from '@magickml/behave-graph'

export const forEach = makeFlowNodeDefinition({
  typeName: 'flow/array/forEach',
  category: NodeCategory.Flow,
  label: 'For Each',
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
        socketName: 'Array Item',
      },
    },
    socketOutputs: {
      valueType: 'array',
      defaultValue: [],
    },
  },
  in: {
    flow: 'flow',
    array: 'array',
  },
  out: configuration => {
    const socketList: SocketsList = [
      { key: 'completed', valueType: 'flow' },
      { key: 'loopBody', valueType: 'flow' },
      { key: 'index', valueType: 'integer' },
    ]

    const options = configuration.valueTypeOptions
    const valueType = configuration.valueType
    const socketName = options.socketName
    if (socketName) {
      socketList.push({ key: socketName, valueType })
    }

    return socketList
  },
  initialState: undefined,
  triggered: ({ read, write, commit, configuration }) => {
    const options = configuration.valueTypeOptions
    const socketName = options.socketName
    const array = read('array') as any[]
    const startIndex = Number(0)
    const endIndex = Number(array.length)
    const loopBodyIteration = (i: number) => {
      if (i < endIndex) {
        write('index', i)
        write(socketName, array[Number(i)])
        commit('loopBody', () => {
          loopBodyIteration(i + 1)
        })
      } else {
        commit('completed')
      }
    }
    loopBodyIteration(startIndex)
  },
})
