import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { SocketData, SpellCaster } from '../../spellCaster'
import { BASE_DEP_KEYS, OUTPUT_EVENT } from '../../constants'

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

    if (!spellCaster) {
      throw new Error('SpellCaster or EventStore not found')
    }

    const outputData: SocketData[] = spellCaster.outputs
      .filter(socket => socket.valueType !== 'flow')
      .map(socket => ({
        socketName: socket.key as string,
        value: read(socket.key) as string,
      }))

    spellCaster.emit(OUTPUT_EVENT, {
      flow: triggeringSocketName,
      outputs: outputData,
    })
  },
})
