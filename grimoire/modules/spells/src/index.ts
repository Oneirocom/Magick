import { defineNovaModule } from '@gtc-nova/kit'
import { spellFeatures, type SpellFeatures } from './features'

export const spellsModule = defineNovaModule<SpellFeatures>({
  name: 'spells',
  features: spellFeatures,
  featureTypeFunctions: {
    spells: () => {
      console.log('spells')
    },
  },
  pluginsDir: './../src/runtime/plugins',
  metaUrl: import.meta.url,
  hooks: [],
})

export type { Spell, SerializedSpell, SpellRegistry } from './types'
