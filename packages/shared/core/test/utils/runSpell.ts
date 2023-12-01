// DOCUMENTED
import { GraphData, SpellInterface } from '../../src/types'
import { SpellRunner } from '../../src/spellManager'
import type { Application } from 'server/core'

/**
 * Type definition for arguments passed to the runSpell function.
 */
export type RunSpellArgs = {
  app: Application
  id: string
  inputs: Record<string, unknown>
  inputFormatter?: (graph: GraphData) => Record<string, unknown>
  projectId: string
  spell: SpellInterface
}

/**
 * Runs the given spell and returns the resulting outputs.
 *
 * @param args - Arguments for running the spell.
 * @returns - Object containing the spell name and its corresponding outputs.
 */
export const runSpell = async ({
  spell,
  inputs,
  app,
  inputFormatter,
}: RunSpellArgs) => {
  // Cast spell.graph to GraphData
  const graph = spell.graph as unknown as GraphData

  // Format inputs if inputFormatter is provided
  const formattedInputs = inputFormatter ? inputFormatter(graph) : inputs

  // Initialize the spell runner
  // todo find elegant way to inject App into spellrunner, as components workers depend on it
  const spellRunner = new SpellRunner({} as any)

  // Load the spell in to the spell runner
  await spellRunner.loadSpell(spell)

  // Get the outputs from running the spell
  // @ts-ignore
  const outputs = await app.get('agentCommander').runSpellWithResponse({
    // TODO fix this.  We need to pass an agent into runspell for it to work
    inputs: formattedInputs,
  })

  return { outputs, name: spell.name }
}
