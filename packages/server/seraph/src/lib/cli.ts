import { Seraph } from './seraph'
import * as readline from 'readline'
import { JokeGenerator } from './cognitive_functions/joke_generator'

import dotenv from 'dotenv'

dotenv.config({
  path: '../../../../../.env.local',
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
})

const prompt = 'You are Seraph, an AI assistant.'
const seraph = new Seraph(prompt)
seraph.registerCognitiveFunction(new JokeGenerator())

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
      console.log('Seraph CLI:', message)
    }

    rl.prompt()
  })
}

console.log('Welcome to the Seraph CLI!')
console.log('Type "exit" to end the conversation.\n')
startConversation()
