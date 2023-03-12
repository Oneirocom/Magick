import { otJson0 } from 'ot-json0'
import { Spell } from '../client'
import { HookContext } from '../declarations'
import { getSpell } from '../helpers/getSpell'

export const checkForSpellInManager = async (context: HookContext) => {
  const { app, params, data, id: contextId } = context
  const { user } = params
  const { id: dataId } = data

  // We do this because the id comes from different places in sockets vs rest
  const id = dataId || contextId
  const projectId = data.projectId || params.query.projectId

  if (!user) return
  // Here we get the users spellManagerApp

  const spellManager = app.userSpellManagers.get(user.id.toString())

  if (!spellManager) return
  const decodedId =
    (id as string).length > 36 ? (id as string).slice(0, 36) : (id as string)

  if (!spellManager.hasSpellRunner(decodedId)) {
    const spell = await getSpell({ app, id: decodedId, projectId })
    await spellManager.load(spell as Spell)
  }
}

// When the spell updates on the server, we need to update the spell in the spell manager
export const updateSpellInManager = async (context: HookContext) => {
  const { app, params, data, id: contextId } = context
  const { user } = params
  const { id: dataId } = data

  // We do this because the id comes from different places in sockets vs rest
  const id = dataId || contextId

  // Here we get the users spellManagerApp
  const spellManager = app.userSpellManagers.get(user.id.toString())
  const decodedId =
    (id as string).length > 36 ? (id as string).slice(0, 36) : (id as string)

  const spellRunner = spellManager.getSpellRunner(decodedId)

  if (!spellRunner) return

  if (!context.result) return

  // We just store the result here of the update
  // This hook only run after save spell calls, so there should always be a spell to laod in.
  console.log('UPDATING SPELL IN MANAGER')
  spellManager.load(context.result, true)
}
