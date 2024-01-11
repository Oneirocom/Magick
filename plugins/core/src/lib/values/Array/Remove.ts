import {
  NodeCategory,
  SocketsList,
  makeFlowNodeDefinition,
} from '@magickml/behave-graph'
import { ArrayVariable } from './ArrayVariable'
import { IVariableService } from '../../services/variableService'

export const arrayRemoveLast = makeFlowNodeDefinition({
  typeName: 'logic/array/removeLast',
  category: NodeCategory.Action,
  label: 'Remove Last',
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
    flow: 'flow',
    array: 'array',
  },
  out: configuration => {
    const startSockets: SocketsList = [{ key: 'flow', valueType: 'flow' }]

    const socketArray =
      configuration?.socketoutput?.length > 0 ? configuration.socketoutput : []

    return [...startSockets, ...socketArray]
  },
  initialState: undefined,
  triggered: async ({
    commit,
    read,
    write,
    configuration,
    graph: { getDependency },
  }) => {
    const options = configuration?.valueTypeOptions
    const array = read('array') as ArrayVariable<any>
    const item = array.pop()
    write(options?.socketName || 'Item', item)

    // mutate the original array in memory if we are interacting with an array variable
    if (ArrayVariable.isInstance(array) && array.key) {
      const variableService =
        getDependency<IVariableService>('IVariableService')
      await variableService?.setByKey(array.key, array)
    }
    commit('flow')
  },
})

export const arrayRemoveFirst = makeFlowNodeDefinition({
  typeName: 'logic/array/removeFirst',
  category: NodeCategory.Action,
  label: 'Remove First',
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
    flow: 'flow',
    array: 'array',
  },
  out: configuration => {
    const startSockets: SocketsList = [{ key: 'flow', valueType: 'flow' }]

    const socketArray =
      configuration?.socketOutputs?.length > 0
        ? configuration.socketOutputs
        : []

    return [...startSockets, ...socketArray]
  },
  initialState: undefined,
  triggered: async ({
    commit,
    read,
    write,
    configuration,
    graph: { getDependency },
  }) => {
    const options = configuration?.valueTypeOptions
    const array = read('array') as ArrayVariable<any>
    const item = array.shift()
    write(options?.socketName || 'Item', item)

    // mutate the original array in memory if we are interacting with an array variable
    if (ArrayVariable.isInstance(array) && array.key) {
      const variableService =
        getDependency<IVariableService>('IVariableService')
      await variableService?.setByKey(array.key, array)
    }
    commit('flow')
  },
})
