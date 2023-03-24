import { SpellRunner } from '../../src/lib/spellManager'
import { SpellInterface } from '../../src/lib/types'
import { buildMagickInterface } from './buildMagickInterface'


export const runTestSpell = async (spell: any, inputs: Record<string, any>) => {
  const magickInterface = buildMagickInterface() as any
  const spellRunner = new SpellRunner({ magickInterface })
  // Load the spell in to the spell runner
  await spellRunner.loadSpell(spell as SpellInterface)

  // Get the outputs from running the spell
  const outputs = await spellRunner.runComponent({
    inputs
  })
  return outputs
}