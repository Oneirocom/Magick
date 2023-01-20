import { SpellRunner, GraphData, Spell as SpellType } from '@magickml/engine'
import { prisma } from '@magickml/prisma'
import { buildMagickInterface } from '../buildMagickInterface'
import { ServerError } from './ServerError'

export type RunSpellArgs = {
  spellName: string
  inputs?: Record<string, unknown>
  inputFormatter?: (graph: GraphData) => Record<string, unknown>
}

export const runSpell = async ({
  spellName,
  inputs,
  inputFormatter,
}: RunSpellArgs) => {
  let spell = await prisma.spells.findUnique({
    where: { name: spellName },
  })

  if (!spell?.graph) {
    throw new ServerError('not-found', `Spell with name ${spellName} not found`)
  }

  const graph = spell.graph as unknown as GraphData
  const magickInterface = buildMagickInterface()

  const formattedInputs = inputFormatter ? inputFormatter(graph) : inputs

  const spellToRun = {
    // TOTAL HACK HERE
    ...spell,
  }

  // Initialize the spell runner
  const spellRunner = new SpellRunner({ magickInterface })

  // Load the spell in to the spell runner
  await spellRunner.loadSpell(spellToRun as unknown as SpellType)

  // Get the outputs from running the spell
  const outputs = await spellRunner.defaultRun(formattedInputs)

  return { outputs, name: spell.name }
}
