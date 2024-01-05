import {
  NodeCategory,
  SocketsList,
  makeFlowNodeDefinition,
} from '@magickml/behave-graph'
import { IVariableService } from '../../services/variableService'

export const variableSet = makeFlowNodeDefinition({
  typeName: 'variables/set',
  category: NodeCategory.Query,
  label: 'Set',
  configuration: {
    hiddenProperties: {
      valueType: 'array',
      defaultValue: [
        'hiddenProperties',
        'variableId',
        'socketOutputs',
        'socketInputs',
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
    socketInputs: {
      valueType: 'array',
      defaultValue: [],
    },
    socketOutputs: {
      valueType: 'array',
      defaultValue: [],
    },
  },
  in: configuration => {
    const starterSockets = [{ key: 'flow', valueType: 'flow' }]
    const variableArray = configuration?.socketInputs.length
      ? configuration.socketInputs
      : []

    const sockets: SocketsList =
      variableArray.map(socketInput => {
        return {
          key: socketInput.name,
          name: socketInput.name,
          valueType: socketInput.valueType,
        }
      }) || []

    return [...starterSockets, ...sockets]
  },
  out: configuration => {
    const starterSockets = [{ key: 'flow', valueType: 'flow' }]
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

    return [...starterSockets, ...sockets]
  },
  initialState: undefined,
  triggered: async ({
    read,
    write,
    commit,
    graph: { variables, getDependency },
    configuration,
  }) => {
    const variable = variables[configuration.variableId]
    const output = configuration.socketOutputs[0]
    const inputName = configuration.socketInputs[0]
    const inputValue = read(inputName.name)

    if (!variable) return

    const variableService = getDependency<IVariableService>('IVariableService')

    if (!variableService) return

    await variableService.setVariable(variable.name, inputValue)

    write(output.name, inputValue)
    commit('flow')
  },
})
