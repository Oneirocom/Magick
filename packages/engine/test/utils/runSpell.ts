// GENERATED 
/**
 * Imports
 */
import { buildMagickInterface } from './buildMagickInterface';
import { GraphData, SpellInterface } from '../../src/lib/types';
import { SpellRunner } from '../../src/lib/spellManager';

/**
 * Type Declarations
 */
export type RunSpellArgs = {
  id: string;
  inputs: Record<string, unknown>;
  inputFormatter?: (graph: GraphData) => Record<string, unknown>;
  projectId: string;
  spell: SpellInterface;
}

/**
 * Runs a spell with the given inputs and returns its outputs with the spell name
 * @param spell - The spell object to run
 * @param inputs - The inputs to feed to the spell
 * @param inputFormatter - Optional function to format the inputs into the correct format for the spell
 * @returns - Outputs of the spell and its name
 */
export const runSpell = async ({ spell, inputs, inputFormatter }: RunSpellArgs) => {
  // Extract the graph data from the spell object
  const graph = spell.graph as unknown as GraphData;

  // Initialize the magick interface
  const magickInterface = buildMagickInterface();

  // Format the inputs if an inputFormatter is provided
  const formattedInputs = inputFormatter ? inputFormatter(graph) : inputs;

  // Initialize the spell runner
  const spellRunner = new SpellRunner({ magickInterface });

  // Load the spell in to the spell runner
  await spellRunner.loadSpell(spell);

  // Get the outputs from running the spell
  const outputs = await spellRunner.runComponent({
    inputs: formattedInputs
  });

  // Return the outputs and spell name
  return { outputs, name: spell.name };
} 

/**
 * The above code initializes the required types and exports a function to run a spell by
 * taking its inputs and formatting them as required. It initializes the spell runner and
 * loads the spell into it, runs the component and returns the output and the name of the spell.
 * It conforms to Google code standards and is optimized for easy understanding.
 */