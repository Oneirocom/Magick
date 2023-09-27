// UNDOCUMENTED
import Rete from 'shared/rete'
import { MagickComponent } from '../../engine'
import {
  arraySocket,
  booleanSocket,
  stringSocket,
  triggerSocket,
} from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'
import { BooleanControl } from '../../dataControls/BooleanControl'
import { InputControl } from '../../dataControls/InputControl'

/** Information related to the CommandParser */
const info =
  'Takes a string input and an optional string array of commands and parses it into a command, arguments and boolean indicating if it is a command.'

/** Type definition for the worker return */
type WorkerReturn = {
  command?: string
  args?: string[]
  isCommand?: boolean
}

/**  Type definition for the parsed command */
type ParsedCommand = {
  command: string
  args: string[]
  isCommand: boolean
}

/**
 * CommandParser component for parsing commands.
 */
export class CommandParser extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super(
      'Command Parser',
      {
        outputs: {
          trigger: 'option',
          command: 'output',
          args: 'output',
          isCommand: 'output',
        },
      },
      'Flow',
      info
    )
  }

  /**
   * Builder for CommandParser.
   * @param node - the MagickNode instance.
   * @returns a configured node with sockets.
   */
  builder(node: MagickNode) {
    const triggerInput = new Rete.Input(
      'trigger',
      'Trigger',
      triggerSocket,
      true
    )
    const command = new Rete.Input('command', 'Command', stringSocket)
    const commandList = new Rete.Input(
      'commandList',
      'Command List',
      arraySocket
    )

    const triggerOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const commandOutput = new Rete.Output('command', 'Command', stringSocket)
    const argsOutput = new Rete.Output('args', 'Arguments', arraySocket)
    const isCommandOutput = new Rete.Output(
      'isCommand',
      'Is Command',
      booleanSocket
    )

    node
      .addInput(triggerInput)
      .addInput(command)
      .addInput(commandList)
      .addOutput(triggerOutput)
      .addOutput(commandOutput)
      .addOutput(argsOutput)
      .addOutput(isCommandOutput)

    const useCheckList = new BooleanControl({
      dataKey: 'useCheckList',
      name: 'Use Check List',
      icon: 'moon',
      tooltip: 'Use the command list to check if the command is valid.',
      defaultValue: true,
    })
    const commandStarter = new InputControl({
      dataKey: 'commandStarter',
      name: 'Command Starter',
      icon: 'moon',
      tooltip: 'What characters to start your command with.',
      defaultValue: '/',
    })

    node.inspector.add(useCheckList).add(commandStarter)

    return node
  }

  /**
   * Parser for
   * @param input - the user input.
   * @param checkList - an array of strings of commands to check against.
   * @param useCheckList - a boolean indicating whether to use the check list.
   * @returns an object with isCommand, command, and args.
   */
  parseCommand(
    input: string,
    checkList: string[],
    useCheckList: boolean,
    commandStarter: string
  ): ParsedCommand {
    let isCommand = false
    let command = ''
    let args: string[] = []

    if (input.startsWith(commandStarter)) {
      const inputArray = input.split(' ')
      command = inputArray[0].substring(1)
      args = inputArray.slice(1)
      isCommand = useCheckList ? checkList.includes(command) : true
    }

    return {
      isCommand,
      command,
      args,
    }
  }

  /**
   * Worker for processing the generated text.
   * @param node - the worker data.
   * @param inputs - worker inputs.
   * @param outputs - worker outputs.
   * @returns an object with the success status and result or error message.
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs
  ) {
    const input = inputs.command[0] as string
    const commandList = inputs?.commandList?.[0] as string[]
    const useCheckList = (node?.data?.useCheckList as boolean) ?? false
    const commandStarter = (node?.data?.commandStarter as string) ?? '/'

    return this.parseCommand(input, commandList, useCheckList, commandStarter)
  }
}
