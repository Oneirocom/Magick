// DOCUMENTED 
import Rete from 'rete';
import { v4 as uuidv4 } from 'uuid';

import { DropdownControl } from '../../dataControls/DropdownControl';
import { MagickComponent } from '../../engine';
import { pluginManager } from '../../plugin';
import { Module } from '../../plugins/modulePlugin/module';
import { anySocket, eventSocket, triggerSocket } from '../../sockets';
import {
  EditorContext,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData
} from '../../types';

/** Component info text */
const info = `The output component will pass values out from your spell.  
You can have multiple outputs in a spell and all output values will be collected.
It also has an option to send the output to the playtest area for easy testing.`

/** Default output types */
const defaultOutputTypes = [{ name: 'Default', socket: anySocket }];

/**
 * Output component
 */
export class Output extends MagickComponent<void> {
  /**
   * Constructor for Output component
   */
  constructor() {
    super('Output', {
      runOneInput: true,
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }, 'I/O', info);

    this.module = {
      nodeType: 'output',
      socket: anySocket,
    };
  }

  /**
   * Builder for Output component
   * @param node - MagickNode instance
   * @returns MagickNode instance with configured inputs and outputs
   */
  builder(node: MagickNode): MagickNode {
    const triggerInput = new Rete.Input(
      'trigger',
      'Trigger',
      triggerSocket,
      true
    );
    const triggerOutput = new Rete.Output('trigger', 'Trigger', triggerSocket);
    const textInput = new Rete.Input('input', 'Outputs', anySocket, true);
    const event = new Rete.Input('event', 'Event Override', eventSocket);
    const output = new Rete.Output('output', 'Output', anySocket);

    node.data.sendToPlaytest = true;
    
    const values = [...defaultOutputTypes, ...pluginManager.getOutputTypes()];
    node.data.isOutput = true;
    node.data.name = node.data.name ?? `Output - ${values[0].name}`;
    node.data.sendToPlaytest = true;

    const outputType = new DropdownControl({
      name: 'Output Type',
      dataKey: 'outputType',
      values: values.map(v => v.name),
      defaultValue: values[0].name,
    });

    outputType.onData = data => {
      node.data.name = `Output - ${data}`;
    };
    node.inspector.add(outputType);
    // need to automate this part! Won't work without a socket key
    node.data.socketKey = node?.data?.socketKey || uuidv4();

    return node
      .addInput(triggerInput)
      .addInput(textInput)
      .addInput(event)
      .addOutput(triggerOutput)
      .addOutput(output);
  }

  /**
   * Worker function for Output component
   * @param node - WorkerData object
   * @param inputs - MagicWorkerInputs object
   * @param _outputs - MagicWorkerOutputs object
   * @param moduleContext - Module and EditorContext instances
   * @returns output data
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { module, context }: { module: Module; context: EditorContext }
  ): Promise<{ output: string }> {
    if (!inputs.input) {
      console.error('No input provided to output component');
      return { output: '' };
    }

    const outputType = node.data.outputType;
    const output = (inputs.input.filter(Boolean)[0] ?? '') as string;
    const event =
      inputs.event?.[0] || (module.inputs && (Object.values(module.inputs)[0] as unknown[])?.[0]);

    if (context) {
      const { sendToPlaytest } = context;
      if (sendToPlaytest) {
        console.log('sending to playtest', output);
        sendToPlaytest(output);
      }
    }

    if (module.agent) {
      if ((outputType as string).includes('Default')) {
        const inputType = pluginManager.getInputTypes().find(inputType => {
          return (
            inputType.name ===
            Object.keys(module.inputs)[0].replace('Input - ', '')
          );
        });

        const responseOutputType = inputType?.defaultResponseOutput;
        const t = module.agent.outputTypes.find(
          t => t.name === responseOutputType
        );

        console.log('handling', responseOutputType, t);
        t.handler({
          output,
          agent: module.agent,
          event,
        });
      } else {
        // Find the outputType in the outputTypes array
        const t = module.agent.outputTypes.find(t => t.name === outputType);

        // Find outputType in outputTypes where name is outputType
        if (!t) {
          console.error('output type is not defined', t);
        } else if (!t.handler) {
          console.error('output type handler is not defined', t);
        } else {
          console.log('handling', outputType, t);
          t.handler({
            output,
            agent: module.agent,
            event,
          });
        }
      }
    }

    console.log('output', output);

    return {
      output,
    };
  }
}