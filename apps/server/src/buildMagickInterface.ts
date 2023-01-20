import {
  EngineContext} from '@magickml/core'
import { prisma } from '@magickml/prisma'

import { runSpell } from './utils/runSpell'
import {
  API_ROOT_URL,
  API_URL,
  APP_SEARCH_SERVER_URL,
} from '@magickml/server-core'

export const buildMagickInterface = (
  initialGameState: Record<string, unknown>,
  overrides: Record<string, Function> = {}
): EngineContext => {
  // eslint-disable-next-line functional/no-let
  let gameState = { ...initialGameState }
  const env = {
    API_ROOT_URL,
    API_URL,
    APP_SEARCH_SERVER_URL,
  }

  return {
    env,
    runSpell: async (flattenedInputs, spellId, state) => {
      const { outputs } = await runSpell({
        state,
        spellName: spellId,
        inputs: flattenedInputs,
      })
      return outputs
    },
    getSpell: async spellId => {
      const spell = await prisma.spells.findUnique({ where: { name: spellId } })
      return spell
    },

    setCurrentGameState: state => {
      gameState = state
    },
    getCurrentGameState: () => {
      return gameState
    },
    updateCurrentGameState: (update: Record<string, unknown>) => {
      const newState = {
        ...gameState,
        ...update,
      }

      gameState = newState
    }
  }
}
