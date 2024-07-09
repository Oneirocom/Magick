import { LanguageModelV1CallOptions } from '../language-model-v1-call-options'

export interface GenerateObjectOptions<T> extends LanguageModelV1CallOptions {
  objectTemplate: T
}

export interface StreamObjectOptions<T> extends GenerateObjectOptions<T> {
  maxStreamDuration?: number
  chunkSize?: number
}

export interface GenerateUIOptions extends LanguageModelV1CallOptions {
  uiTemplate?: string
  includeStyling?: boolean
}

export interface StreamUIOptions extends LanguageModelV1CallOptions {
  updateFrequency?: number
  maxStreamDuration?: number
}
