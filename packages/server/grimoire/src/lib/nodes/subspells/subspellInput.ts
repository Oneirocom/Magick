import { Assert, NodeCategory } from '@magickml/behave-graph'
import { InputData, SpellCaster } from '../../spellCaster'
import { makeMagickEventNodeDefinition } from '../../factories/magickEventNode'
import { BASE_DEP_KEYS, INPUT_EVENT } from '../../constants'
import { IEventStore } from '../../services/eventStore'
import { CORE_DEP_KEYS } from 'plugin/core'

type State = {
  onSpellCasterEvent?: ((data: InputData) => void) | undefined
}

const makeInitialState = (): State => ({
  onSpellCasterEvent: undefined,
})

export const SubspellInput = makeMagickEventNodeDefinition(
  {
    typeName: 'events/subspells/input',
    label: 'Subspell Input',
    category: NodeCategory.Event,
    in: {},
    configuration: {
      hiddenProperties: {
        valueType: 'array',
        defaultValue: ['socketOutputs', 'socketInputs'],
      },
    },
    out: (_, graph) => {
      const spellCaster = graph.getDependency<SpellCaster>(
        BASE_DEP_KEYS.I_SPELLCASTER
      )

      if (!spellCaster) {
        return []
      }

      return spellCaster.inputs.map(input => ({
        key: input.key,
        name: input.label,
        valueType: input.valueType,
      }))
    },
    initialState: makeInitialState(),
  },
  {
    init: ({ state, commit, write, graph, handleState }) => {
      Assert.mustBeTrue(state.onSpellCasterEvent === undefined)

      const spellCaster = graph.getDependency<SpellCaster>(
        BASE_DEP_KEYS.I_SPELLCASTER
      )

      const eventStore = graph.getDependency<IEventStore>(
        CORE_DEP_KEYS.EVENT_STORE
      )

      if (!spellCaster || !eventStore) {
        throw new Error('SpellCaster or EventStore not found')
      }

      const onSpellCasterEvent = (data: InputData) => {
        const { flow, inputs, event } = data

        for (const input of inputs) {
          write(input.socketName, input.value)
        }

        handleState(event)

        commit(flow)
      }

      spellCaster.on(INPUT_EVENT, onSpellCasterEvent)

      return {
        onSpellCasterEvent,
      }
    },
    dispose: ({ graph, state }) => {
      const spellCaster = graph.getDependency<SpellCaster>(
        BASE_DEP_KEYS.I_SPELLCASTER
      )

      if (!spellCaster || !state.onSpellCasterEvent) return {}

      spellCaster.removeListener(INPUT_EVENT, state.onSpellCasterEvent)

      return {
        onSpellCasterEvent: undefined,
      }
    },
  }
)
