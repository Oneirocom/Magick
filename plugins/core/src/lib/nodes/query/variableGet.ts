import {
  NodeCategory,
  SocketsList,
  makeFunctionNodeDefinition,
} from '@magickml/behave-graph'
import { IVariableService } from '../../services/variableService'
import { CORE_DEP_KEYS } from '../../config'

export const variableGet = makeFunctionNodeDefinition({
  typeName: 'variables/get',
  category: NodeCategory.Variable,
  label: 'Get',
  configuration: {
    hiddenProperties: {
      valueType: 'array',
      defaultValue: [
        'hiddenProperties',
        'variableId',
        'socketOutputs',
        'label',
        'valueTypeName',
      ],
    },
    variableId: {
      valueType: 'string',
      defaultValue: '',
    },
    valueTypeName: {
      valueType: 'string',
      defaultValue: 'string',
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

    const variableService = getDependency<IVariableService>(
      CORE_DEP_KEYS.I_VARIABLE_SERVICE
    )

    if (!variableService) return

    // pass in config object as well.  Lets us check things like if the variable is stored globally, on event, etc.
    let value = await variableService.getVariable(variable.name)

    if (value === undefined) {
      // set the variable to the default value
      value = variable.initialValue
    }

    // parse value to the correct type
    switch (configuration.valueTypeName) {
      case 'integer':
        value = BigInt(value)
        break
      case 'float':
        value = parseFloat(value)
        break
      case 'boolean':
        value = Boolean(value)
        break
      case 'string':
        value = String(value)
        break
      case 'array':
        value = Array.isArray(value) ? value : [value]
        break
      case 'object':
        value = typeof value === 'object' ? value : {}
        break
      default:
        break
    }

    write(output.name, value)
  },
})
