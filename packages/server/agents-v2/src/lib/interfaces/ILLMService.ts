import {
  LanguageModelV1CompletionResult,
  LanguageModelV1CallOptions,
  LanguageModelV1StreamResult,
  GenerateObjectOptions,
  GenerateObjectResult,
  StreamObjectOptions,
  StreamObjectResult,
  GenerateUIOptions,
  GenerateUIResult,
  StreamUIOptions,
  StreamUIResult,
  ExtensibleLanguageModel,
} from '@magickml/llm-service-types'
import { ICredentialManager } from './credentialsManager'

export interface ILLMService<ProviderType extends LanguageModelProviderBase> {
  getProviders(): Promise<ProviderType[]>
  getModels<T extends Record<string, unknown> = {}>(
    provider: string
  ): Promise<ExtensibleLanguageModel<T>[]>
  generateText(
    options: LanguageModelV1CallOptions
  ): Promise<LanguageModelV1CompletionResult>
  streamText(
    options: LanguageModelV1CallOptions
  ): Promise<LanguageModelV1StreamResult>
  generateObject<T>(
    options: GenerateObjectOptions<T>
  ): Promise<GenerateObjectResult<T>>
  streamObject<T>(
    options: StreamObjectOptions<T>
  ): Promise<StreamObjectResult<T>>
  generateUI(options: GenerateUIOptions): Promise<GenerateUIResult>
  streamUI(options: StreamUIOptions): Promise<StreamUIResult>
}

export interface ICoreLLMServiceWithCredentials
  extends ILLMService<LanguageModelProviderWithApiKey> {
  setCredentialManager(credentialManager: ICredentialManager): void
}

export interface LanguageModelProviderBase {
  id: string
  name: string
}

export interface LanguageModelProviderWithApiKey
  extends LanguageModelProviderBase {
  apiKey: string
}
