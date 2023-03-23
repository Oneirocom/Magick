import { API_ROOT_URL } from '../../src/lib/config'
import { runSpell } from './runSpell'

export const buildMagickInterface = (overrides: Record<string, Function> = {}) => {
  const env = {
    API_ROOT_URL,
    APP_SEARCH_SERVER_URL: 'test'
  }

  return {
    env,
    runSpell: async ({spell, id, inputs, projectId}) => {
      const { outputs } = await runSpell({
        spell,
        id,
        inputs,
        projectId
      })
      return outputs
    },
    getSpell: async () => null,
    getSpellbyId: async () => null
  }
}
