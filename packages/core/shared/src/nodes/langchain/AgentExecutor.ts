// DOCUMENTED 
import { DropdownControl, pluginManager } from '@magickml/core';
import Rete from 'rete';
import { InputControl } from '../../dataControls/InputControl';
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator';
import { MagickComponent } from '../../engine';
import {
    embeddingSocket,
    eventSocket,
    stringSocket,
    triggerSocket
} from '../../sockets';
import {
    CompletionProvider,
    Event,
    MagickNode,
    MagickWorkerInputs,
    MagickWorkerOutputs,
    ModuleContext,
    WorkerData
} from '../../types';

/**
 * Information about the EventStore class
 */
const info = 'Agent Executor is used to formulate an thought about the tools available to the agent and plan an action'

/**
 * AgentExecutor class that extends MagickComponent
 */
export class AgentExecutor extends MagickComponent<Promise<void>> {
    constructor() {
        super('Agent Executor', { outputs: { trigger: 'option' } }, 'Langchain', info)
    }

    /**
     * Builder function to configure the node for event storage
     * @param node
     */
    builder(node: MagickNode) {

        const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
        const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
        const outputGenerator = new SocketGeneratorControl({
            connectionType: 'output',
            ignored: ['trigger'],
            name: 'Output Sockets',
        })

        const inputGenerator = new SocketGeneratorControl({
            connectionType: 'input',
            ignored: ['trigger'],
            name: 'Input Sockets',
        })

        const nameControl = new InputControl({
            dataKey: 'name',
            name: 'Component Name',
        })

        const completionProviders = pluginManager.getCompletionProviders('text', [
            'text',
            'chat',
        ]) as CompletionProvider[]

        // get the models from the completion providers and flatten into a single array
        const models = completionProviders.map(provider => provider.models).flat()

        const modelName = new DropdownControl({
            name: 'Model Name',
            dataKey: 'model',
            values: models,
            defaultValue: models[0],
        })

        node.inspector.add(modelName)
        node.inspector
            .add(nameControl)
            .add(inputGenerator)
            .add(outputGenerator)

        return node
            .addInput(dataInput)
            .addOutput(dataOutput)

    }

    /**
     * Worker function to process and store the event
     * @param node
     * @param inputs
     * @param _outputs
     * @param context
     */
    async worker(
        node: WorkerData,
        inputs: MagickWorkerInputs,
        _outputs: MagickWorkerOutputs,
        context: ModuleContext,
    ) {
        const { projectId } = context
        const { app } = context.module

        
    }
}
