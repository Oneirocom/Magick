import {
  InputSocketSpecJSON,
  NodeCategory,
  SocketsList,
  makeFlowNodeDefinition,
} from '@magickml/behave-graph'
import { IVariableService } from '../../services/variableService'
import { CORE_DEP_KEYS } from '../../config'

export const variableSet = makeFlowNodeDefinition({
  typeName: 'variables/set',
  category: NodeCategory.Variable,
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
    socketInputs: {
      valueType: 'array',
      defaultValue: [],
    },
    emitEvent: {
      valueType: 'boolean',
      defaultValue: true,
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
      variableArray.map((socketInput: InputSocketSpecJSON) => {
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
      socketArray.map((socketInput: InputSocketSpecJSON) => {
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
    const emitEvent = Boolean(configuration.emitEvent)
    const skipSend = !emitEvent

    if (!variable) return

    const variableService = getDependency<IVariableService>(
      CORE_DEP_KEYS.I_VARIABLE_SERVICE
    )

    if (!variableService) return

    await variableService.setVariable(variable.name, inputValue, skipSend)

    write(output.name, inputValue)
    commit('flow')
  },
})
