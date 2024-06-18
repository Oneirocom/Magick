import 'nitropack'

import { NitroModule } from 'nitropack/types'
import { fileURLToPath } from 'node:url'
import consola from 'consola'

import { getMagickNodes } from './helpers/scan'
import { Grimoire } from './types/grimoire'
import { baseGrimoireConfig } from './config'

declare module 'nitropack' {
  interface NitroOptions {
    grimoireOptions?: {}
  }

  interface Nitro {
    grimoire: Grimoire
  }
}

export default <NitroModule>{
  async setup(nitro) {
    const resolve = (path: string) =>
      // @ts-ignore - i think this is a bug
      fileURLToPath(new URL(path, import.meta.url))

    console.log('Hello from my module!')
    // 1: Initalize magick object
    nitro.grimoire = baseGrimoireConfig

    // Scan the folders for Magick dependencies
    const nodes = await getMagickNodes(nitro)

    // Store the scanned nodes
    nitro.grimoire.scannedNodes = nodes

    nitro?.grimoire?.scannedNodes?.forEach(node => {
      consola.info(`Registered node: ${node.name.split('.')[0]}`)
    })

    if (nitro.options.imports) {
      nitro.options.imports.dirs ??= []
      nitro.options.imports.dirs.push(resolve('runtimes/utils/*'))
      consola.info('Added utils to imports', nitro.options.imports.dirs)
    }

    nitro.options.virtual['#magick/nodes'] = () => {
      const imports = nitro.grimoire.scannedNodes.map(n => n.handler)

      const code = `
${imports.map(handler => `import ${handler} from '${handler}';`).join('\n')}
export const magickNodes = [
${nitro.grimoire.scannedNodes
  .map(n => `  { name: '${n.name}', handler: ${n.handler} }`)
  .join(',\n')}
];
`

      return code
    }
  },
}
