import { virtual } from '@gtc-nova/kit/vendor'
import { fileURLToPath } from 'node:url'
import type { Nitro } from 'nitro/types'
import { normalize } from 'path'

export const runtimeDir = fileURLToPath(
  new URL('dist/runtime/', import.meta.url)
)

interface SpellDefinition {
  path: string
  data: any
  name: string
}

/**
 * Creates a Rollup plugin for JSON data.
 * @param moduleName The name of the module.
 * @param spells An array of spell definitions.
 * @returns A function that creates the Rollup plugin.
 */
export function createRollupJsonPlugin(
  moduleName: string,
  spells: SpellDefinition[]
) {
  return function (nitro: Nitro) {
    const generateSpellsCode = (): string => {
      const imports = spells.map(
        (spell, index) => `import spell${index} from '${spell.path}';`
      )
      const spellsArray = spells.map(
        (spell, index) => `
        {
          path: ${JSON.stringify(normalize(spell.path))},
          data: spell${index},
          name: ${JSON.stringify(spell.name)}
        }`
      )

      return `
${imports.join('\n')}

export const spells = [
${spellsArray.join(',\n')}
];
      `.trim()
    }

    const virtualFiles: Record<string, () => string> = {
      [`#${moduleName}-virtual/spells`]: generateSpellsCode,
    }

    return virtual(virtualFiles, nitro.vfs)
  }
}
