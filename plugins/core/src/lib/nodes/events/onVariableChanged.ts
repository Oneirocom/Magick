import {
  Assert,
  InputSocketSpecJSON,
  NodeCategory,
  SocketsList,
} from '@magickml/behave-graph'
import { makeMagickEventNodeDefinition } from 'server/grimoire'
import { CORE_DEP_KEYS } from 'servicesShared'
import {
  VariableService,
  VariableServiceEvents,
} from '../../services/variableService'
import { EventPayload } from 'servicesShared'

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
        socketArray.map((socketInput: InputSocketSpecJSON) => {
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

      const variableId = configuration.variableId
      if (!variableId) return

      const variable = graph.variables[variableId]
      if (!variable) return

      const variableName = variable.name

      const onVariableChangedEvent = ({
        value,
        event,
      }: {
        value: string
        event: EventPayload
      }) => {
        const output = configuration.socketOutputs[0]
        handleState(event, false)
        write(output.name, value)
        commit('flow', () => {
          finish()
        })
      }

      variableService.on(variableName, onVariableChangedEvent)

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
