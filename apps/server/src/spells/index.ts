import { extractModuleInputKeys, Spell } from '@magickml/engine'
import { prisma } from '@magickml/prisma'
import Koa from 'koa'
import otJson0 from 'ot-json0'

import { Route } from '../types'
import { CustomError } from '../utils/CustomError'
import { runSpell } from '../utils/runSpell'

export const modules: Record<string, unknown> = {}

const runSpellHandler = async (ctx: Koa.Context) => {
  const { spell: spellName } = ctx.params
  const { userGameState = {} } = ctx.request.body

  const inputFormatter = graph => {
    // Extract any keys from the graphs inputs
    const inputKeys = extractModuleInputKeys(graph) as string[]

    // We should report on them here
    return inputKeys.reduce((acc: { [x: string]: any[] }, input: string) => {
      const requestInput = ctx.request.body[input]

      if (requestInput) {
        acc[input] = requestInput
      } else {
        acc[input] = null
      }
      return acc
    }, {} as Record<string, unknown>)
  }

    const { outputs, state, name } = await runSpell({
      spellName,
      state: userGameState,
      inputFormatter,
    })
    // Return the response
    ctx.body = { spell: name, outputs, state }
}

const saveDiffHandler = async (ctx: Koa.Context) => {
  const { body } = ctx.request
  const { name, diff } = body

  console.log('saving diff', name, diff)

  if (!body) throw new CustomError('input-failed', 'No parameters provided')

  let spell = await prisma.spells.findUnique({ where: { name } })

  if (!spell)
    throw new CustomError('input-failed', `No spell with ${name} name found.`)
  if (!diff)
    throw new CustomError('input-failed', 'No diff provided in request body')

    const spellUpdate = otJson0.type.apply(spell, diff)

    if (Object.keys((spellUpdate as Spell).graph.nodes).length === 0)
      throw new CustomError(
        'input-failed',
        'Graph would be cleared.  Aborting.'
      )

    const updatedSpell = await prisma.spells.update({
      where: { name },
      data: spellUpdate,
      include: {
        agents: true,
      },
    })

    // get all entities from this spell and set to dirty
    await updatedSpell.agents.forEach(async entity => {
      await prisma.agents.update({
        where: { id: entity.id },
        data: {
          dirty: true,
        },
      })
    })

    ctx.response.status = 200
    ctx.body = updatedSpell
}

export const spells: Route[] = [
  {
    path: '/spells/saveDiff',
    post: saveDiffHandler,
  },
  {
    path: '/spells/:spell',
    post: runSpellHandler,
  },
]
