import {
  EngineContext} from '@magickml/engine'
import { prisma } from '@magickml/prisma'

import { runSpell } from './utils/runSpell'
import {
  API_ROOT_URL,
  API_URL,
  APP_SEARCH_SERVER_URL,
} from '@magickml/server-core'

export const buildMagickInterface = (
  overrides: Record<string, Function> = {}
): EngineContext => {
  // eslint-disable-next-line functional/no-let
  const env = {
    API_ROOT_URL,
    API_URL,
    APP_SEARCH_SERVER_URL,
  }

  return {
    env,
    runSpell: async (flattenedInputs, spellId) => {
      const { outputs } = await runSpell({
        spellName: spellId,
        inputs: flattenedInputs,
      })
      return outputs
    },
    getSpell: async spellId => {
      const spell = await prisma.spells.findUnique({ where: { name: spellId } })
      return spell
    }
  }
}
