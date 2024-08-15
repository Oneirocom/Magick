import { defineNovaPlugin } from '@gtc-nova/kit/runtime'
import { SpellRegistryManager } from '../utils/registry'
import { useRuntimeConfig } from 'nitro/runtime'
import type { SpellFeatures } from '../../features'
import { getVirtualSpells } from '../exports'

export default defineNovaPlugin<SpellFeatures, any>({
  useRuntimeConfig,
  initialize: (nitro, config) => {
    const spellOptions = config.spells || {}
    return { spellOptions }
  },
  before: async (nitro, br) => {
    nitro.spellRegistry = new SpellRegistryManager()
    const virtualSpells = getVirtualSpells()

    console.log('Adding virtual spells to registry')

    for (const spell of virtualSpells) {
      nitro.spellRegistry.add(spell.data)
    }
  },
  runtimeSetup: {}, // Since spells are serialized, we can skip this step
  after: (nitro, br) => {
    nitro.spellRegistry.getAll().forEach(spell => {
      console.log(spell)
    })
  },
})
