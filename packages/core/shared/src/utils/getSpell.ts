// DOCUMENTED
import { API_ROOT_URL } from 'shared/config'
/**
 * The type for the function's input parameter which contains the
 * app object, the projectId, and the id of a specific spell.
 */
type GetSpell = {
  app: any
  id: string
  projectId: string
}

/**
 * Fetch a specific spell from the project's spells based on its id.
 * @param {GetSpell} input - Object containing the app, id of the spell and projectId
 * @returns {Promise<any>} - Returns the fetched spell data
 */
export const getSpell = async ({ id, projectId }: GetSpell): Promise<any> => {
  // rewrite the feathers service call as a fetch
  const spell = await fetch(
    `${API_ROOT_URL}/spells?projectId=${projectId}&id=${id}`
  ).then(res => res.json())

  // Return the first element of the found spells' data
  return spell.data[0]
}
