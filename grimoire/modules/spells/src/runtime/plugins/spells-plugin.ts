import { defineNovaPlugin } from '@gtc-nova/kit/runtime'
import { spellRegistry } from '../utils/registry'
import { useRuntimeConfig } from 'nitro/runtime'
import type { SpellFeatures } from '../../features'
import { getVirtualSpells } from '../exports'
import { readGraphFromJSON, writeGraphToJSON } from '@magickml/behave-graph'
import type { Spell, SerializedSpell } from '../../types'
import fs from 'fs/promises'
import path from 'path'

export default defineNovaPlugin<SpellFeatures, any, any, any, any>({
  useRuntimeConfig,
  initialize: (nitro, config) => {
    const spellOptions = config.spells || {}
    return { spellOptions }
  },
  before: async (nitro, br) => {},
  runtimeSetup: {
    spells: {
      getVirtualHandlers: getVirtualSpells,
      initFeatureHandlers: async (nitro, handlers) => {
        for (const handler of handlers) {
          const spellDefinition = (await handler.handler()).default
          console.log('feature spell scanned:', spellDefinition)
        }
        // const spellsDir = path.join(process.cwd(), 'server', 'spells');
        // await loadSpellsFromDirectory(spellsDir);
        // for (const handler of handlers) {
        //   const spellDefinition = (await handler.handler()).default;
        //   spellRegistry.add(spellDefinition);
        // }
      },
    },
  },
  after: (nitro, br) => {
    // @ts-ignore todo: declare
    nitro.spellRegistry = spellRegistry
    console.info(
      'Spell module initialized. Use nitro.spellRegistry to access spells.'
    )
  },
})

async function loadSpellsFromDirectory(directory: string) {
  try {
    const files = await fs.readdir(directory)
    for (const file of files) {
      if (path.extname(file) === '.json') {
        const filePath = path.join(directory, file)
        const content = await fs.readFile(filePath, 'utf-8')
        const serializedSpell: SerializedSpell = JSON.parse(content)
        const spell: Spell = {
          ...serializedSpell,
          graph: readGraphFromJSON({
            graphJson: serializedSpell.graph,
            registry: useRuntimeConfig().registry,
          }),
        }
        spellRegistry.add(spell)
      }
    }
  } catch (error) {
    console.error('Error loading spells from directory:', error)
  }
}
