import { SpellRunner, GraphData, SpellInterface } from '@magickml/engine'
import { app } from '../app'
import { buildMagickInterface } from '../helpers/buildMagickInterface'
import { ServerError } from './ServerError'

export type RunSpellArgs = {
  spellId: string
  inputs?: Record<string, unknown>
  inputFormatter?: (graph: GraphData) => Record<string, unknown>
  projectId: string
  secrets?: Record<string, string>
  publicVariables?: Record<string, unknown>
}

export const runSpell = async ({ spellId, inputs, inputFormatter, projectId, secrets = {}, publicVariables = {} }: RunSpellArgs) => {
  console.log('***', new Error().stack)
  console.log('runSpell', { spellId, inputs, inputFormatter, projectId, secrets, publicVariables })
  const spells = (await app.service('spells').find({ query: { projectId, id: spellId } })).data
  const spell = spells[0] as any

  if (!spell?.graph) {
    throw new ServerError('not-found', `Spell with id ${spellId} not found`)
  }



  const graph = spell.graph as unknown as GraphData
  const magickInterface = buildMagickInterface() as any

  const formattedInputs = inputFormatter ? inputFormatter(graph) : inputs

  const spellToRun = {
    // TOTAL HACK HERE
    ...spell
  }

  // Initialize the spell runner
  const spellRunner = new SpellRunner({ magickInterface })

  // Load the spell in to the spell runner
  await spellRunner.loadSpell(spellToRun as unknown as SpellInterface)

  // Get the outputs from running the spell
  const outputs = await spellRunner.runComponent({
    inputs: formattedInputs as Record<string, any>,
    secrets,
    publicVariables,
  })

  return { outputs, name: spell.name }
}
