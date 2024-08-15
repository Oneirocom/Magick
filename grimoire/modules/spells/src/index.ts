import { defineNovaModule } from '@gtc-nova/kit'
import { normalize } from 'pathe'
import {
  scanJsonFilesFromDir,
  readJsonFile,
  createRollupJsonPlugin,
} from './features'
import { createRollupPlugin } from '@gtc-nova/kit/rollup'
import type { Import } from 'unimport'

const f = {
  spells: 'spells',
}

export const spellsModule = defineNovaModule<{}>({
  name: 'spells',
  features: {},
  featureTypeFunctions: {},
  metaUrl: import.meta.url,
  pluginsDir: './../src/runtime/plugins',

  hooks: [],
  async setup(nitro) {
    const spellFiles = await scanJsonFilesFromDir('spells')
    const spellJSON = await Promise.all(
      spellFiles.map(async spellFile => {
        const spellData = await readJsonFile(spellFile)
        return {
          path: normalize(spellFile),
          data: spellData,
          name: normalize(spellFile).split('/').pop() as string,
        }
      })
    )

    const scannedSpells: Import[] = spellJSON.map(spell => ({
      name: spell.name as string,
      from: spell.path,
      as: 'default',
    }))

    // @ts-ignore
    nitro['scannedSpells'] = scannedSpells

    nitro.hooks.hook('rollup:before', async (nit, config) => {
      // @ts-ignore
      config.plugins.push(createRollupJsonPlugin(this.name, spellJSON)(nitro))
    })
    // nitro.hooks.hook('rollup:before', async (nitro, rollupConfig) => {
    //   const rollupPlugin = createRollupPlugin('spells', ['spells'])

    //   // @ts-ignore
    //   rollupConfig.plugins?.push(rollupPlugin)
    // })

    console.log('Scanned spells:', scannedSpells)
  },
})

export type { Spell, SerializedSpell, SpellRegistry } from './types'
