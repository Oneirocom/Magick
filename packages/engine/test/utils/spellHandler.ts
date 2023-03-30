// GENERATED 
/**
 * Runs a test spell with given spell and inputs.
 * @param spell - The spell to be executed.
 * @param inputs - The inputs for the spell.
 * @returns The outputs from running the spell.
 */
export async function runTestSpell(spell: SpellInterface, inputs: MagickSpellInput) {
  // Import necessary interface builder and spell runner
  import { buildMagickInterface } from './buildMagickInterface';
  import { SpellRunner } from '../../src/lib/spellManager';
  
  // Create an instance for magickInterface and spellRunner
  const magickInterface = buildMagickInterface();
  const spellRunner = new SpellRunner({ magickInterface });

  // Load the spell to the spell runner and get its outputs
  await spellRunner.loadSpell(spell);
  const outputs = await spellRunner.runComponent({ inputs });
  
  return outputs;
}