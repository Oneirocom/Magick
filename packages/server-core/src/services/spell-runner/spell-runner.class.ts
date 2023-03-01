import type { KnexAdapterOptions, KnexAdapterParams } from '@feathersjs/knex'
import { KnexService } from '@feathersjs/knex'
import { Spell } from '@magickml/engine'
import otJson0 from 'ot-json0'
import { app } from '../../app'
import { Id, Params } from '@feathersjs/feathers'

import type { Application } from '../../declarations'

export type SpellRunner = any
export type SpellRunnerData = any
export type SpellRunnerPatch = any
export type SpellRunnerQuery = any

export type SpellRunnerParams = KnexAdapterParams<SpellRunnerQuery>

interface Data {}

interface CreateData {
  inputs: Record<string, any>
  id: string
  spellName: string
  projectId: string
}

const getSpell = async ({ app, id, projectId }) => {
  const spell = await app.service('spells').find({
    query: {
      projectId,
      id: id,
    },
  })
  return spell.data[0]
}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class SpellRunnerService<
  ServiceParams extends Params = SpellRunnerParams
> extends KnexService<
  SpellRunner,
  SpellRunnerData,
  ServiceParams,
  SpellRunnerPatch
> {
  async get(id: string, params?: SpellRunnerParams): Promise<any | {}> {
    if (!app.userSpellManagers) return {}
    if (!params) throw new Error('No params present in service')
    const { user, query } = params as any

    if (!user) throw new Error('No user is present in service')
    // Here we get the users spellManagerApp
    const spellManager = app.userSpellManagers.get(user.id.toString())

    if (!spellManager) throw new Error('No spell manager created for user!')
    const decoded_id = id.slice(0, 36)
    const spell = await getSpell({
      app,
      id: decoded_id as string,
      projectId: query.projectId,
    })

    // Load the spell into the spellManager. If there is no spell runner, we make one.
    await spellManager.load(spell as Spell)

    return spell
  }

  // @ts-ignore
  async create(
    data: CreateData,
    params?: SpellRunnerParams
  ): Promise<Record<string, unknown>> {
    if (!app.userSpellManagers) return {}
    if (!params) throw new Error('No params present in service')

    const { user } = params as any

    if (!user) throw new Error('No user is present in service')

    const { inputs, projectId, id, spellName } = data
    const spellManager = app.userSpellManagers.get(user.id)

    if (!spellManager) throw new Error('No spell manager found for user!')

    if (!spellManager.hasSpellRunner(id)) {
      const spell = await getSpell({ app, id: id, projectId })
      await spellManager.load(spell as Spell)
    }

    const result = await spellManager.run(id, inputs)

    return result || {}
  }

  async update(
    id: string,
    data: { diff: Record<string, unknown> },
    params?: SpellRunnerParams
  ): Promise<Data> {
    if (!app.userSpellManagers) return {}
    if (!params) throw new Error('No params present in service')

    const { user } = params as any

    if (!user) throw new Error('No user present in service')

    const { diff } = data

    const spellManager = app.userSpellManagers.get(user.id)
    if (!spellManager) throw new Error('No spell manager found for user!')

    const spellRunner = spellManager.getSpellRunner(id)
    if (!spellRunner) throw new Error('No spell runner found!')

    const spell = spellRunner.currentSpell
    const updatedSpell = otJson0.type.apply(spell, diff)

    spellManager.load(updatedSpell, true)
    return updatedSpell
  }

  // async patch(id: NullableId, data: Data, params?: Params): Promise<Data> {
  //   return data
  // }

  // async remove(id: NullableId, params?: Params): Promise<Data> {
  //   return { id }
  // }
}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'spell-runner',
  }
}
