import 'nitropack'

import { NitroModule } from 'nitropack/types'
import { fileURLToPath } from 'node:url'
import consola from 'consola'

import { getMagickNodes, getMagickPlugins } from './helpers/scan'

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

    nitro?.grimoire?.scannedNodes?.forEach(node => {
      consola.info(`Registered node: ${node.name.split('.')[0]}`)
    })

    nitro?.grimoire?.scannedPlugins?.forEach(node => {
      consola.info(`Registered plugin: ${node.name.split('.')[0]}`)
    })

    if (nitro.options.imports) {
      nitro.options.imports.dirs ??= []
      nitro.options.imports.dirs.push(resolve('runtimes/utils/*'))
      consola.info('Added utils to imports', nitro.options.imports.dirs)
    }

    nitro.options.virtual['#magick/plugins'] = async () => {
      const plugins = await getMagickPlugins(nitro)

      const imports = plugins
        .map(
          (plugin, index) => `import ${plugin.name} from '${plugin.handler}';`
        )
        .join('\n')

      const exportArray = plugins
        .map(
          (plugin, index) => `
          ...(Array.isArray(plugin${index}) ? plugin${index} : [plugin${index}])
        `
        )
        .join(', ')

      return `
    ${imports}
    
    export const magickPlugins = [${exportArray}];
      `.trim()
    }

    // nitro.options.scanDirs.push(resolve("runtimes/*"));
    // consola.log("UTILS", resolve("runtimes/utils/*"));

    // nitro.options.imports.preset

    // options.imports.presets.push({
    //   from: "h3",
    //   imports: h3Exports.filter((n) => !/^[A-Z]/.test(n) && n !== "use"),
    // });

    // build out virtual file system helpers
  },
}
