import {
  NodeCategory,
  SocketsList,
  makeFunctionNodeDefinition,
} from '@magickml/behave-graph'
import { IVariableService } from '../../services/variableService'

export const variableGet = makeFunctionNodeDefinition({
  typeName: 'variables/get',
  category: NodeCategory.Query,
  label: 'Get',
  configuration: {
    hiddenProperties: {
      valueType: 'array',
      defaultValue: [
        'hiddenProperties',
        'variableId',
        'socketOutputs',
        'label',
      ],
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
  out: configuration => {
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
  exec: async ({
    write,
    graph: { variables, getDependency },
    configuration,
  }) => {
    const variable = variables[configuration.variableId]
    const output = configuration.socketOutputs[0]

    if (!variable) return

    const variableService = getDependency<IVariableService>('IVariableService')

    if (!variableService) return

    // pass in config object as well.  Lets us check things like if the variable is stored globally, on event, etc.
    const value = await variableService.getVariable(variable.name)

    if (value === undefined) {
      // set the variable to the default value
      await variableService.setVariable(variable.name, variable.initialValue)
      write(output.name, variable.initialValue)
    }

    write(output.name, value)
  },
})
