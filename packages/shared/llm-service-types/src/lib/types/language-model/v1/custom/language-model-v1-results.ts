import { LanguageModelV1StreamPart } from '../language-model-v1'
import { LanguageModelV1CallWarning } from '../language-model-v1-call-warning'
import { LanguageModelV1FinishReason } from '../language-model-v1-finish-reason'
import { LanguageModelV1FunctionToolCall } from '../language-model-v1-function-tool-call'
import { LanguageModelV1LogProbs } from '../language-model-v1-logprobs'

export type LanguageModelV1CompletionResult = {
  text?: string
  toolCalls?: Array<LanguageModelV1FunctionToolCall>
  finishReason: LanguageModelV1FinishReason
  usage: {
    promptTokens: number
    completionTokens: number
  }
  rawCall: {
    rawPrompt: unknown
    rawSettings: Record<string, unknown>
  }
  rawResponse?: {
    headers?: Record<string, string>
  }
  warnings?: LanguageModelV1CallWarning[]
  logprobs?: LanguageModelV1LogProbs
}

export type LanguageModelV1StreamResult = {
  stream: ReadableStream<LanguageModelV1StreamPart>
  rawCall: {
    rawPrompt: unknown
    rawSettings: Record<string, unknown>
  }
  rawResponse?: {
    headers?: Record<string, string>
  }
  warnings?: LanguageModelV1CallWarning[]
}
