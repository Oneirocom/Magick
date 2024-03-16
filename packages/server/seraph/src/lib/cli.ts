import chalk from 'chalk'
import { Seraph } from './seraph'
import * as readline from 'readline'
import * as dotenv from 'dotenv'
import { MemoryRetrieval, MemoryStorage } from './cognitive_functions/memory'

dotenv.config()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
})

// validate API keys are in process env
if (!process.env['OPENAI_API_KEY']) {
  console.error(
    'OPENAI_API_KEY is not defined. Please add to your environment variables.'
  )
  process.exit(1)
}

if (!process.env['ANTHROPIC_API_KEY']) {
  console.error(
    'ANTHROPIC_API_KEY is not defined. Please add to your environment variables.'
  )
  process.exit(1)
}

const prompt = 'You are Seraph, an AI assistant.'
const seraph = new Seraph({
  prompt,
  openAIApiKey: process.env['OPENAI_API_KEY'] as string,
  anthropicApiKey: process.env['ANTHROPIC_API_KEY'] as string,
})
// seraph.registerCognitiveFunction(new JokeGenerator())
seraph.registerCognitiveFunction(new MemoryStorage(seraph))
seraph.registerCognitiveFunction(new MemoryRetrieval(seraph))
const conversationId = 'cli_conversation'

function startConversation() {
  rl.setPrompt('User: ')
  rl.prompt()
  rl.on('line', async input => {
    if (input.trim().toLowerCase() === 'exit') {
      rl.close()
      return
    }

    const response = seraph.processInput(input, conversationId)

    for await (const message of response) {
      console.log(chalk.greenBright('\nSeraph:', message, '\n'))
    }

    rl.prompt()
  })
}

console.log('Welcome to the Seraph CLI!')
console.log('Type "exit" to end the conversation.\n')
startConversation()
