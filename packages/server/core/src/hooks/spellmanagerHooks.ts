// DOCUMENTED
import { SpellInterface } from 'server/schemas'
import { HookContext } from '../declarations'
import { getSpell } from '../helpers/getSpell'

/**
 * Checks for the existence of a Spell in the user's SpellManager
 * and loads it if it doesn't exist.
 *
 * @param {HookContext} context - the Hook context
 */
export const checkForSpellInManager = async (context: HookContext) => {
  const { app, params, data, id: contextId } = context
  const { user } = params
  const { id: dataId } = data

  // We do this because the id comes from different places in sockets vs rest
  const projectId = data.projectId || params.query.projectId
  const id = dataId || contextId || projectId

  if (!user || !app.userSpellManagers) return

  // Get the user's spellManagerApp
  const spellManager = app.userSpellManagers.get(user.id.toString())

  if (!spellManager) return
  const decodedId =
    (id as string).length > 36 ? (id as string).slice(0, 36) : (id as string)

  // load the spell if there isnt ones
  if (!spellManager.hasSpellRunner(decodedId)) {
    const spell = await getSpell({ app, id: decodedId, projectId })
    await spellManager.load(spell as SpellInterface)
  }
}

/**
 * Updates the spell in the user's SpellManager after a spell has been
 * updated on the server.
 *
 * @param {HookContext} context - the Hook context
 */
export const updateSpellInManager = async (context: HookContext) => {
  const { app, params, data, id: contextId } = context
  const { user } = params
  const { id: dataId } = data

  // We do this because the id comes from different places in sockets vs rest
  const id = dataId || contextId

  if (!user || !app.userSpellManagers) return

  // Get the user's spellManagerApp
  const spellManager = app.userSpellManagers.get(user.id.toString())
  const decodedId =
    (id as string).length > 36 ? (id as string).slice(0, 36) : (id as string)

  if (!spellManager) return

  const spellRunner = spellManager.getReadySpellRunner(decodedId)

  if (!spellRunner) return

  if (!context.result) return

  // We just store the result here of the update
  // This hook only runs after save spell calls, so there should always be a spell to load in
  spellManager.updateSpell(context.result)
}
