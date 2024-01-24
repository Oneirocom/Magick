import { type PluginCredential } from 'server/credentials'
import { EmbeddingModels } from '../coreEmbeddingService/types'

export type FunctionType = {
  name: string
  description?: string
  parameters: Record<string, unknown>
}

export type Message = {
  role: string
  content: string | null
  name?: string
  function_call?: {
    type: string
    function: FunctionType
  }
}
export interface ModelProviderMapping {
  provider: LLMProviders
  apiKey: LLMProviderKeys
}

export type LiteLLMOptions = {
  api_base?: string
  api_version?: string
  api_key?: string
  num_retries?: number
  context_window_fallback_dict?: Record<string, string>
  fallbacks?: Array<Record<string, unknown>>
  metadata?: Record<string, unknown>
}

export type ToolType = {
  type: string
  function: FunctionType
}

export type CompletionOptions = {
  temperature?: number
  top_p?: number
  n?: number
  stream?: boolean
  stop?: string | string[]
  max_tokens?: number
  presence_penalty?: number
  frequency_penalty?: number
  logit_bias?: Record<string, number>
  user?: string
  deployment_id?: string
  request_timeout?: number
  response_format?: {
    type: string
  }
  seed?: number
  tools?: ToolType[]
  tool_choice?: string | ToolType
  functions?: FunctionType[]
  function_call?: string
} & LiteLLMOptions

