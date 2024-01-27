import { CompletionModels } from './completionModels'
import { CompletionOptions } from './liteLLMTypes'

import { Message, Choice } from './messageTypes'

export type CompletionRequest = {
  model: CompletionModels
  messages: Message[]
  options?: CompletionOptions
  api_key?: string
}

export type CompletionResponse = {
  id: string
  choices: Choice[]
  created: string
  model: string
  object: string
  system_fingerprint: any | null
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  _python_object: any
}
