import 'nitropack'

import { NitroModule } from 'nitropack/types'
import { fileURLToPath } from 'node:url'
import consola from 'consola'

import { getSpells } from './helpers/scan'

import { Application } from '@magickml/agent-server'
import { Agent } from '@magickml/agents'

declare module 'nitropack' {
  interface NitroOptions {
    grimoireOptions?: {}
  }

  interface Nitro {
    grimoire: {
      scannedSpells: any
    }
  }

  interface NitroApp {
    agent: Agent
    agentServer: Application
  }
}

export default <NitroModule>{
  async setup(nitro) {
    const resolve = (path: string) =>
      // @ts-ignore fix this import meta at some point
      fileURLToPath(new URL(path, import.meta.url))

    consola.info('Setting up Grimoire')
    // 1: Initialize magick object
    nitro.grimoire = {
      scannedSpells: [],
    }

    // Scan the folders for Magick dependencies
    const spells = await getSpells(nitro)
    nitro.grimoire.scannedSpells = spells

    nitro?.grimoire?.scannedSpells?.forEach((spell: { name: string }) => {
      consola.info(`Registered spell: ${spell.name.split('.')[0]}`)
    })

    if (nitro.options.imports) {
      nitro.options.imports.dirs ??= []
      nitro.options.imports.dirs.push(resolve('runtimes/utils/*'))
      consola.info('Added utils to imports', nitro.options.imports.dirs)
    }

    // Make sure runtime is transpiled
    nitro.options.externals = nitro.options.externals || {}
    nitro.options.externals.inline = nitro.options.externals.inline || []
    nitro.options.externals.inline.push(
      fileURLToPath(new URL('runtimes/', import.meta.url))
    )

    // Load the spells into a virtual file to make them accessible from the plugin
    nitro.options.virtual['#magick/spells'] = async () => {
      const spells = await getSpells(nitro)

      // strip .json from spell name
      const formatName = (spellName: string) => spellName.replace(/\.json$/, '')

      const imports = spells
        .map(
          spell => `import ${formatName(spell.name)} from '${spell.handler}';`
        )
        .join('\n')

      const exportArray = spells
        .map(
          spell => `
          ...(Array.isArray(${formatName(spell.name)}) ? ${formatName(
            spell.name
          )} : [${formatName(spell.name)}])
        `
        )
        .join(', ')

      return `
    ${imports}
    
const magickSpells = [${exportArray}];

export default magickSpells;
      `.trim()
    }

    nitro.options.externals.inline.push('#magick/spells')

    // load out plugins
    nitro.options.plugins.push(resolve('runtimes/plugins/initializeAgent'))
  },
}
