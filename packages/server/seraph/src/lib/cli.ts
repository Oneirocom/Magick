import { SeraphCore } from './seraphCore'
// import inquirer from 'inquirer'
import * as dotenv from 'dotenv'
import { MemoryRetrieval } from './cognitive_functions/memory/memory'
import SeraphCLI from './seraphCLI'
import { MemoryStorageMiddleware } from './middleware/memory_storage_middleware'
import { BashExecutor } from './cognitive_functions/bash_executor'
// import { GitManager } from './cognitive_functions/git_manager'
import { importPrivatePrompts } from './utils'

dotenv.config()

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

;(async () => {
  const prompt =
    (await importPrivatePrompts()) || 'You are seraph, a helpful AI angel.'

  const seraph = new SeraphCore({
    prompt,
    openAIApiKey: process.env['OPENAI_API_KEY'] as string,
    anthropicApiKey: process.env['ANTHROPIC_API_KEY'] as string,
  })
  seraph.registerMiddleware(new MemoryStorageMiddleware(seraph))
  // seraph.registerCognitiveFunction(new MemoryStorage(seraph))
  seraph.registerCognitiveFunction(new MemoryRetrieval(seraph))
  seraph.registerCognitiveFunction(new BashExecutor(seraph))
  // seraph.registerCognitiveFunction(new GitManager(seraph))

  new SeraphCLI(seraph)
})()
