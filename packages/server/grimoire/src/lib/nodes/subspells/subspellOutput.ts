import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { SpellCaster } from '../../spellCaster'
import { BASE_DEP_KEYS, OUTPUT_EVENT } from '../../constants'
import { IEventStore } from '../../services/eventStore'
import { CORE_DEP_KEYS } from 'plugin/core'

export const SubspellOutput = makeFlowNodeDefinition({
  typeName: 'events/subspells/output',
  label: 'Subspell Output',
  category: NodeCategory.Event,
  in: (_, graph) => {
    // Input sockets are dynamically generated
    const spellCaster = graph.getDependency<SpellCaster>(
      BASE_DEP_KEYS.I_SPELLCASTER
    )
    if (!spellCaster) {
      return []
    }
    return spellCaster.outputs.map(output => ({
      key: output.key,
      name: output.label,
      valueType: output.valueType,
    }))
  },
  out: {}, // No fixed output sockets
  initialState: undefined,
  triggered: async ({ triggeringSocketName, graph, read }) => {
    const spellCaster = graph.getDependency<SpellCaster>(
      BASE_DEP_KEYS.I_SPELLCASTER
    )
    const eventStore = graph.getDependency<IEventStore>(
      CORE_DEP_KEYS.EVENT_STORE
    )

    if (!spellCaster || !eventStore) {
      throw new Error('SpellCaster or EventStore not found')
    }
    const event = eventStore.currentEvent()
    if (!event) {
      throw new Error('Current Event not found')
    }

    const outputData = spellCaster.outputs.reduce((acc, output) => {
      acc[output.key] = read(output.key)
      return acc
    }, {} as Record<string, any>) // Start with an empty object

    spellCaster.emit(OUTPUT_EVENT, {
      flow: triggeringSocketName,
      outputs: outputData,
    })
  },
})
