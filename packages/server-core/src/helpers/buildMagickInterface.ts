// GENERATED 
/**
 * Builds a Magick Interface object with methods:
 * - runSpell: runs a spell and returns the outputs
 * - getSpell: finds a spell by name and project ID
 * - getSpellbyId: finds a spell by name, project ID and spell ID
 * @param {Record<string, any>} overrides Optional object to override environment variables
 * @returns {Object} Magick Interface object
 */
export const buildMagickInterface = (overrides = {}) => {
  // Set the environment object
  const env = {
    API_ROOT_URL,
    ...overrides
  }

  // Return Magick Interface object
  return {
    env,
    
    /**
     * Runs a spell and returns the outputs
     * @param {string} spellId Spell ID
     * @param {Object} inputs Spell inputs
     * @param {string} projectId Project ID
     * @param {Object} secrets Secret inputs
     * @param {Object} publicVariables Public variables
     * @returns {Object} Spell outputs
     */
    runSpell: async ({spellId, inputs, projectId, secrets, publicVariables}) => {
      const { outputs } = await runSpell({
        spellId,
        inputs,
        projectId,
        secrets,
        publicVariables,
      })
      return outputs
    },
    
    /**
     * Finds a spell by name and project ID
     * @param {string} spellName Spell name
     * @param {string} projectId Project ID
     * @returns {Object} Spell object
     */
    getSpell: async ({spellName, projectId}) => {
      const spell = await app.service('spells').find({ query: { projectId, name: spellName } })
      return spell
    },

    /**
     * Finds a spell by name, project ID and spell ID
     * @param {string} spellName Spell name
     * @param {string} projectId Project ID
     * @param {string} id Spell ID
     * @returns {Object} Spell object
     */
    getSpellbyId: async ({spellName, projectId, id}) => {
      const spell = await app.service('spells').find({ query: { projectId, name: spellName, id } })
      return spell
    }
  }
}
// Keep imports and exports intact
import { runSpell } from '../utils/runSpell'
import { API_ROOT_URL } from '@magickml/engine'
import { app } from '../app'