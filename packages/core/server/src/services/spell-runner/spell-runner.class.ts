// DOCUMENTED
import { SpellInterface } from 'shared/core'
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

/**
 * SpellRunnerService class.
 * By default calls the standard Knex adapter service methods but can be customized with your own functionality.
 */
export class SpellRunnerService<
  ServiceParams extends Params = SpellRunnerParams
> {
  /**
   * Get a spell by id.
   * @param id - The id of the spell to get.
   * @param params - Additional parameters.
   * @returns The spell or void.
   */
  async get(
    id: string,
    params?: SpellRunnerParams
  ): Promise<SpellInterface | void> {
    if (!app.userSpellManagers) throw new Error('No user spell managers found')
    if (!params) return console.error('No params present in service')
    const { user, query } = params

    if (!user) return console.error('No user is present in service')
    // Here we get the users spellManagerApp
    const spellManager = app.userSpellManagers.get(user.id.toString())

    if (!spellManager)
      return console.error('No spell manager created for user!')
    const decodedId = id.length > 36 ? id.slice(0, 36) : id
    const spell = await getSpell({
      app,
      id: decodedId as string,
      projectId: query?.projectId,
    })

    // Load the spell into the spellManager. If there is no spell runner, we make one.
    await spellManager.load(spell as SpellInterface)

    return spell
  }

  /**
   * Create a new spell runner service.
   * @param data - The data to create the new spell runner.
   * @param params - Additional parameters.
   * @returns The created spell runner service or void.
   */
  async create(
    data: CreateData,
    params?: ServiceParams
  ): Promise<Record<string, unknown> | void> {
    const logger = app.get('logger')
    if (!app.userSpellManagers) return {}
    if (!params) return logger.error('No params present in service')

    const { user } = params as any

    if (!user) return logger.error('No user is present in service')

    const { inputs, projectId, secrets, publicVariables, id } = data
    const decodedId = id.length > 36 ? id.slice(0, 36) : id
    const spellManager = app.userSpellManagers.get(user.id)

    if (!spellManager) return logger.error('No spell manager found for user!')

    if (!spellManager.hasSpellRunner(decodedId)) {
      const spell = await getSpell({ app, id: decodedId, projectId })
      await spellManager.load(spell as SpellInterface)
    }

    logger.debug('Running playtest spell %s', id)

    const result = await spellManager.run({
      spellId: id,
      inputs,
      secrets,
      publicVariables,
      app,
    })

    return result || {}
  }

  /**
   * Update a spell by id.
   * @param id - The id of the spell to update.
   * @param data - The data to update the spell with.
   * @param params - Additional parameters.
   * @returns The updated spell or void.
   */
  async update(
    id: string,
    data: {
      diff?: Record<string, unknown>
      spellUpdate?: SpellInterface
      projectId: string
    },
    params?: SpellRunnerParams
  ): Promise<SpellInterface | void> {
    if (!app.userSpellManagers) return undefined
    if (!params) return console.error('No params present in service')

    const { user } = params as any
    if (!user) return console.error('No user present in service')

    const { diff, spellUpdate } = data
    const spellManager = app.userSpellManagers.get(user.id)
    if (!spellManager) return console.error('No spell manager found for user!')

    const decodedId = id.length > 36 ? id.slice(0, 36) : id

    const spellRunner = spellManager.getReadySpellRunner(decodedId)
    if (!spellRunner) return console.error('No spell runner found!')

    if (diff) {
      const spell = spellRunner.currentSpell
      try {
        const updatedSpell = otJson0.type.apply(spell, diff)

        spellManager.load(updatedSpell)
        return updatedSpell
      } catch (e) {
        console.error(e)
        console.error('Error diffing spell. Recaching spell')
        app.service('spells').get(id, params)
        spellManager.load(spell)
        return spell
      }
    }

    if (spellUpdate) {
      spellManager.load(spellUpdate)
      return spellUpdate
    }

    return console.error('No diff or spellUpdate present in update data')
  }
}
