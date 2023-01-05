import { SpellRunner, GraphData, Spell as SpellType } from '@magickml/core'

import { database } from '@magickml/database'
import { CustomError } from '../../utils/CustomError'
import { buildThothInterface } from '../spells/buildThothInterface'

export type RunSpellArgs = {
  spellName: string
  inputs?: Record<string, unknown>
  inputFormatter?: (graph: GraphData) => Record<string, unknown>
  state: Record<string, unknown>
}

export const runSpell = async ({
  spellName,
  inputs,
  inputFormatter,
  state = {},
}: RunSpellArgs) => {
  const rootSpell = await database.instance.models.spells.findOne({
    where: { name: spellName },
    raw: true,
  })

  if (!rootSpell?.graph) {
    throw new CustomError('not-found', `Spell with name ${spellName} not found`)
  }

  const graph = rootSpell.graph as GraphData
  const thothInterface = buildThothInterface(state)

  const formattedInputs = inputFormatter ? inputFormatter(graph) : inputs

  const spellToRun = {
    // TOTAL HACK HERE
    ...rootSpell,
    gameState: state,
  }

  // Initialize the spell runner
  const spellRunner = new SpellRunner({ thothInterface })

  // Load the spell in to the spell runner
  await spellRunner.loadSpell(spellToRun as SpellType)

  // Get the outputs from running the spell
  const outputs = await spellRunner.defaultRun(formattedInputs)

  // Get the updated state
  const newState = thothInterface.getCurrentGameState()

  return { outputs, state: newState, name: rootSpell.name }
}
