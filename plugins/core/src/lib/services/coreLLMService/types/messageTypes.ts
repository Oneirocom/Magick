import { FunctionType } from './liteLLMTypes'

export type Message = {
  role: string
  content: string | null
  name?: string
  function_call?: {
    type: string
    function: FunctionType
  }
}

export type Chunk = {
  choices: ChunkChoice[]
}

export type ChunkChoice = {
  finish_reason: string
  index: number
  delta: {
    function_call: string
    tool_calls: string
    content: string
    role: string
  }
}

export type Choice = {
  finish_reason: string
  index: number
  message: {
    role: string
    content: string
  }
}
