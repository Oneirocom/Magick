import { LanguageModelV1CallWarning } from '../language-model-v1-call-warning'
import { LanguageModelV1FinishReason } from '../language-model-v1-finish-reason'
import { LanguageModelV1LogProbs } from '../language-model-v1-logprobs'

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

// Result type for streamObject function
export type StreamObjectResult<T> = {
  stream: ReadableStream<StreamObjectPart<T>>
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

type StreamObjectPart<T> =
  | { type: 'object-delta'; objectDelta: Partial<T> }
  | { type: 'error'; error: unknown }
  | {
      type: 'finish'
      finishReason: LanguageModelV1FinishReason
      logprobs?: LanguageModelV1LogProbs
      usage: { promptTokens: number; completionTokens: number }
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

export type StreamUIPart =
  | { type: 'ui-delta'; uiDelta: UIDelta }
  | { type: 'error'; error: unknown }
  | {
      type: 'finish'
      finishReason: LanguageModelV1FinishReason
      logprobs?: LanguageModelV1LogProbs
      usage: { promptTokens: number; completionTokens: number }
    }

// Example UIDelta type definition
interface UIDelta {
  changes: UIChange[]
}

// Example UIChange type definition with at least one of elementId or className
type AtLeastOne<T, K extends keyof T = keyof T> = K extends keyof T
  ? Omit<T, K> & Required<Pick<T, K>>
  : never

interface BaseUIChange {
  changeType: 'text' | 'attribute' | 'structure'
  details: TextChange | AttributeChange | StructureChange
}

type UIChange = AtLeastOne<
  BaseUIChange & { elementId?: string; className?: string },
  'elementId' | 'className'
>

interface TextChange {
  newText: string
}

interface AttributeChange {
  attribute: string
  newValue: string | number | boolean
}

interface StructureChange {
  action: 'add' | 'remove' | 'move'
  element?: UIElement // Details of the new element (if action is 'add')
  newParentId?: string // New parent element ID (if action is 'move')
}

interface UIElement {
  id: string
  type: string // Type of UI element (e.g., 'div', 'span', 'button')
  attributes: Record<string, string | number | boolean>
  children?: UIElement[]
}

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
