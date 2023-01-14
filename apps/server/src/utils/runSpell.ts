import { SpellRunner, GraphData, Spell as SpellType } from '@magickml/core'
import { prisma } from '@magickml/prisma'
import { CustomError } from './CustomError'
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
  let spell = await prisma.spells.findUnique({
    where: { name: spellName },
  })

  if (!spell?.graph) {
    throw new CustomError('not-found', `Spell with name ${spellName} not found`)
  }

  if(spell){
    // spell.graph, spell.modules and spell.gameState are all JSON
    // parse them back into the object before returning it
    spell.graph = JSON.parse(spell.graph as any)
    spell.modules = JSON.parse(spell.modules as any)
    spell.gameState = JSON.parse(spell.gameState as any)
  }

  const graph = spell.graph as unknown as GraphData
  const magickInterface = buildMagickInterface(state)

  const formattedInputs = inputFormatter ? inputFormatter(graph) : inputs

  const spellToRun = {
    // TOTAL HACK HERE
    ...spell,
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

  return { outputs, state: newState, name: spell.name }
}
