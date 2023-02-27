import { SpellRunner, GraphData, Spell as SpellType, projectId } from '@magickml/engine'
import { app } from '../app'
import { buildMagickInterface } from '../buildMagickInterface'
import { ServerError } from '../ServerError'

export type RunSpellArgs = {
  id: string
  inputs?: Record<string, unknown>
  inputFormatter?: (graph: GraphData) => Record<string, unknown>
  projectId: string
}

export const runSpell = async ({ id, inputs, inputFormatter, projectId }: RunSpellArgs) => {
  let spell = (await app.service('spells').find({ query: { projectId, id: id } })).data[0] as any
  
  if (!spell?.graph) {
    throw new ServerError('not-found', `Spell with id ${id} not found`)
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
  await spellRunner.loadSpell(spellToRun as unknown as SpellType)

  // Get the outputs from running the spell
  const outputs = await spellRunner.runComponent({
    inputs: formattedInputs
  })

  return { outputs, name: spell.name }
}
