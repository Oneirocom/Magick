// DOCUMENTED
/**
 * A simple rete component that returns the same output as the input.
 * @category Utility
 */
import Rete from 'rete'

import { MagickComponent } from '../../engine'
import { objectSocket, stringSocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickSpellInput,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  ModuleContext,
  SpellInterface,
  WorkerData,
} from '../../types'

/**
 * The return type of the worker function.
 */
type WorkerReturn = {
  output: object
}

/**
 * Returns the same output as the input.
 * @category Utility
 * @remarks This component is useful for testing purposes.
 */
export class RunSpell extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super(
      'Run Spell',
      {
        outputs: {
          output: 'output',
          trigger: 'option',
        },
      },
      'Magick',
      'Runs a given spell with arguments'
    )
  }

  /**
   * The builder function for the Echo node.
   * @param node - The node being built.
   * @returns The node with its inputs and outputs.
   */
  builder(node: MagickNode) {
    const spellInput = new Rete.Input('spell', 'Spell', objectSocket)
    const argumentsInput = new Rete.Input(
      'arguments',
      'Arguments',
      objectSocket
    )

    const triggerInput = new Rete.Input(
      'trigger',
      'Trigger',
      triggerSocket,
      true
    )
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'String', stringSocket)

    return node
      .addInput(triggerInput)
      .addInput(spellInput)
      .addInput(argumentsInput)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  /**
   * The worker function for the Echo node.
   * @param node - The node being worked on.
   * @param inputs - The inputs of the node.
   * @param _outputs - The unused outputs of the node.
   * @returns An object containing the same string as the input.
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: ModuleContext
  ): Promise<WorkerReturn> {
    const spell = inputs.spell[0] as SpellInterface
    const args = inputs.arguments[0] as object

    const { module, spellManager, app } = context
    const { publicVariables, agent, secrets } = module

    const runComponentArgs = {
      spellId: spell.id,
      inputs: args as MagickSpellInput,
      runSubspell: false,
      // we can probably remove agent here since it is in the injected spellManager
      agent: agent,
      secrets: agent?.secrets ?? secrets,
      app,
      publicVariables: agent?.publicVariables ?? publicVariables,
    }

    const output = await spellManager.run(runComponentArgs)

    return {
      output,
    }
  }
}
