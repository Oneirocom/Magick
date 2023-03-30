// GENERATED 
/**
 * Interface for the constructor function of the magick RunSpell class.
 */
import { RunSpellConstructor } from '../../src/lib/types';

/**
 * URL for the root API.
 */
import { API_ROOT_URL } from '../../src/lib/config';

/**
 * Function that runs the spell.
 */
import { runSpell } from './runSpell';

/**
 * Builds the magick interface for the constructor function of the magick RunSpell class.
 * @param overrides - Object containing optional overrides.
 * @returns The magick interface.
 */
export const buildMagickInterface = (overrides: Record<string, unknown> = {}): RunSpellConstructor => {
  // Environment variables
  const env = {
    API_ROOT_URL,
    APP_SEARCH_SERVER_URL: 'test'
  };

  // Magick interface
  return {
    env,
    runSpell: async ({spell, id, inputs, projectId}) => {
      // Run the spell
      const { outputs } = await runSpell({
        spell,
        id,
        inputs,
        projectId
      });
      return outputs;
    },
    getSpell: async () => null,
    getSpellbyId: async () => null
  };
};