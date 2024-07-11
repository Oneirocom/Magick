import { LanguageModelV1CallWarning } from '../language-model-v1-call-warning'
import { LanguageModelV1FinishReason } from '../language-model-v1-finish-reason'
import { LanguageModelV1LogProbs } from '../language-model-v1-logprobs'

// Result types for various functions

// Result type for generateObject function
export type GenerateObjectResult<T> = {
  object: T
  finishReason: LanguageModelV1FinishReason
  usage: {
    promptTokens: number
    completionTokens: number
  }
  rawResponse?: {
    headers?: Record<string, string>
  }
  warnings?: LanguageModelV1CallWarning[]
  logprobs?: LanguageModelV1LogProbs
}

// Result type for streamUI function
export type StreamUIResult = {
  stream: ReadableStream<StreamUIPart>
  finishReason: LanguageModelV1FinishReason
  usage: {
    promptTokens: number
    completionTokens: number
  }
  rawResponse?: {
    headers?: Record<string, string>
  }
  warnings?: LanguageModelV1CallWarning[]
  logprobs?: LanguageModelV1LogProbs
}

// Result type for streamText function
export type StreamTextReturn = AsyncGenerator<
  TextStreamYield,
  TextStreamResult,
  unknown
>

// Result type for streamObject function
export type StreamObjectReturn<T> = AsyncGenerator<
  StreamObjectYield<T>,
  StreamObjectResult<T>,
  unknown
>

// Stream parts and yield types

// Stream part type for StreamUIPart
export type StreamUIPart =
  | { type: 'ui-delta'; uiDelta: UIDelta }
  | { type: 'error'; error: unknown }
  | {
      type: 'finish'
      finishReason: LanguageModelV1FinishReason
      logprobs?: LanguageModelV1LogProbs
      usage: { promptTokens: number; completionTokens: number }
    }

// Stream yield type for StreamTextReturn
type TextStreamYield = { choices: [{ delta: { content: string } }] }

// Stream result type for StreamTextReturn
type TextStreamResult = string

// Stream yield type for StreamObjectReturn
type StreamObjectYield<T> = {
  choices: [{ delta: { content: DeepPartial<T> } }]
}

// Stream result type for StreamObjectReturn
type StreamObjectResult<T> = DeepPartial<T>

// Type definition for deep partial object
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}

// Type definition for ObjectStreamPart
export type ObjectStreamPart<T> = T | string | ObjectStreamInputPart

// Type definition for ObjectStreamInputPart
export type ObjectStreamInputPart = {
  type: 'start' | 'update' | 'end'
  data: unknown
}

// Token usage type definition
export type TokenUsage = { promptTokens: number; completionTokens: number }

// UIDelta and UIChange types

// Example UIDelta type definition
interface UIDelta {
  changes: UIChange[]
}

// Example UIChange type definition with at least one of elementId or className
type AtLeastOne<T, K extends keyof T = keyof T> = K extends keyof T
  ? Omit<T, K> & Required<Pick<T, K>>
  : never

// Base UIChange type definition
interface BaseUIChange {
  changeType: 'text' | 'attribute' | 'structure'
  details: TextChange | AttributeChange | StructureChange
}

// UIChange type definition
type UIChange = AtLeastOne<
  BaseUIChange & { elementId?: string; className?: string },
  'elementId' | 'className'
>

// TextChange type definition
interface TextChange {
  newText: string
}

// AttributeChange type definition
interface AttributeChange {
  attribute: string
  newValue: string | number | boolean
}

// StructureChange type definition
interface StructureChange {
  action: 'add' | 'remove' | 'move'
  element?: UIElement // Details of the new element (if action is 'add')
  newParentId?: string // New parent element ID (if action is 'move')
}

// UIElement type definition
interface UIElement {
  id: string
  type: string // Type of UI element (e.g., 'div', 'span', 'button')
  attributes: Record<string, string | number | boolean>
  children?: UIElement[]
}

// GenerateUIResult type definition
export type GenerateUIResult = {
  ui: UIDelta
  finishReason: LanguageModelV1FinishReason
  usage: {
    promptTokens: number
    completionTokens: number
  }
  rawResponse?: {
    headers?: Record<string, string>
  }
  warnings?: LanguageModelV1CallWarning[]
  logprobs?: LanguageModelV1LogProbs
}
