import chalk from 'chalk'
import inquirer from 'inquirer'
import boxen from 'boxen'
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import os from 'os'
import * as readline from 'readline'
import { Command } from 'commander'
import { createLogUpdate } from 'log-update'
import { Seraph } from './seraph'

const logUpdate = createLogUpdate(process.stdout, {
  showCursor: true,
})

type CliCommand = {
  name: string
  description: string
  handler: () => void | Promise<void>
}

class SeraphCLI {
  private seraph: Seraph
  private rl: readline.Interface
  private conversationId: string
  commands: CliCommand[] = []

  constructor(seraph: Seraph) {
    this.seraph = seraph
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    this.conversationId = 'cli_conversation'

    this.setupEventListeners()
    this.registerCommands()
    this.setupCommanderProgram()
  }

  registerCommand(command: CliCommand) {
    this.commands.push(command)
  }

  private setupEventListeners() {
    this.seraph.on(
      'info',
      (response: string, data?: Record<string, unknown>) => {
        console.log(
          chalk.blue('Info:') + '\n' + response + '\n' + JSON.stringify(data)
        )
      }
    )

    let accumulatedMessage = ''
    let isMessageStarted = false

    function updateBoxenMessage() {
      const formattedResponse = boxen(
        chalk.blue('Seraph:') + '\n' + accumulatedMessage,
        {
          padding: 2,
          borderStyle: 'round',
          borderColor: 'green',
        }
      )
      logUpdate(formattedResponse)
    }

    this.seraph.on('token', (token: string) => {
      if (token === '<START>') {
        isMessageStarted = true
        accumulatedMessage = ''
        updateBoxenMessage()
      } else if (token === '<END>') {
        isMessageStarted = false
        updateBoxenMessage()
        console.log('')
      } else {
        if (isMessageStarted) {
          accumulatedMessage += token
          updateBoxenMessage()
        }
      }
    })

    this.seraph.on('functionExecution', (functionName: string) => {
      console.log(chalk.yellow(`Executing function: ${functionName}`))
    })

    this.seraph.on('functionResult', (functionName: string, result: string) => {
      const formattedResult = boxen(
        chalk.magenta(`Function Result (${functionName}):`) + '\n' + result,
        { padding: 1, borderStyle: 'round', borderColor: 'magenta' }
      )
      console.log(formattedResult)
    })

    this.seraph.on('middlewareExecution', (middlewareName: string) => {
      console.log(chalk.yellow(`Executing middleware: ${middlewareName}`))
    })

    this.seraph.on(
      'middlewareResult',
      (middlewareName: string, result: string) => {
        console.log(
          chalk.magenta(
            `Middleware Result (${middlewareName}):` + '\n' + result
          )
        )
      }
    )

    // Add other event listeners here...
  }

  private registerCommands() {
    this.registerCommand({
      name: '!vim',
      description: '!vim - Opens text editor to input text',
      handler: this.handleVimCommand.bind(this),
    })

    this.registerCommand({
      name: '!test',
      description: '!test - Test command',
      handler: async () => {
        console.log('!test - Test command executed.')
      },
    })

    this.registerCommand({
      name: '!prompt',
      description: '!prompt - Display the latest current system prompt',
      handler: this.handleGetPrompt.bind(this),
    })
  }

  private async handleGetPrompt() {
    console.log('Current system prompt:')
    console.log(await this.seraph.generateSystemPrompt())
  }

  private async handleVimCommand() {
    const userInput = await this.openExternalEditor()
    logUpdate(chalk.yellow('User input:') + '\n' + userInput)
    await this.sendMessage(userInput)
  }

  private async openExternalEditor(): Promise<string> {
    const tempFilePath = path.join(
      os.tmpdir(),
      `seraph_input_${Date.now()}.txt`
    )

    await new Promise<void>(resolve => {
      const vim = spawn('vim', [tempFilePath], { stdio: 'inherit' })
      vim.on('exit', () => {
        resolve()
      })
    })

    const userInput = fs.readFileSync(tempFilePath, 'utf-8')
    fs.unlinkSync(tempFilePath)

    return userInput
  }

  private setupCommanderProgram() {
    const program = new Command()

    program
      .version('1.0.0')
      .description('Seraph CLI - An AI assistant')
      .action(this.startConversation.bind(this))

    program.parseAsync(process.argv).catch(error => {
      console.error('An error occurred:', error)
    })
  }

  private startConversation() {
    console.log('Welcome to the Seraph CLI!')
    console.log('Type "exit" to end the conversation.\n')

    this.conversationLoop()
  }

  // Display the command menu and handle user selection
  async displayCommandMenu() {
    const { selectedCommand } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedCommand',
        message: 'Select a command:',
        choices: this.commands.map(command => ({
          name: command.description,
          value: command,
        })),
      },
    ])

    // Run the selected command's handler
    await selectedCommand.handler()
  }

  // Handle direct command execution
  async handleDirectCommand(commandName: string) {
    const command = this.commands.find(cmd => cmd.name === commandName)

    if (command) {
      await command.handler()
    } else {
      console.log(`Unknown command: ${commandName}`)
    }
  }

  private async sendMessage(message: string) {
    try {
      const outputs = this.seraph.processInput(
        message,
        this.conversationId,
        false
      )

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for await (const output of outputs) {
        /* empty */
      }
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  private async conversationLoop() {
    const { input } = await inquirer.prompt([
      {
        type: 'input',
        name: 'input',
        message: chalk.yellow('User:'),
      },
    ])

    if (input.trim().toLowerCase() === 'exit') {
      console.log('Conversation ended.')
      return
    }

    if (input.startsWith('!')) {
      if (input === '!help') {
        await this.displayCommandMenu()
      } else {
        await this.handleDirectCommand(input)
      }
    } else {
      this.sendMessage(input)
    }

    this.conversationLoop() // Restart the conversation loop
  }
}

export default SeraphCLI
