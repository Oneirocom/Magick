import 'nitropack'

import { NitroModule } from 'nitropack/types'
import { fileURLToPath } from 'node:url'
import consola from 'consola'

import { getMagickNodes, getMagickPlugins } from './helpers/scan'

import { Application } from '@magickml/agent-server'
import { AgentV2 } from '@magickml/agents'

declare module 'nitropack' {
  interface NitroOptions {
    grimoireOptions?: {}
  }

  interface Nitro {
    grimoire: {
      scannedNodes: any
      scannedPlugins: any
    }
  }

  interface NitroApp {
    agent: AgentV2
    agentServer: Application
  }
}

export default <NitroModule>{
  async setup(nitro) {
    const resolve = (path: string) =>
      // @ts-ignore fix this import meta at some point
      fileURLToPath(new URL(path, import.meta.url))

    consola.info('Setting up Grimoire')
    // 1: Initalize magick object
    nitro.grimoire = {
      scannedNodes: [],
      scannedPlugins: [],
    }

    // Scan the folders for Magick dependencies
    const nodes = await getMagickNodes(nitro)
    const magickPlugins = await getMagickPlugins(nitro)

    // Store the scanned nodes
    nitro.grimoire.scannedNodes = nodes
    nitro.grimoire.scannedPlugins = magickPlugins

    nitro?.grimoire?.scannedNodes?.forEach((node: { name: string }) => {
      consola.info(`Registered node: ${node.name.split('.')[0]}`)
    })

    nitro?.grimoire?.scannedPlugins?.forEach((node: { name: string }) => {
      consola.info(`Registered plugin: ${node.name.split('.')[0]}`)
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

    // Load the plugins into a virtual file to make them accessible from the plugin
    nitro.options.virtual['#magick/plugins'] = async () => {
      const plugins = await getMagickPlugins(nitro)

      // strip .ts from plugin name
      const formatName = (pluginName: string) => pluginName.replace(/\.ts$/, '')

      const imports = plugins
        .map(
          plugin =>
            `import ${formatName(plugin.name)} from '${plugin.handler}';`
        )
        .join('\n')

      const exportArray = plugins
        .map(
          plugin => `
          ...(Array.isArray(${formatName(plugin.name)}) ? ${formatName(
            plugin.name
          )} : [${formatName(plugin.name)}])
        `
        )
        .join(', ')

      return `
    ${imports}
    
const magickPlugins = [${exportArray}];

export default magickPlugins;
      `.trim()
    }

    nitro.options.externals.inline.push('#magick/plugins')
    nitro.options.externals.inline.push(
      resolve('runtimes/plugins/initializeAgent')
    )

    // // load out plugins
    nitro.options.plugins.push(resolve('runtimes/plugins/initializeAgent'))
  },
}
