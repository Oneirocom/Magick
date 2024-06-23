import magickNitro from 'nitroModule'
import { join } from 'path'
import { workspaceRoot } from '@nx/devkit'
import { fileURLToPath } from 'node:url'

function getMonorepoTsConfigPaths(tsConfigPath: string) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const tsPaths = require(tsConfigPath)?.compilerOptions?.paths as Record<
    string,
    string[]
  >

  const alias: Record<string, string> = {}
  if (tsPaths) {
    for (const p in tsPaths) {
      // '@org/something/*': ['libs/something/src/*'] => '@org/something': '{pathToWorkspaceRoot}/libs/something/src'
      alias[p.replace(/\/\*$/, '')] = join(
        workspaceRoot,
        tsPaths[p][0].replace(/\/\*$/, '').replace(/\/index\.ts$/, '')
      )
    }
  }

  console.log('alias', alias)

  return alias
}

export default defineNitroConfig({
  srcDir: 'src/agent',
  //   compatibilityDate: '2024-06-17', // for v3 we will need this
  // modules: [AgentModule],
  runtimeConfig: {
    agentId: '56fc9cf8-0dd0-491a-9493-9cd145760a58',
  },
  alias: {
    ...getMonorepoTsConfigPaths('../../tsconfig.base.json'),
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        paths: {
          nitroModule: ['../../packages/server/nitroModule'],
        },
      },
    },
  },
})
