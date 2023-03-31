// DOCUMENTED 
import { SpellRunner, GraphData, SpellInterface } from '@magickml/engine';
import { app } from '../app';
import { buildMagickInterface } from '../helpers/buildMagickInterface';
import { ServerError } from './ServerError';

/**
 * Type definition for the arguments of the `runSpell` function.
 */
export type RunSpellArgs = {
  spellId: string;
  inputs?: Record<string, unknown>;
  inputFormatter?: (graph: GraphData) => Record<string, unknown>;
  projectId: string;
  secrets?: Record<string, string>;
  publicVariables?: Record<string, unknown>;
};

/**
 * Run a spell with the given parameters.
 *
 * @param {RunSpellArgs} params - The parameters needed to run a spell.
 * @returns {Promise<{outputs: Record<string, unknown>; name: string}>} - The outputs from the spell and its name.
 * @throws {ServerError} - If the spell is not found.
 */
export const runSpell = async ({
  spellId,
  inputs,
  inputFormatter,
  projectId,
  secrets,
  publicVariables,
}: RunSpellArgs): Promise<{ outputs: Record<string, unknown>; name: string }> => {
  // Log the input params
  console.log('runSpell', { spellId, inputs, inputFormatter, projectId, secrets, publicVariables });

  // Find the spells matching the projectId and spellId
  const spells = (await app.service('spells').find({ query: { projectId, id: spellId } })).data;
  const spell = spells[0] as any;

  // If the spell is not found, throw an error
  if (!spell?.graph) {
    throw new ServerError('not-found', `Spell with id ${spellId} not found`);
  }

  // Convert the graph of the spell
  const graph = spell.graph as unknown as GraphData;

  // Build the Magick Interface
  const magickInterface = buildMagickInterface() as any;

  // Format the inputs if an input formatter is provided, otherwise use the inputs directly
  const formattedInputs = inputFormatter ? inputFormatter(graph) : inputs;

  // Clone the spell to run
  const spellToRun = { ...spell };

  // Initialize the spell runner
  const spellRunner = new SpellRunner({ magickInterface });

  // Load the spell into the spell runner
  await spellRunner.loadSpell(spellToRun as unknown as SpellInterface);

  // Get the outputs from running the spell
  const outputs = await spellRunner.runComponent({
    inputs: formattedInputs as Record<string, any>,
    secrets,
    publicVariables,
  }) as Record<string, unknown>;

  // Return the outputs and the spell name
  return { outputs, name: spell.name };
};
