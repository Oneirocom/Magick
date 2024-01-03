import {
  NodeCategory,
  SocketsList,
  Variable,
  makeFunctionNodeDefinition,
} from '@magickml/behave-graph'

export const variableGet = makeFunctionNodeDefinition({
  typeName: 'variables/get',
  category: NodeCategory.Query,
  label: 'Get',
  configuration: {
    hiddenProperties: {
      valueType: 'array',
      defaultValue: ['hiddenProperties', 'variableId', 'socketOutputs'],
    },
    variableId: {
      valueType: 'string',
      defaultValue: '',
    },
    variableNames: {
      valueType: 'array',
      defaultValue: [],
    },
    socketOutputs: {
      valueType: 'array',
      defaultValue: [],
    },
  },
  in: {},
  out: (configuration, graph) => {
    const socketArray = configuration?.socketOutputs.length
      ? configuration.socketOutputs
      : []

    const sockets: SocketsList =
      socketArray.map(socketInput => {
        return {
          key: socketInput.name,
          name: socketInput.name,
          valueType: socketInput.valueType,
        }
      }) || []

    return sockets
  },
  exec: async ({ write, graph: { variables }, configuration }) => {
    const variable = variables[configuration.variableId]
    const output = configuration.socketOutputs[0]

    if (!variable) return

    write(output.name, variable.get())
  },
})
