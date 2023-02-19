import { runSpell } from './utils/runSpell'
import { API_ROOT_URL, APP_SEARCH_SERVER_URL, projectId } from '@magickml/engine'
import { app } from './app'

export const buildMagickInterface = (overrides: Record<string, Function> = {}) => {
  const env = {
    API_ROOT_URL,
    APP_SEARCH_SERVER_URL
  }

  return {
    env,
    runSpell: async (flattenedInputs, spellId) => {
      const { outputs } = await runSpell({
        spellName: spellId,
        inputs: flattenedInputs
      })
      return outputs
    },
    getSpell: async (spellId) => {
      const spell = await app.service('spells').find({ query: { projectId, name: spellId } })

      return spell
    }
  }
}
