// DOCUMENTED 
import { SpellRunner } from '../spellManager/index';
import { GraphData } from '../types';
import { SpellInterface } from '../schemas';
import { SpellError } from './SpellError';
import { API_ROOT_URL } from '../config';

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
  app?: any;
};

/**
 * Run a spell with the given parameters.
 *
 * @param {RunSpellArgs} params - The parameters needed to run a spell.
 * @returns {Promise<{outputs: Record<string, unknown>; name: string}>} - The outputs from the spell and its name.
 * @throws {SpellError} - If the spell is not found.
 */
export const runSpell = async ({
  spellId,
  inputs,
  inputFormatter,
  projectId,
  secrets,
  publicVariables,
  app
}: RunSpellArgs): Promise<{ outputs: Record<string, unknown>; name: string }> => {
  // Log the input params
  console.log('runSpell', { spellId, inputs, inputFormatter, projectId, secrets, publicVariables });

  // rewrite using fetch
  const spells = await fetch(`${API_ROOT_URL}/spells?projectId=${projectId}&id=${spellId}`)
    .then(res => res.json());
  
  const spell = spells[0] as any;

  // If the spell is not found, throw an error
  if (!spell?.graph) {
    throw new SpellError('not-found', `Spell with id ${spellId} not found`);
  }

  // Convert the graph of the spell
  const graph = spell.graph as unknown as GraphData;

  // Format the inputs if an input formatter is provided, otherwise use the inputs directly
  const formattedInputs = inputFormatter ? inputFormatter(graph) : inputs;

  // Clone the spell to run
  const spellToRun = { ...spell };

  // Initialize the spell runner
  const spellRunner = new SpellRunner();

  // Load the spell into the spell runner
  await spellRunner.loadSpell(spellToRun as unknown as SpellInterface);

  // Get the outputs from running the spell
  const outputs = await spellRunner.runComponent({
    inputs: formattedInputs as Record<string, any>,
    secrets,
    publicVariables,
    app
  }) as Record<string, unknown>;

  // Return the outputs and the spell name
  return { outputs, name: spell.name };
};
