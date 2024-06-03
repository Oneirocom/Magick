import {
  InputSocketSpecJSON,
  NodeCategory,
  SocketsList,
  makeFlowNodeDefinition,
} from '@magickml/behave-graph'
import { CORE_DEP_KEYS } from 'plugins'
import { Agent } from 'server/agents'
import { IEventStore } from '../../services/eventStore'

export const runSubspell = makeFlowNodeDefinition({
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
  initialState: undefined,
  triggered: async ({
    read,
    write,
    commit,
    triggeringSocketName,
    graph: { getDependency },
    configuration,
  }) => {
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

    const inputs = configuration.socketInputs.reduce(
      (acc: Record<string, any>, input: InputSocketSpecJSON) => {
        acc[input.name] = read(input.name)
        return acc
      },
      {}
    ) as Record<string, any>

    spellCaster.once(
      'output',
      (result: { flow: string; outputs: Record<string, any> }) => {
        Object.entries(result.outputs).forEach(([key, value]) => {
          write(key, value)
        })

        commit(result.flow)
      }
    )

    spellCaster.emit('input', {
      flow: triggeringSocketName,
      inputs,
    })
  },
})
