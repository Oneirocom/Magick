import Rete from 'rete'
import { triggerSocket, stringSocket, MagickComponent, MagickNode, MagickWorkerInputs, WorkerData, getLogger, objectSocket } from '@magickml/core'
import { interpret, createMachine } from 'xstate'

type WorkerReturn = {
  value: {},
  context: {},
  state: {},
}

export class XStateNodeTransition extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super(
      'XState Transition',
      {
        outputs: {
          trigger: 'option',
          value: 'output',
          context: 'output',
          state: 'output',
        }
      },
      'Flow',
      'Creates an XState machine and transitions it based on the inputs'
    )
  }

  builder(node: MagickNode) {
    const triggerInput = new Rete.Input('trigger', 'Trigger', triggerSocket)
    const contextInput = new Rete.Input('context', 'Context', objectSocket)
    const stateMachineInput = new Rete.Input('stateMachine', 'State Machine', objectSocket)
    const eventInput = new Rete.Input('event', 'Event', stringSocket)
    const triggerOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const valueOutput = new Rete.Output('value', 'Value', stringSocket)
    const contextOutput = new Rete.Output('context', 'Context', objectSocket)
    const stateOutput = new Rete.Output('state', 'State', objectSocket)

    node.addInput(triggerInput)
      .addInput(stateMachineInput)
      .addInput(contextInput)
      .addInput(eventInput)
      .addOutput(triggerOutput)
      .addOutput(valueOutput)
      .addOutput(contextOutput)
      .addOutput(stateOutput)

    return node
  }

  async worker(
    _node: WorkerData,
    inputs: MagickWorkerInputs,
  ): Promise<WorkerReturn> {
    const contextInput: Object = inputs.context[0] as Object
    const stateMachineInput: Object = inputs.stateMachine[0] as Object
    const eventInput: Event = inputs.event[0] as Event
    const machine = createMachine(stateMachineInput).withContext(contextInput)
    const logger = getLogger()
    const promiseService = interpret(machine).onTransition((state) =>
    logger.debug(state.value));
    promiseService.start()
    promiseService.send(eventInput)
    const machineState = promiseService.nextState(eventInput)
    return {
      value: machineState.value,
      context: machineState.context as Object,
      state: machineState,
    }
  }
}
