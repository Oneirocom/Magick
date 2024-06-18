import 'nitropack'

import { NitroModule } from 'nitropack/types'
import { fileURLToPath } from 'node:url'
import consola from 'consola'

import { getMagickNodes } from './helpers/scan'
import { NodeHandler } from './types/shared'

declare module 'nitropack' {
  interface NitroOptions {
    grimoireOptions?: {}
  }

  interface Nitro {
    magick: {
      agent: any
      scannedNodes: NodeHandler[]
    }
  }
}

export default <NitroModule>{
  async setup(nitro) {
    const resolve = (path: string) =>
      fileURLToPath(new URL(path, import.meta.url))

    console.log('Hello from my module!')
    // 1: Initalize magick object
    nitro.magick = {
      agent: null,
      scannedNodes: [],
    }

    // Scan the folders for Magick dependencies
    const nodes = await getMagickNodes(nitro)

    // Store the scanned nodes
    nitro.magick.scannedNodes = nodes

    nitro?.magick?.scannedNodes?.forEach(node => {
      consola.info(`Registered node: ${node.name.split('.')[0]}`)
    })

    if (nitro.options.imports) {
      nitro.options.imports.dirs ??= []
      nitro.options.imports.dirs.push(resolve('runtimes/utils/*'))
      consola.info('Added utils to imports', nitro.options.imports.dirs)
    }

    nitro.options.virtual['#magick/nodes'] = () => {
      const imports = nitro.magick.scannedNodes.map(n => n.handler)

      const code = `
${imports.map(handler => `import ${handler} from '${handler}';`).join('\n')}
export const magickNodes = [
${nitro.magick.scannedNodes
  .map(n => `  { name: '${n.name}', handler: ${n.handler} }`)
  .join(',\n')}
];
`

      return code
    }
  },
}
