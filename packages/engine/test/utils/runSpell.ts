import { buildMagickInterface } from './buildMagickInterface'
import { GraphData, Spell } from '../../src/lib/types'
import { SpellRunner } from '../../src/lib/spellManager'

export type RunSpellArgs = {
  id: string
  inputs: Record<string, unknown>
  inputFormatter?: (graph: GraphData) => Record<string, unknown>
  projectId: string
  spell: Spell
}

export const runSpell = async ({ spell, inputs, inputFormatter }: RunSpellArgs) => {
  const graph = spell.graph as unknown as GraphData
  const magickInterface = buildMagickInterface() as any

  const formattedInputs = inputFormatter ? inputFormatter(graph) : inputs

  // Initialize the spell runner
  const spellRunner = new SpellRunner({ magickInterface })

  // Load the spell in to the spell runner
  await spellRunner.loadSpell(spell)

  // Get the outputs from running the spell
  const outputs = await spellRunner.runComponent({
    inputs: formattedInputs
  })

  return { outputs, name: spell.name }
}
