import {
  NodeCategory,
  SocketsList,
  makeFlowNodeDefinition,
} from '@magickml/behave-graph'

export const flowSwitch = makeFlowNodeDefinition({
  typeName: 'flow/switch',
  aliases: [],
  category: NodeCategory.Flow,
  label: 'Switch',
  configuration: {
    hiddenProperties: {
      valueType: 'array',
      defaultValue: [
        'hiddenProperties',
        'textEditorOptions',
        'textEditorData',
        'socketValues',
      ],
    },
    socketValues: {
      valueType: 'array',
      defaultValue: ['flow'],
    },
    socketOutputs: {
      valueType: 'array',
      defaultValue: [],
    },
  },
  in: {
    flow: 'flow',
    string: 'string',
  },
  initialState: undefined,
  out: configuration => {
    const startSockets = [{ key: 'default', valueType: 'flow' }]

    const socketArray = configuration?.socketOutputs.length
      ? configuration.socketOutputs
      : []

    const sockets: SocketsList =
      socketArray.map(socketOutput => {
        return {
          key: socketOutput.name,
          name: socketOutput.name,
          valueType: socketOutput.valueType,
        }
      }) || []

    return [...startSockets, ...sockets]
  },
  triggered: ({ read, commit, configuration }) => {
    const string = read('string') as string

    const outputs = configuration.socketOutputs
    const outputMap = outputs.map(output => {
      return output.name
    })

    if (outputMap.includes(string)) {
      commit(string)
    } else {
      commit('default')
    }
  },
})
