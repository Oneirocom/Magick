import AgentModule from './modules/agent-module'
import { fileURLToPath } from 'node:url'
import { join } from 'path'
import { workspaceRoot } from '@nx/devkit'

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
        tsPaths[p][0].replace(/\/\*$/, '')
      )
    }
  }

  return alias
}

export default defineNitroConfig({
  srcDir: 'agent',
  //   compatibilityDate: '2024-06-17', // for v3 we will need this
  modules: [AgentModule],

  runtimeConfig: {
    agentId: '123',
  },
  alias: getMonorepoTsConfigPaths('../../tsconfig.base.json'),
  // typescript: {
  //   tsConfig: {
  //     extends: fileURLToPath(
  //       // @ts-ignore
  //       new URL('../../tsconfig.base.json', import.meta.url)
  //     ),
  //   },
  // },
})
