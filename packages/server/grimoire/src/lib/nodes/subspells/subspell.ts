import {
  InputSocketSpecJSON,
  NodeCategory,
  SocketsList,
} from '@magickml/behave-graph'
import { CORE_DEP_KEYS } from 'plugin/core'
import { Agent } from 'server/agents'
import { IEventStore } from '../../services/eventStore'
import { INPUT_EVENT, OUTPUT_EVENT } from '../../constants'
import { makeMagickAsyncNodeDefinition } from '../../factories/magickAsyncNode'
import { OutputData, SocketData, SpellCaster } from '../../spellCaster'

type InitialState = {
  handler: ((result: OutputData) => void) | undefined
  spellCaster: SpellCaster | undefined
}

const getInitialState = (): InitialState => ({
  handler: undefined,
  spellCaster: undefined,
})

export const runSubspell = makeMagickAsyncNodeDefinition({
  typeName: 'action/subspell/run',
  category: NodeCategory.Action,
  label: 'Run Subspell',
  configuration: {
    hiddenProperties: {
      valueType: 'array',
      defaultValue: [
        'hiddenProperties',
        'socketOutputs',
        'socketInputs',
        'label',
      ],
    },
    socketInputs: {
      valueType: 'array',
      defaultValue: [],
    },
    socketOutputs: {
      valueType: 'array',
      defaultValue: [],
    },
    spellId: {
      valueType: 'string',
      defaultValue: '',
    },
  },
  in: configuration => {
    const socketArray = configuration?.socketInputs?.length
      ? configuration.socketInputs
      : []

    const sockets: SocketsList =
      socketArray.map((socketInput: InputSocketSpecJSON) => {
        return {
          key: socketInput.name,
          name: socketInput.name,
          valueType: socketInput.valueType,
        }
      }) || []

    return sockets
  },
  out: configuration => {
    const socketArray = configuration?.socketOutputs?.length
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

    return sockets
  },
  initialState: getInitialState(),
  triggered: async ({
    read,
    write,
    commit,
    finished = () => {},
    triggeringSocketName,
    graph: { getDependency },
    configuration,
    state,
  }) => {
    if (state.handler) {
      return state
    }

    const spellId = configuration.spellId

    if (!spellId) {
      throw new Error('No spellId provided')
    }

    const agent = getDependency<Agent>(CORE_DEP_KEYS.AGENT)

    if (!agent) {
      throw new Error('No agent found')
    }

    const eventStore = getDependency<IEventStore>(CORE_DEP_KEYS.EVENT_STORE)

    if (!eventStore) {
      throw new Error('No eventStore found')
    }

    const currentEvent = eventStore.currentEvent()
    const eventKey = eventStore.getKey()

    if (!currentEvent || !eventKey) {
      throw new Error('No current event found')
    }

    const spellCaster = await agent.spellbook.getSpellcasterById(
      spellId,
      currentEvent
    )

    if (!spellCaster) {
      throw new Error('No spell caster found')
    }

    const inputs: SocketData[] = configuration.socketInputs
      .filter((socket: { valueType: string }) => socket.valueType !== 'flow')
      .map((socket: { key: string }) => {
        return {
          socketName: socket.key,
          value: read(socket.key),
        }
      })

    const handler = (result: OutputData) => {
      result.outputs.forEach(({ socketName, value }) => {
        write(socketName, value)
      })

      commit(result.flow)
      finished()
    }

    spellCaster.once(OUTPUT_EVENT, handler)

    spellCaster.emit(INPUT_EVENT, {
      flow: triggeringSocketName,
      inputs,
      event: currentEvent,
    })

    return {
      handler,
      spellCaster,
    }
  },
  dispose: ({ state }) => {
    const { spellCaster } = state

    if (!spellCaster || !state.handler) {
      return {
        spellCaster: undefined,
        handler: undefined,
      }
    }

    spellCaster.off(OUTPUT_EVENT, state.handler)

    return {
      spellCaster: undefined,
      handler: undefined,
    }
  },
})
