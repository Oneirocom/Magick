// DOCUMENTED
import { SpellManager } from '../spellManager/index'
import { GraphData } from 'shared/core'
import { SpellInterface } from 'server/schemas'
import { SpellError } from './SpellError'

/**
 * Type definition for the arguments of the `runSpell` function.
 */
export type RunSpellArgs = {
  spellId: string
  inputs?: Record<string, unknown>
  inputFormatter?: (graph: GraphData) => Record<string, unknown>
  projectId: string
  secrets: Record<string, string>
  publicVariables?: Record<string, unknown>
  app?: any
  agent?: any
}

/**
 * Run a spell with the given parameters.
 *
 * @param {RunSpellArgs} params - The parameters needed to run a spell.
 * @returns {Promise<{outputs: Record<string, unknown>; name: string}>} - The outputs from the spell and its name.
 * @throws {SpellError} - If the spell is not found.
 */
export const runSpell = async ({
  spellId,
  inputs,
  inputFormatter,
  projectId,
  secrets,
  publicVariables,
  app,
  agent,
}: RunSpellArgs): Promise<{
  outputs: Record<string, unknown>
  name: string
}> => {
  // rewrite using fetch
  const spells = await app.service('spells').find({
    query: {
      id: spellId,
      projectId,
    },
  })

  // Get the first spell
  const spell = spells.data[0]

  console.log('spell', spell)

  // If the spell is not found, throw an error
  if (!spell?.graph) {
    throw new SpellError(
      'not-found',
      `Spell with id ${spellId} not found: ${spell}`
    )
  }

  // Convert the graph of the spell
  const graph = spell.graph as unknown as GraphData

  // Format the inputs if an input formatter is provided, otherwise use the inputs directly
  const formattedInputs = inputFormatter ? inputFormatter(graph) : inputs

  // Clone the spell to run
  const spellToRun = { ...spell } as SpellInterface

  console.log('RUNSPEL AGENT', agent)

  const spellManager = new SpellManager({ app, agent })

  spellManager.load(spellToRun)

  // Get the outputs from running the spell
  const outputs = (await spellManager.run({
    spellId: spellToRun.id,
    inputs: formattedInputs as Record<string, any>,
    secrets,
    publicVariables: publicVariables || {},
    app,
  })) as Record<string, unknown>

  // Return the outputs and the spell name
  return { outputs, name: spell.name }
}