export type CompletionRequest = {
  model: CompletionModels
  messages: Message[]
  options?: CompletionOptions
  api_key?: string
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

export enum LLMProviderKeys {
  OpenAI = 'OPENAI_API_KEY',
  Azure = 'AZURE_API_KEY',
  Anthropic = 'ANTHROPIC_API_KEY',
  Sagemaker = 'SAGEMAKER_API_KEY',
  Bedrock = 'BEDROCK_API_KEY',
  Anyscale = 'ANYSCALE_API_KEY',
  PerplexityAI = 'PERPLEXITY_API_KEY',
  VLLM = 'VLLM_API_KEY',
  DeepInfra = 'DEEPINFRA_API_KEY',
  Cohere = 'COHERE_API_KEY',
  TogetherAI = 'TOGETHER_AI_API_KEY',
  AlephAlpha = 'ALEPH_ALPHA_API_KEY',
  Baseten = 'BASETEN_API_KEY',
  OpenRouter = 'OPENROUTER_API_KEY',
  CustomAPI = 'CUSTOM_API_KEY',
  CustomOpenAI = 'CUSTOM_OPEN_API_KEY',
  Petals = 'PETALS_API_KEY',
  Ollama = 'OLLAMA_API_KEY',
  GoogleAIStudio = 'GOOGLEAISTUDIO_API_KEY',
  Palm = 'PALM_API_KEY',
  HuggingFace = 'HUGGINGFACE_API_KEY',
  Xinference = 'XINFERENCE_API_KEY',
  CloudflareWorkersAI = 'CLOUDFLAREWORKERSAI_API_KEY',
  AI21 = 'AI21_API_KEY',
  NLPCloud = 'NLPCLOUD_API_KEY',
  VoyageAI = 'VOYAGEAI_API_KEY',
  Replicate = 'REPLICATE_API_KEY',
  Meta = 'META_API_KEY',
  Mistral = 'MISTRAL_API_KEY',
  VertexAI = 'VERTEXAI_API_KEY',
  Unknown = 'unknown',
}

export enum LLMProviders {
  OpenAI = 'OpenAI',
  Azure = 'Azure',
  Anthropic = 'Anthropic',
  Sagemaker = 'Sagemaker',
  Bedrock = 'Bedrock',
  Anyscale = 'Anyscale',
  PerplexityAI = 'PerplexityAI',
  VLLM = 'VLLM',
  DeepInfra = 'DeepInfra',
  Cohere = 'Cohere',
  TogetherAI = 'TogetherAI',
  AlephAlpha = 'AlephAlpha',
  Baseten = 'Baseten',
  OpenRouter = 'OpenRouter',
  CustomAPI = 'CustomAPI',
  CustomOpenAI = 'CustomOpenAI',
  Petals = 'Petals',
  Ollama = 'Ollama',
  GoogleAIStudio = 'GoogleAIStudio',
  Palm = 'Palm',
  HuggingFace = 'HuggingFace',
  Xinference = 'Xinference',
  CloudflareWorkersAI = 'CloudflareWorkersAI',
  AI21 = 'AI21',
  NLPCloud = 'NLPCloud',
  VoyageAI = 'VoyageAI',
  Replicate = 'Replicate',
  Meta = 'Meta',
  Mistral = 'Mistral',
  VertexAI = 'VertexAI',
}

export type Models = EmbeddingModels | CompletionModels

export type LLMCredential = PluginCredential & {
  value: string
}

export type LLMModel = [CompletionModels, LLMProviderKeys]

export enum OpenAIChatCompletionModels {
  GPT35Turbo1106Preview = 'gpt-4-1106-preview',
  GPT35Turbo = 'gpt-3.5-turbo',
  GPT35Turbo1106 = 'gpt-3.5-turbo-1106',
  GPT35Turbo0301 = 'gpt-3.5-turbo-0301',
  GPT35Turbo0613 = 'gpt-3.5-turbo-0613',
  GPT35Turbo16k = 'gpt-3.5-turbo-16k',
  GPT35Turbo16k0613 = 'gpt-3.5-turbo-16k-0613',
  GPT4 = 'gpt-4',
  GPT40314 = 'gpt-4-0314',
  GPT40613 = 'gpt-4-0613',
}

export enum OpenAIVisionModels {
  GPT4VisionPreview = 'gpt-4-vision-preview',
}

export enum OpenAITextCompletionInstructModels {
  GPT35TurboInstruct = 'gpt-3.5-turbo-instruct',
  TextDavinci003 = 'text-davinci-003',
  Ada001 = 'ada-001',
  Curie001 = 'curie-001',
  Babbage001 = 'babbage-001',
  Babbage002 = 'babbage-002',
  Davinci002 = 'davinci-002',
}

export type AzureModel = `azure/${string}`
export type CustomOpenAIModel = `openai/${string}`

// export enum AzureOpenAIChatCompletionModels {
//   Gpt4 = 'azure/gpt-4',
//   Gpt40314 = 'azure/gpt-4-0314',
//   Gpt40613 = 'azure/gpt-4-0613',
//   Gpt432k = 'azure/gpt-4-32k',
//   Gpt432k0314 = 'azure/gpt-4-32k-0314',
//   Gpt432k0613 = 'azure/gpt-4-32k-0613',
//   Gpt35Turbo = 'azure/gpt-3.5-turbo',
//   Gpt35Turbo0301 = 'azure/gpt-3.5-turbo-0301',
//   Gpt35Turbo0613 = 'azure/gpt-3.5-turbo-0613',
//   Gpt35Turbo16k = 'azure/gpt-3.5-turbo-16k',
//   Gpt35Turbo16k0613 = 'azure/gpt-3.5-turbo-16k-0613',
// }

// export enum AzureOpenAIVisionModels {
//   GPT4Vision = 'gpt-4-vision',
// }

export enum HuggingFaceModelsWithPromptFormatting {
  HuggingFaceMistral7BInstructV01 = 'huggingface/mistralai/Mistral-7B-Instruct-v0.1',
  HuggingFaceMetaLlamaLlama27bChat = 'huggingface/meta-llama/Llama-2-7b-chat',
  HuggingFaceTiiuaeFalcon7bInstruct = 'huggingface/tiiuae/falcon-7b-instruct',
  HuggingFaceMosaicmlMpt7bChat = 'huggingface/mosaicml/mpt-7b-chat',
  HuggingFaceCodellamaCodeLlama34bInstructHf = 'huggingface/codellama/CodeLlama-34b-Instruct-hf',
  HuggingFaceWizardLMWizardCoderPython34BV10 = 'huggingface/WizardLM/WizardCoder-Python-34B-V1.0',
  HuggingFacePhindPhindCodeLlama34Bv2 = 'huggingface/Phind/Phind-CodeLlama-34B-v2',
}

export enum OllamaVisionModels {
  LLAVA = 'ollama/llama-va',
}

export enum OllamaModels {
  OlamaMistral = 'ollama/mistral',
  OlamaLlama27B = 'ollama/llama2',
  OlamaLlama213B = 'ollama/llama2:13b',
  OlamaLlama270B = 'ollama/llama2:70b',
  OlamaLlama2Uncensored = 'ollama/llama2-uncensored',
  OlamaCodeLlama = 'ollama/codellama',
  OlamaOrcaMini = 'ollama/orca-mini',
  OlamaVicuna = 'ollama/vicuna',
  OlamaNousHermes = 'ollama/nous-hermes',
  OlamaNousHermes13B = 'ollama/nous-hermes:13b',
  OlamaWizardVicunaUncensored = 'ollama/wizard-vicuna',
}

export enum VertexAIGoogleModels {
  GeminiPro = 'gemini-pro',
  GeminiProVision = 'gemini-pro-vision',
}

export enum PalmModels {
  ChatBison = 'chat-bison',
}

export enum GoogleAIStudioModels {
  GeminiGeminiPro = 'gemini/gemini-pro',
  GeminiGeminiProVision = '/gemini/gemini-pro-vision',
}

export enum MistralAIModels {
  MistralTiny = 'mistral/mistral-tiny',
  MistralSmall = 'mistral/mistral-small',
  MistralMedium = 'mistral/mistral-medium',
}

export enum AnthropicModels {
  Claude21 = 'claude-2.1',
  Claude2 = 'claude-2',
  ClaudeInstant1 = 'claude-instant-1',
  ClaudeInstant12 = 'claude-instant-1.2',
}

export enum SageMakerModels {
  MetaLlama27B = 'sagemaker/jumpstart-dft-meta-textgeneration-llama-2-7b',
  MetaLlama27BChatFineTuned = 'sagemaker/jumpstart-dft-meta-textgeneration-llama-2-7b-f',
  MetaLlama213B = 'sagemaker/jumpstart-dft-meta-textgeneration-llama-2-13b',
  MetaLlama213BChatFineTuned = 'sagemaker/jumpstart-dft-meta-textgeneration-llama-2-13b-f',
  MetaLlama270B = 'sagemaker/jumpstart-dft-meta-textgeneration-llama-2-70b',
  MetaLlama270BChatFineTuned = 'sagemaker/jumpstart-dft-meta-textgeneration-llama-2-70b-b-f',
}

export enum BedrockModels {
  BedrockAnthropicClaudeV21 = 'bedrock/anthropic.claude-v2:1',
  BedrockAnthropicClaudeV2 = 'bedrock/anthropic.claude-v2',
  BedrockAnthropicClaudeInstantV1 = 'bedrock/anthropic.claude-instant-v1',
  BedrockAnthropicClaudeV1 = 'bedrock/anthropic.claude-v1',
  BedrockAmazonTitanLite = 'bedrock/amazon.titan-text-lite-v1',
  BedrockAmazonTitanExpress = 'bedrock/amazon.titan-text-express-v1',
  BedrockCohereCommand = 'bedrock/cohere.command-text-v14',
  BedrockAI21J2Mid = 'bedrock/ai21.j2-mid-v1',
  BedrockAI21J2Ultra = 'bedrock/ai21.j2-ultra-v1',
  BedrockMetaLlama2Chat13b = 'bedrock/meta.llama2-13b-chat-v1',
  BedrockMetaLlama2Chat70b = 'bedrock/meta.llama2-70b-chat-v1',
}

export enum PerplexityAIModels {
  Pplx7bChat = 'perplexity/pplx-7b-chat',
  Pplx70bChat = 'perplexity/pplx-70b-chat',
  Pplx7bOnline = 'perplexity/pplx-7b-online',
  Pplx70bOnline = 'perplexity/pplx-70b-online',
  PplxCodeLlama34bInstruct = 'perplexity/codellama-34b-instruct',
  PplxLlama213bChat = 'perplexity/llama-2-13b-chat',
  PplxLlama270bChat = 'perplexity/llama-2-70b-chat',
  PplxMistral7bInstruct = 'perplexity/mistral-7b-instruct',
  PplxOpenhermes2Mistral7b = 'perplexity/openhermes-2-mistral-7b',
  PplxOpenhermes25Mistral7b = 'perplexity/openhermes-2.5-mistral-7b',
  Pplx7bChatAlpha = 'perplexity/pplx-7b-chat-alpha',
  Pplx70bChatAlpha = 'perplexity/pplx-70b-chat-alpha',
}

export enum VLLMModels {
  MetaLlamaLlama27bChat = 'vllm/meta-llama/Llama-2-7b',
  TiiuaeFalcon7bInstruct = 'vllm/tiiuae/falcon-7b-instruct',
  MosaicmlMpt7bChat = 'vllm/mosaicml/mpt-7b-chat',
  CodellamaCodeLlama34bInstructHf = 'vllm/codellama/CodeLlama-34b-Instruct-hf',
  WizardLMWizardCoderPython34BV10 = 'vllm/WizardLM/WizardCoder-Python-34B-V1.0',
  PhindPhindCodeLlama34Bv2 = 'vllm/Phind/Phind-CodeLlama-34B-v2',
}

export enum XinferenceModels {
  BgeBaseEn = 'xinference/bge-base-en',
  BgeBaseEnV15 = 'xinference/bge-base-en-v1.5',
  BgeBaseZh = 'xinference/bge-base-zh',
  BgeBaseZhV15 = 'xinference/bge-base-zh-v1.5',
  BgeLargeEn = 'xinference/bge-large-en',
  BgeLargeEnV15 = 'xinference/bge-large-en-v1.5',
  BgeLargeZh = 'xinference/bge-large-zh',
  BgeLargeZhNoinstruct = 'xinference/bge-large-zh-noinstruct',
  BgeLargeZhV15 = 'xinference/bge-large-zh-v1.5',
  BgeSmallEnV15 = 'xinference/bge-small-en-v1.5',
  BgeSmallZh = 'xinference/bge-small-zh',
  BgeSmallZhV15 = 'xinference/bge-small-zh-v1.5',
  E5LargeV2 = 'xinference/e5-large-v2',
  GteBase = 'xinference/gte-base',
  GteLarge = 'xinference/gte-large',
  JinaEmbeddingsV2BaseEn = 'xinference/jina-embeddings-v2-base-en',
  JinaEmbeddingsV2SmallEn = 'xinference/jina-embeddings-v2-small-en',
  MultilingualE5Large = 'xinference/multilingual-e5-large',
}

export enum CloudflareWorkersAIModels {
  MetaLlama27bChatFp16 = '@cf/meta/llama-2-7b-chat-fp16',
  MetaLlama27bChatInt8 = '@cf/meta/llama-2-7b-chat-int8',
  Mistral7bInstructV01 = '@cf/mistral/mistral-7b-instruct-v0.1',
  TheBlokeCodellama7bInstructAwq = '@hf/thebloke/codellama-7b-instruct-awq',
}

export enum AI21Models {
  J2Light = 'j2-light',
  J2Mid = 'j2-mid',
  J2Ultra = 'j2-ultra',
}

export enum NLPCloudModels {
  Dolphin = 'dolphin',
  ChatDolphin = 'chatDolphin',
}

export enum DeepInfraChatModels {
  MetaLlamaLlama270bChatHf = 'deepinfra/meta-llama/Llama-2-70b-chat-hf',
  MetaLlamaLlama27bChatHf = 'deepinfra/meta-llama/Llama-2-7b-chat-hf',
  MetaLlamaLlama213bChatHf = 'deepinfra/meta-llama/Llama-2-13b-chat-hf',
  CodellamaCodeLlama34bInstructHf = 'deepinfra/codellama/CodeLlama-34b-Instruct-hf',
  MistralaiMistral7BInstructV01 = 'deepinfra/mistralai/Mistral-7B-Instruct-v0.1',
  JondurbinAiroborosL270bGpt4141 = 'deepinfra/jondurbin/airoboros-l2-70b-gpt4-1.4.1',
}

export enum VoyageAIModels {
  Voyage01 = 'voyage-ai/voyage-01',
  VoyageLite01 = 'voyage-ai/voyage-lite-01',
  VoyageLite01Instruct = 'voyage-ai/voyage-lite-01-instruct',
}

export enum TogetherAIModels {
  TogetherLlama270bChat = 'togethercomputer/llama-2-70b-chat',
  TogetherLlama270b = 'togethercomputer/llama-2-70b',
  TogetherLlama27B32K = 'togethercomputer/LLaMA-2-7B-32K',
  TogetherLlama27B32KInstruct = 'togethercomputer/Llama-2-7B-32K-Instruct',
  TogetherLlama27b = 'togethercomputer/llama-2-7b',
  TogetherFalcon40bInstruct = 'togethercomputer/falcon-40b-instruct',
  TogetherFalcon7bInstruct = 'togethercomputer/falcon-7b-instruct',
  TogetherAlpaca7b = 'togethercomputer/alpaca-7b',
  TogetherStarchatAlpha = 'HuggingFaceH4/starchat-alpha',
  TogetherCodeLlama34b = 'togethercomputer/CodeLlama-34b',
  TogetherCodeLlama34bInstruct = 'togethercomputer/CodeLlama-34b-Instruct',
  TogetherCodeLlama34bPython = 'togethercomputer/CodeLlama-34b-Python',
  TogetherSqlCoder = 'defog/sqlcoder',
  TogetherNSQLLlama27B = 'NumbersStation/nsql-llama-2-7B',
  TogetherWizardCoder15BV10 = 'WizardLM/WizardCoder-15B-V1.0',
  TogetherWizardCoderPython34BV10 = 'WizardLM/WizardCoder-Python-34B-V1.0',
  TogetherNousHermesLlama213b = 'NousResearch/Nous-Hermes-Llama2-13b',
  TogetherChronosHermes13b = 'Austism/chronos-hermes-13b',
  TogetherSolar070b16bit = 'upstage/SOLAR-0-70b-16bit',
  TogetherWizardLM70BV10 = 'WizardLM/WizardLM-70B-V1.0',
}

export enum AlephAlphaModels {
  LuminousBase = 'luminous-base',
  LuminousBaseControl = 'luminous-base-control',
  LuminousExtended = 'luminous-extended',
  LuminousExtendedControl = 'luminous-extended-control',
  LuminousSupreme = 'luminous-supreme',
  LuminousSupremeControl = 'luminous-supreme-control',
}

export enum BaseTenModels {
  Falcon7B = 'baseten/qvv0xeq',
  WizardLM = 'baseten/q841o8w',
  MPT7BBase = 'baseten/31dxrj3',
}

export enum PetalsModels {
  PetalsTeamStableBeluga = 'petals/petals-team/StableBeluga2',
  HuggyLlamaLlama65 = 'petals/huggyllama/llama-65b',
}

export type CompletionModels =
  | OpenAIChatCompletionModels
  | OpenAITextCompletionInstructModels
  | OpenAIVisionModels
  | HuggingFaceModelsWithPromptFormatting
  | OllamaModels
  | OllamaVisionModels
  | VertexAIGoogleModels
  | PalmModels
  | GoogleAIStudioModels
  | MistralAIModels
  | AnthropicModels
  | SageMakerModels
  | BedrockModels
  | PerplexityAIModels
  | VLLMModels
  | XinferenceModels
  | CloudflareWorkersAIModels
  | AI21Models
  | NLPCloudModels
  | DeepInfraChatModels
  | VoyageAIModels
  | TogetherAIModels
  | AlephAlphaModels
  | BaseTenModels
  | PetalsModels

export type AllModels = CompletionModels | EmbeddingModels
