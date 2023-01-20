import { SpellRunner, GraphData, Spell as SpellType } from '@magickml/engine'
import { prisma } from '@magickml/prisma'
import { CustomError } from './CustomError'

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
  let spell = await prisma.spells.findUnique({
    where: { name: spellName },
  })

  if (!spell?.graph) {
    throw new CustomError('not-found', `Spell with name ${spellName} not found`)
  }

  const graph = spell.graph as unknown as GraphData

  const formattedInputs = inputFormatter ? inputFormatter(graph) : inputs

  const spellToRun = {
    // TOTAL HACK HERE
    ...spell,
    gameState: state,
  }

  // Initialize the spell runner
  const spellRunner = new SpellRunner()

  // Load the spell in to the spell runner
  await spellRunner.loadSpell(spellToRun as unknown as SpellType)

  // Get the outputs from running the spell
  const outputs = await spellRunner.defaultRun(formattedInputs)

  // Get the updated state
  const newState = magickInterface.getCurrentGameState()

  return { outputs, state: newState, name: spell.name }
}
