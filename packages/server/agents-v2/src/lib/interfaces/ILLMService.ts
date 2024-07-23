import {
  GenerateObjectResult,
  // GenerateUIOptions,
  // GenerateUIResult,
  // StreamUIOptions,
  // StreamUIResult,
  ExtensibleLanguageModel,
  GenerateRequest,
  CoreTool,
  StreamTextReturn,
  GenerateObjectRequest,
  StreamObjectRequest,
  StreamObjectReturn,
} from '@magickml/llm-service-types'

export interface ILLMService {
  getProviders<T extends Record<string, unknown> = {}>(): Promise<
    ExtensibleLanguageModelProvider<T>[]
  >
  getModels<T extends Record<string, unknown> = {}>(
    provider: string
  ): Promise<ExtensibleLanguageModel<T>[]>
  generateText<TOOLS extends Record<string, CoreTool>>(
    request: GenerateRequest & { tools?: TOOLS },
    extraMetadata?: Record<string, unknown>
  ): Promise<string>
  streamText(
    options: GenerateRequest,
    extraMetadata?: Record<string, unknown>
  ): StreamTextReturn
  generateObject<T>(
    request: GenerateObjectRequest<T>,
    extraMetadata: Record<string, unknown>
  ): Promise<GenerateObjectResult<T>>
  streamObject<T>(
    request: StreamObjectRequest<T>,
    extraMetadata?: Record<string, unknown>
  ): Promise<StreamObjectReturn<T>>
  // generateUI(options: GenerateUIOptions): Promise<GenerateUIResult>
  // streamUI(options: StreamUIOptions): Promise<StreamUIResult>
}

export type LanguageModelProvider = {
  id: string
  name: string
}

export type ExtensibleLanguageModelProvider<
  T extends Record<string, unknown> = {}
> = LanguageModelProvider & T
