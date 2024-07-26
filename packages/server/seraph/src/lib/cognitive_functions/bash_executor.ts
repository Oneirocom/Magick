// bash_executor.ts
import { BaseCognitiveFunction } from '../base_cognitive_function'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as readline from 'readline'
import { SeraphCore } from '../seraphCore'

const execAsync = promisify(exec)

const SAFE_MODE = true

const functionDefinition = {
  name: 'bashExecutor',
  description:
    'Executes Bash commands on the local machine. Be sure to always check your memory before running commands, and always save the results of your learning and command results to memory.',
  parameters: {
    command: {
      type: 'string',
      description:
        'The Bash command to execute.  Be sure to wrap this in a CDATA tag so we dont try to parse symbols like &&.',
    },
  },
  examples: [
    `<invoke>
      <tool_name>bashExecutor</tool_name>
      <parameters>
        <command>ls -l</command>
      </parameters>
    </invoke>`,
  ],
}

class BashExecutor extends BaseCognitiveFunction {
  seraph: SeraphCore
  constructor(seraph: SeraphCore) {
    super(functionDefinition)
    this.seraph = seraph
  }

  async getPromptInjection(): Promise<string> {
    return `<bash_instructions>You can use bash commands for almost anything.  Generating new files, reading files, exploring the code file tree. When you run a bash command, you will receive back the result of running the command which will stay in our comnversation history.</bash_instructions>
    <IMPORTANT>Before you run any bash command, retreive from your memory previous runs of bash commands or tasks so you can learn from your mistakes.  After generating and executing bash commands, store your commentary on running the bash command, along with the exact result of the execution. Remember to tag the memory so you know it is a bash command.
    </IMPORTANT>
`
  }

  async execute(args: Record<string, any>): Promise<string> {
    const { command } = args

    if (SAFE_MODE) {
      // Prompt the user for confirmation before executing the command
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      })

      const confirmationPrompt = `Do you want to execute the following Bash command?
Command: ${command}
Enter 'y' to confirm or 'n' to cancel: `

      const confirmation = await new Promise<string>(resolve => {
        rl.question(confirmationPrompt, answer => {
          rl.close()
          resolve(answer.trim().toLowerCase())
        })
      })

      if (confirmation !== 'y') {
        const reason = await new Promise<string>(resolve => {
          rl.question('Why are you canceling? ', answer => {
            rl.close()
            resolve(answer.trim())
          })
        })

        rl.close()

        return (
          'Bash command execution canceled by the user.  Reason give: ' + reason
        )
      }
    }

    try {
      this.seraph.emit('info', 'Executing Bash command', { command })
      const { stdout, stderr } = await execAsync(command)
      if (stderr) {
        return `Error executing Bash command: ${stderr}`
      }
      return stdout
    } catch (error: any) {
      return `Error executing Bash command: ${error.message}`
    }
  }
}

export { BashExecutor }
