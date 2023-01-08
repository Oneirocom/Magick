import { SpellRunner, GraphData, Spell as SpellType } from '@magickml/core'
import { prisma } from '@magickml/prisma'
import { CustomError } from '../../utils/CustomError'
import { buildMagickInterface } from '../spells/buildMagickInterface'

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
  let rootSpell = await prisma.spells.findUnique({
    where: { name: spellName },
  })

  if (!rootSpell?.graph) {
    throw new CustomError('not-found', `Spell with name ${spellName} not found`)
  }

  const graph = rootSpell.graph as unknown as GraphData
  const magickInterface = buildMagickInterface(state)

  const formattedInputs = inputFormatter ? inputFormatter(graph) : inputs

  const spellToRun = {
    // TOTAL HACK HERE
    ...rootSpell,
    gameState: state,
  }

  // Initialize the spell runner
  const spellRunner = new SpellRunner({ magickInterface })

  // Load the spell in to the spell runner
  await spellRunner.loadSpell(spellToRun as unknown as SpellType)

  // Get the outputs from running the spell
  const outputs = await spellRunner.defaultRun(formattedInputs)

  // Get the updated state
  const newState = magickInterface.getCurrentGameState()

  return { outputs, state: newState, name: rootSpell.name }
}
