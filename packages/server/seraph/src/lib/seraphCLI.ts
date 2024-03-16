import chalk from 'chalk'
import inquirer from 'inquirer'
import boxen from 'boxen'
import * as readline from 'readline'
import { Seraph } from './seraph'
import { Command } from 'commander'

class SeraphCLI {
  private seraph: Seraph
  private rl: readline.Interface
  private conversationId: string

  constructor(seraph: Seraph) {
    this.seraph = seraph
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    this.conversationId = 'cli_conversation'

    this.setupEventListeners()
    this.setupCommanderProgram()
  }

  private setupEventListeners() {
    this.seraph.on('message', (role, response: string) => {
      const formattedResponse = boxen(chalk.blue('Seraph:') + '\n' + response, {
        padding: 1,
        borderStyle: 'round',
        borderColor: 'green',
      })
      console.log(formattedResponse)
    })

    this.seraph.on(
      'info',
      (response: string, data?: Record<string, unknown>) => {
        const formattedResponse = boxen(
          chalk.blue('Info:') + '\n' + response + '\n' + JSON.stringify(data),
          {
            padding: 1,
            borderStyle: 'round',
            borderColor: 'blue',
          }
        )
        console.log(formattedResponse)
      }
    )

    this.seraph.on('functionExecution', (functionName: string) => {
      const formattedExecution = boxen(
        chalk.yellow(`Executing function: ${functionName}`),
        { padding: 1, borderStyle: 'round', borderColor: 'yellow' }
      )
      console.log(formattedExecution)
    })

    this.seraph.on('functionResult', (functionName: string, result: string) => {
      const formattedResult = boxen(
        chalk.magenta(`Function Result (${functionName}):`) + '\n' + result,
        { padding: 1, borderStyle: 'round', borderColor: 'magenta' }
      )
      console.log(formattedResult)
    })

    // Add other event listeners here...
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

    try {
      const response = this.seraph.processInput(input, this.conversationId)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for await (const message of response) {
        // Handle responses here if needed
      }
    } catch (error) {
      console.error('An error occurred:', error)
    }

    this.conversationLoop() // Restart the conversation loop
  }
}

export default SeraphCLI
