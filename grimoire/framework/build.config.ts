import { writeFile } from 'fs-extra'
import { resolve } from 'pathe'
import { normalize } from 'pathe'
import { defineBuildConfig } from 'unbuild'

// const srcDir = fileURLToPath(new URL('src', import.meta.url))
const srcDir = resolve(__dirname, 'src')

export const subpaths = [
  'cli',
  // 'cga',
  'config',
  // 'core',
  // 'kit',
  // 'presets',
  // 'rollup',
  // 'runtime',
  // 'meta',
  // 'types',
]

export default defineBuildConfig({
  failOnWarn: false,
  declaration: true,
  name: 'grimoire',
  entries: [
    // CLI
    { input: 'src/cli/index.ts' },
    // Config
    { input: 'src/config/index.ts' },
  ],
  alias: {
    nitro: 'nitro',
    'nitro/meta': resolve(srcDir, '../meta.ts'),
    'nitro/runtime/meta': resolve(srcDir, '../runtime-meta.mjs'),
    ...Object.fromEntries(
      subpaths.map(subpath => [
        `nitro/${subpath}`,
        resolve(srcDir, `${subpath}/index.ts`),
      ])
    ),
  },
  hooks: {
    async 'build:prepare'(ctx) {
      for (const subpath of subpaths) {
        await writeFile(
          `./${subpath}.d.ts`,
          `export * from "./dist/${subpath}/index";`
        )
      }
    },
  },
  externals: [
    'nitro',
    'nitro/runtime/meta',
    ...subpaths.map(subpath => `@magickml/grimoire/${subpath}`),
    'firebase-functions',
    '@scalar/api-reference',
  ],
  rollup: {
    output: {
      chunkFileNames(chunk: any) {
        const id = normalize(chunk.moduleIds.at(-1))
        if (id.includes('/src/cli/')) {
          return 'cli/[name].mjs'
        }
        return '_chunks/[name].mjs'
      },
    },
  },
})
