// DOCUMENTED 
import { Application } from '../declarations';

/**
 * The type for the function's input parameter which contains the
 * app object, the projectId, and the id of a specific spell.
 */
type GetSpell = {
  app: Application;
  id: string;
  projectId: string;
};

/**
 * Fetch a specific spell from the project's spells based on its id.
 * @param {GetSpell} input - Object containing the app, id of the spell and projectId
 * @returns {Promise<any>} - Returns the fetched spell data
 */
export const getSpell = async ({ app, id, projectId }: GetSpell): Promise<any> => {
  // Find the spell with the matching id and projectId
  const spell = await app.service('spells').find({
    query: {
      projectId,
      id: id,
    },
  });

  // Return the first element of the found spells' data
  return spell.data[0];
};