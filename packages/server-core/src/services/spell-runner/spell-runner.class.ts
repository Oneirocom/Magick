import { Spell } from '@magickml/engine'
import otJson0 from 'ot-json0'
import { app } from '../../app'
import { Params } from '@feathersjs/feathers'

import { getSpell } from '../../helpers/getSpell'

interface CreateData {
  inputs: Record<string, any>
  id: string
  spellName: string
  projectId: string
  secrets: Record<string, string>
  publicVariables: Record<string, any>
}

export interface SpellRunnerParams extends Params {
  user: any
}

// interface Data {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class SpellRunnerService<
  ServiceParams extends Params = SpellRunnerParams
> {
  async get(id: string, params?: SpellRunnerParams): Promise<Spell | null> {
    if (!app.userSpellManagers) return null
    if (!params) throw new Error('No params present in service')
    const { user, query } = params

    if (!user) throw new Error('No user is present in service')
    // Here we get the users spellManagerApp
    const spellManager = app.userSpellManagers.get(user.id.toString())

    if (!spellManager) throw new Error('No spell manager created for user!')
    const decodedId = id.length > 36 ? id.slice(0, 36) : id
    const spell = await getSpell({
      app,
      id: decodedId as string,
      projectId: query.projectId,
    })

    // Load the spell into the spellManager. If there is no spell runner, we make one.
    await spellManager.load(spell as Spell)

    return spell
  }

  // todo type this service properly
  async create(
    data: CreateData,
    params?: ServiceParams
  ): Promise<Record<string, unknown>> {
    if (!app.userSpellManagers) return {}
    if (!params) throw new Error('No params present in service')

    const { user } = params as any

    if (!user) throw new Error('No user is present in service')

    const { inputs, projectId, secrets, publicVariables, id } = data
    const decodedId = id.length > 36 ? id.slice(0, 36) : id
    const spellManager = app.userSpellManagers.get(user.id)

    if (!spellManager) throw new Error('No spell manager found for user!')

    if (!spellManager.hasSpellRunner(decodedId)) {
      const spell = await getSpell({ app, id: decodedId, projectId })
      await spellManager.load(spell as Spell)
    }

    const result = await spellManager.run(id, inputs, secrets, publicVariables)

    return result || {}
  }

  async update(
    id: string,
    data: { diff?: Record<string, unknown>, spellUpdate?: Spell, projectId: string},
    params?: SpellRunnerParams
  ): Promise<Spell> {
    console.log("ID**********************", id)
    if (!app.userSpellManagers) return null
    if (!params) throw new Error('No params present in service')

    const { user } = params as any
    if (!user) throw new Error('No user present in service')

    const { diff, spellUpdate } = data
    const spellManager = app.userSpellManagers.get(user.id)
    if (!spellManager) throw new Error('No spell manager found for user!')

    const decodedId = id.length > 36 ? id.slice(0, 36) : id

    const spellRunner = spellManager.getSpellRunner(decodedId)
    if (!spellRunner) throw new Error('No spell runner found!')

    if (diff) {
      const spell = spellRunner.currentSpell
      try {
        const updatedSpell = otJson0.type.apply(spell, diff)

        spellManager.load(updatedSpell, true)
        return updatedSpell
      } catch (e) {
        console.error(e)
        console.error('Error diffing spell. Recaching spell')
        app.services.spells.get(id, params)
        spellManager.load(spell, true)
        return spell
      }
    }

    if (spellUpdate) {
      spellManager.load(spellUpdate, true)
      return spellUpdate
    }

    throw new Error('No diff or spellUpdate present in update data')
  }

  // async patch(id: NullableId, data: Data, params?: Params): Promise<Data> {
  //   return data
  // }

  // async remove(id: NullableId, params?: Params): Promise<Data> {
  //   return { id }
  // }
}
