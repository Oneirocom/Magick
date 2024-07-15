import { z, ZodType, ZodTypeDef } from 'zod'

// Define CoreTool type
export interface CoreTool<PARAMETERS extends z.ZodTypeAny = any, RESULT = any> {
  description?: string
  parameters: PARAMETERS
  execute?: (args: z.infer<PARAMETERS>) => PromiseLike<RESULT>
}

// Define CoreToolChoice type
type CoreToolChoice<TOOLS extends Record<string, unknown>> =
  | 'auto'
  | 'none'
  | 'required'
  | {
      type: 'tool'
      toolName: keyof TOOLS
    }

// Define parts used in messages
type TextPart = {
  type: 'text'
  text: string
}

type ImagePart = {
  type: 'image'
  image: string | URL
  mimeType?: string
}

type ToolCallPart = {
  type: 'tool-call'
  toolCallId: string
  toolName: string
  args: unknown
}

type ToolResultPart = {
  type: 'tool-result'
  toolCallId: string
  toolName: string
  result: unknown
  isError?: boolean
}

// Define individual message types
type CoreSystemMessage = {
  role: 'system'
  content: string
}

type CoreUserMessage = {
  role: 'user'
  content: string | Array<TextPart | ImagePart>
}

type CoreAssistantMessage = {
  role: 'assistant'
  content: string | Array<TextPart | ToolCallPart>
}

type CoreToolMessage = {
  role: 'tool'
  content: Array<ToolResultPart>
}

// Combine individual message types into the CoreMessage type
type CoreMessage =
  | CoreSystemMessage
  | CoreUserMessage
  | CoreAssistantMessage
  | CoreToolMessage

// Define request types
export interface GenerateRequest {
  model: string
  tools?: Record<string, CoreTool<any, any>>
  toolChoice?: CoreToolChoice<Record<string, CoreTool<any, any>>>

  system?: string
  prompt?: string
  messages?: CoreMessage[]
  maxTokens?: number
  temperature?: number
  topP?: number
  presencePenalty?: number
  frequencyPenalty?: number
  seed?: number
  maxRetries?: number
  abortSignal?: AbortSignal
  maxToolRoundtrips?: number
}

export interface GenerateObjectRequest<T> extends GenerateRequest {
  schema: ZodType<T, ZodTypeDef, T>
}

export type StreamObjectRequest<T> = GenerateObjectRequest<T>
