import { Assert, NodeCategory, SocketsList } from '@magickml/behave-graph'
import { makeMagickEventNodeDefinition } from 'server/grimoire'
import { CORE_DEP_KEYS } from '../../config'
import {
  VariableService,
  VariableServiceEvents,
} from '../../services/variableService'

type State = {
  onVariableChangedEvent?: VariableServiceEvents['variableChanged'] | undefined
}

const makeInitialState = (): State => ({
  onVariableChangedEvent: undefined,
})

export const onVariableChanged = makeMagickEventNodeDefinition(
  {
    typeName: 'variables/on',
    category: NodeCategory.Variable,
    label: 'On Variable',
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
    initialState: makeInitialState(),
  },
  {
    init: ({
      state,
      commit,
      write,
      graph,
      finish,
      handleState,
      configuration,
    }) => {
      Assert.mustBeTrue(state.onVariableChangedEvent === undefined)
      const variableService = graph.getDependency<VariableService>(
        CORE_DEP_KEYS.I_VARIABLE_SERVICE
      )
      if (!variableService) {
        throw new Error('VariableService dependency not found')
      }

      const onVariableChangedEvent = ({ name, value, event }) => {
        if (
          configuration.variableNames.length &&
          !configuration.variableNames.includes(name)
        )
          return
        const output = configuration.socketOutputs[0]
        handleState(event, false)
        write(output.name, value)
        commit('flow', () => {
          finish()
        })
      }

      variableService.on('variableChanged', onVariableChangedEvent)

      return {
        onVariableChangedEvent,
      }
    },
    dispose: ({ graph, state }) => {
      const variableService = graph.getDependency<VariableService>(
        CORE_DEP_KEYS.I_VARIABLE_SERVICE
      )
      if (!variableService || !state.onVariableChangedEvent) return {}

      variableService.removeListener(
        'variableChanged',
        state.onVariableChangedEvent
      )

      return {
        onVariableChangedEvent: undefined,
      }
    },
  }
)