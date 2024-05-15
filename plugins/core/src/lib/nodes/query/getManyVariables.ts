import {
  NodeCategory,
  SocketsList,
  makeFunctionNodeDefinition,
} from '@magickml/behave-graph'
import { IVariableService } from '../../services/variableService'
import { CORE_DEP_KEYS } from '../../config'

export const getManyVariables = makeFunctionNodeDefinition({
  typeName: 'variables/getMany',
  category: NodeCategory.Query,
  label: 'Get Many Variables',
  configuration: {
    hiddenProperties: {
      valueType: 'array',
      defaultValue: ['socketValues', 'hiddenProperties'],
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
    const variableService = getDependency<IVariableService>(
      CORE_DEP_KEYS.I_VARIABLE_SERVICE
    )

    if (!variableService) return

    const outputs = configuration.socketOutputs.filter(socketOutput => {
      const variable = Object.values(variables).find(
        v => v.name === socketOutput.name
      )
      return !!variable
    })

    if (outputs.length) {
      const promises = outputs.map(async socketOutput => {
        const variable = Object.values(variables).find(
          v => v.name === socketOutput.name
        )
        if (!variable) return

        let value = variableService.getVariable(variable.name)

        if (value === undefined) {
          // set the variable to the default value
          value = variable.initialValue
        }

        write(socketOutput.name, value)
      })

      await Promise.all(promises)
    }
  },
})
