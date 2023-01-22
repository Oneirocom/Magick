import { spells } from '@prisma/client'
import { prisma } from '@magickml/prisma'
import otJson0 from 'ot-json0'
import {
  Id,
  NullableId,
  Paginated,
  Params,
  ServiceMethods,
} from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Spell } from '@magickml/core'

interface Data {}

interface CreateData {
  inputs: Record<string, any>
  spellId: string
}

interface ServiceOptions {}

type UserInfo = {
  id: string
}
interface SpellRunnerParams extends Params {
  user: UserInfo
}

const getSpell = async (spellId: string) => {
  const spell = await prisma.spells.findUnique({
    where: {
      name: spellId,
    },
  })

  return spell
}

export class SpellRunner {
  app: Application

  constructor(app: Application) {
    this.app = app
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-varswaaaa
  async find(params?: Params): Promise<Data[] | Paginated<Data>> {
    return []
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get(id: Id, params?: SpellRunnerParams): Promise<spells | {}> {
    if (!this.app.userSpellManagers) return {}
    if (!params) throw new Error('No params present in service')

    const { user } = params

    if (!user) throw new Error('No user is present in service')
    // Here we get the users spellManagerApp
    const spellManager = this.app.userSpellManagers.get(user.id)

    if (!spellManager) throw new Error('No spell manager created for user!')

    const spell = await getSpell(id as string)

    // Load the spell into the spellManager. If there is no spell runner, we make one.
    await spellManager.load(spell as unknown as Spell)

    return spell
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(
    data: CreateData,
    params?: SpellRunnerParams
  ): Promise<Record<string, unknown>> {
    if (!this.app.userSpellManagers) return {}
    if (!params) throw new Error('No params present in service')

    const { user } = params

    if (!user) throw new Error('No user is present in service')

    const { inputs, spellId } = data

    const spellManager = this.app.userSpellManagers.get(user.id)

    if (!spellManager) throw new Error('No spell manager found for user!')

    const result = await spellManager.run(spellId, inputs)

    return result || {}
  }

  async update(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    spellId: string,
    data: { diff: Record<string, unknown> },
    params?: SpellRunnerParams
  ): Promise<Data> {
    if (!this.app.userSpellManagers) return {}
    if (!params) throw new Error('No params present in service')

    const { user } = params

    if (!user) throw new Error('No user present in service')

    const { diff } = data

    const spellManager = this.app.userSpellManagers.get(user.id)
    if (!spellManager) throw new Error('No spell manager found for user!')

    const spellRunner = spellManager.getSpellRunner(spellId)
    if (!spellRunner) throw new Error('No spell runner found!')

    const spell = spellRunner.currentSpell
    const updatedSpell = otJson0.type.apply(spell, diff)

    spellManager.load(updatedSpell, true)
    return updatedSpell
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async patch(id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove(id: NullableId, params?: Params): Promise<Data> {
    return { id }
  }
}
