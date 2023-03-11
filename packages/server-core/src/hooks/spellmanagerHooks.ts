import { otJson0 } from 'ot-json0'
import { Spell } from '../client'
import { HookContext } from '../declarations'
import { getSpell } from '../helpers/getSpell'

export const checkForSpellInManager = async (context: HookContext) => {
  const { app, params, data, id } = context
  const { user } = params

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
  const { app, params, data, id } = context
  const { user } = params
  const { spellUpdate, diff } = data

  // Here we get the users spellManagerApp
  const spellManager = app.userSpellManagers.get(user.id.toString())
  const decodedId =
    (id as string).length > 36 ? (id as string).slice(0, 36) : (id as string)

  const spellRunner = spellManager.getSpellRunner(decodedId)

  if (!spellRunner) return

  if (diff) {
    const spell = spellRunner.currentSpell
    const updatedSpell = otJson0.type.apply(spell, diff)
    spellManager.load(updatedSpell, true)
    return updatedSpell
  }

  if (spellUpdate) {
    spellManager.load(spellUpdate, true)
    return spellUpdate
  }
}
