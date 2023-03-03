import { runSpell } from './utils/runSpell'
import { API_ROOT_URL } from '@magickml/engine'
import { app } from './app'

export const buildMagickInterface = (overrides: Record<string, Function> = {}) => {
  const env = {
    API_ROOT_URL,
  }

  return {
    env,
    runSpell: async ({id, inputs, projectId}) => {
      const { outputs } = await runSpell({
        id,
        inputs,
        projectId
      })
      return outputs
    },
    getSpell: async ({spellName, projectId}) => {
      const spell = await app.service('spells').find({ query: { projectId, name: spellName } })

      return spell
    },

    getSpellbyId: async ({spellName, projectId, id}) => {
      const spell = await app.service('spells').find({ query: { projectId, name: spellName, id } })

      return spell
    }
  }
}
