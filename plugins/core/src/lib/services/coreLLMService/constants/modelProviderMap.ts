import {
  BedrockEmbeddingModels,
  CohereEmbeddingModels,
  MistralEmbeddingModels,
  VoyageEmbeddingModels,
  OpenAIEmbeddingModels,
  HuggingFaceEmbeddingModels,
} from '../../coreEmbeddingService/types'
import {
  OpenAIChatCompletionModels,
  OpenAITextCompletionInstructModels,
  OpenAIVisionModels,
  HuggingFaceModelsWithPromptFormatting,
  OllamaModels,
  OllamaVisionModels,
  VertexAIGoogleModels,
  PalmModels,
  MistralAIModels,
  AnthropicModels,
  SageMakerModels,
  BedrockModels,
  PerplexityAIModels,
  VLLMModels,
  XinferenceModels,
  CloudflareWorkersAIModels,
  AI21Models,
  NLPCloudModels,
  DeepInfraChatModels,
  TogetherAIModels,
  BaseTenModels,
  PetalsModels,
  VoyageAIModels,
  AlephAlphaModels,
  AnyscaleModels,
  OpenRouterModels,
} from '../types/completionModels'
import { AllModels } from '../types/models'
import {
  ModelProviderMapping,
  LLMProviders,
  LLMProviderKeys,
} from '../types/providerTypes'

export const modelProviderMap: Record<AllModels, ModelProviderMapping> = {
  /// OpenAI Chat Completion Models
  [OpenAIChatCompletionModels.GPT35Turbo1106Preview]: {
    provider: LLMProviders.OpenAI,
    apiKeyName: LLMProviderKeys.OpenAI,
  },
  [OpenAIChatCompletionModels.GPT35Turbo]: {
    provider: LLMProviders.OpenAI,
    apiKeyName: LLMProviderKeys.OpenAI,
  },
  [OpenAIChatCompletionModels.GPT35Turbo1106]: {
    provider: LLMProviders.OpenAI,
    apiKeyName: LLMProviderKeys.OpenAI,
  },
  [OpenAIChatCompletionModels.GPT35Turbo0301]: {
    provider: LLMProviders.OpenAI,
    apiKeyName: LLMProviderKeys.OpenAI,
  },
  [OpenAIChatCompletionModels.GPT35Turbo0613]: {
    provider: LLMProviders.OpenAI,
    apiKeyName: LLMProviderKeys.OpenAI,
  },
  [OpenAIChatCompletionModels.GPT35Turbo16k]: {
    provider: LLMProviders.OpenAI,
    apiKeyName: LLMProviderKeys.OpenAI,
  },
  [OpenAIChatCompletionModels.GPT35Turbo16k0613]: {
    provider: LLMProviders.OpenAI,
    apiKeyName: LLMProviderKeys.OpenAI,
  },
  [OpenAIChatCompletionModels.GPT4]: {
    provider: LLMProviders.OpenAI,
    apiKeyName: LLMProviderKeys.OpenAI,
  },
  [OpenAIChatCompletionModels.GPT40314]: {
    provider: LLMProviders.OpenAI,
    apiKeyName: LLMProviderKeys.OpenAI,
  },
  [OpenAIChatCompletionModels.GPT40613]: {
    provider: LLMProviders.OpenAI,
    apiKeyName: LLMProviderKeys.OpenAI,
  },

  // OpenAI Text Completion / Instruct Models
  [OpenAITextCompletionInstructModels.Ada001]: {
    provider: LLMProviders.OpenAI,
    apiKeyName: LLMProviderKeys.OpenAI,
  },
  [OpenAITextCompletionInstructModels.Babbage001]: {
    provider: LLMProviders.OpenAI,
    apiKeyName: LLMProviderKeys.OpenAI,
  },
  [OpenAITextCompletionInstructModels.Babbage002]: {
    provider: LLMProviders.OpenAI,
    apiKeyName: LLMProviderKeys.OpenAI,
  },
  [OpenAITextCompletionInstructModels.Curie001]: {
    provider: LLMProviders.OpenAI,
    apiKeyName: LLMProviderKeys.OpenAI,
  },
  [OpenAITextCompletionInstructModels.Davinci002]: {
    provider: LLMProviders.OpenAI,
    apiKeyName: LLMProviderKeys.OpenAI,
  },
  [OpenAITextCompletionInstructModels.GPT35TurboInstruct]: {
    provider: LLMProviders.OpenAI,
    apiKeyName: LLMProviderKeys.OpenAI,
  },
  [OpenAITextCompletionInstructModels.TextDavinci003]: {
    provider: LLMProviders.OpenAI,
    apiKeyName: LLMProviderKeys.OpenAI,
  },

  // OpenAI Vision Models
  [OpenAIVisionModels.GPT4VisionPreview]: {
    provider: LLMProviders.OpenAI,
    apiKeyName: LLMProviderKeys.OpenAI,
  },

  // HuggingFace Models With Prompt Formatting
  [HuggingFaceModelsWithPromptFormatting.HuggingFaceCodellamaCodeLlama34bInstructHf]:
    {
      provider: LLMProviders.HuggingFace,
      apiKeyName: LLMProviderKeys.HuggingFace,
    },
  [HuggingFaceModelsWithPromptFormatting.HuggingFaceMetaLlamaLlama27bChat]: {
    provider: LLMProviders.HuggingFace,
    apiKeyName: LLMProviderKeys.HuggingFace,
  },
  [HuggingFaceModelsWithPromptFormatting.HuggingFaceMistral7BInstructV01]: {
    provider: LLMProviders.HuggingFace,
    apiKeyName: LLMProviderKeys.HuggingFace,
  },
  [HuggingFaceModelsWithPromptFormatting.HuggingFaceMosaicmlMpt7bChat]: {
    provider: LLMProviders.HuggingFace,
    apiKeyName: LLMProviderKeys.HuggingFace,
  },
  [HuggingFaceModelsWithPromptFormatting.HuggingFacePhindPhindCodeLlama34Bv2]: {
    provider: LLMProviders.HuggingFace,
    apiKeyName: LLMProviderKeys.HuggingFace,
  },
  [HuggingFaceModelsWithPromptFormatting.HuggingFaceTiiuaeFalcon7bInstruct]: {
    provider: LLMProviders.HuggingFace,
    apiKeyName: LLMProviderKeys.HuggingFace,
  },
  [HuggingFaceModelsWithPromptFormatting.HuggingFaceWizardLMWizardCoderPython34BV10]:
    {
      provider: LLMProviders.HuggingFace,
      apiKeyName: LLMProviderKeys.HuggingFace,
    },

  // Ollama Models
  [OllamaModels.OlamaMistral]: {
    provider: LLMProviders.Ollama,
    apiKeyName: LLMProviderKeys.Ollama,
  },
  [OllamaModels.OlamaLlama27B]: {
    provider: LLMProviders.Ollama,
    apiKeyName: LLMProviderKeys.Ollama,
  },
  [OllamaModels.OlamaLlama213B]: {
    provider: LLMProviders.Ollama,
    apiKeyName: LLMProviderKeys.Ollama,
  },
  [OllamaModels.OlamaLlama270B]: {
    provider: LLMProviders.Ollama,
    apiKeyName: LLMProviderKeys.Ollama,
  },
  [OllamaModels.OlamaLlama2Uncensored]: {
    provider: LLMProviders.Ollama,
    apiKeyName: LLMProviderKeys.Ollama,
  },
  [OllamaModels.OlamaCodeLlama]: {
    provider: LLMProviders.Ollama,
    apiKeyName: LLMProviderKeys.Ollama,
  },
  [OllamaModels.OlamaNousHermes]: {
    provider: LLMProviders.Ollama,
    apiKeyName: LLMProviderKeys.Ollama,
  },
  [OllamaModels.OlamaOrcaMini]: {
    provider: LLMProviders.Ollama,
    apiKeyName: LLMProviderKeys.Ollama,
  },
  [OllamaModels.OlamaVicuna]: {
    provider: LLMProviders.Ollama,
    apiKeyName: LLMProviderKeys.Ollama,
  },
  [OllamaModels.OlamaNousHermes13B]: {
    provider: LLMProviders.Ollama,
    apiKeyName: LLMProviderKeys.Ollama,
  },
  [OllamaModels.OlamaWizardVicunaUncensored]: {
    provider: LLMProviders.Ollama,
    apiKeyName: LLMProviderKeys.Ollama,
  },

  // Ollama Vision Models
  [OllamaVisionModels.LLAVA]: {
    provider: LLMProviders.Ollama,
    apiKeyName: LLMProviderKeys.Ollama,
  },

  // VertexAI
  [VertexAIGoogleModels.GeminiPro]: {
    provider: LLMProviders.VertexAI,
    apiKeyName: LLMProviderKeys.VertexAI,
  },
  [VertexAIGoogleModels.GeminiProVision]: {
    provider: LLMProviders.VertexAI,
    apiKeyName: LLMProviderKeys.VertexAI,
  },

  //Palm
  [PalmModels.ChatBison]: {
    provider: LLMProviders.Palm,
    apiKeyName: LLMProviderKeys.Palm,
  },

  // // Google AI Studio
  // [GoogleAIStudioModels.GeminiPro]: {
  //   provider: LLMProviders.GoogleAIStudio,
  //   apiKeyName: LLMProviderKeys.GoogleAIStudio,
  // },
  // [GoogleAIStudioModels.GeminiProVision]: {
  //   provider: LLMProviders.GoogleAIStudio,
  //   apiKeyName: LLMProviderKeys.GoogleAIStudio,
  // },

  // Mistral AI Models
  [MistralAIModels.MistralTiny]: {
    provider: LLMProviders.Mistral,
    apiKeyName: LLMProviderKeys.Mistral,
  },
  [MistralAIModels.MistralSmall]: {
    provider: LLMProviders.Mistral,
    apiKeyName: LLMProviderKeys.Mistral,
  },
  [MistralAIModels.MistralMedium]: {
    provider: LLMProviders.Mistral,
    apiKeyName: LLMProviderKeys.Mistral,
  },

  // Anthropic Models
  [AnthropicModels.Claude21]: {
    provider: LLMProviders.Anthropic,
    apiKeyName: LLMProviderKeys.Anthropic,
  },
  [AnthropicModels.Claude2]: {
    provider: LLMProviders.Anthropic,
    apiKeyName: LLMProviderKeys.Anthropic,
  },
  [AnthropicModels.ClaudeInstant1]: {
    provider: LLMProviders.Anthropic,
    apiKeyName: LLMProviderKeys.Anthropic,
  },
  [AnthropicModels.ClaudeInstant12]: {
    provider: LLMProviders.Anthropic,
    apiKeyName: LLMProviderKeys.Anthropic,
  },

  // SageMaker Models
  [SageMakerModels.MetaLlama213B]: {
    provider: LLMProviders.Sagemaker,
    apiKeyName: LLMProviderKeys.Sagemaker,
  },
  [SageMakerModels.MetaLlama213BChatFineTuned]: {
    provider: LLMProviders.Sagemaker,
    apiKeyName: LLMProviderKeys.Sagemaker,
  },
  [SageMakerModels.MetaLlama270B]: {
    provider: LLMProviders.Sagemaker,
    apiKeyName: LLMProviderKeys.Sagemaker,
  },
  [SageMakerModels.MetaLlama270BChatFineTuned]: {
    provider: LLMProviders.Sagemaker,
    apiKeyName: LLMProviderKeys.Sagemaker,
  },
  [SageMakerModels.MetaLlama27B]: {
    provider: LLMProviders.Sagemaker,
    apiKeyName: LLMProviderKeys.Sagemaker,
  },
  [SageMakerModels.MetaLlama27BChatFineTuned]: {
    provider: LLMProviders.Sagemaker,
    apiKeyName: LLMProviderKeys.Sagemaker,
  },

  // Bedrock Models
  [BedrockModels.BedrockAI21J2Mid]: {
    provider: LLMProviders.Bedrock,
    apiKeyName: LLMProviderKeys.Bedrock,
  },
  [BedrockModels.BedrockAI21J2Ultra]: {
    provider: LLMProviders.Bedrock,
    apiKeyName: LLMProviderKeys.Bedrock,
  },
  [BedrockModels.BedrockAmazonTitanExpress]: {
    provider: LLMProviders.Bedrock,
    apiKeyName: LLMProviderKeys.Bedrock,
  },
  [BedrockModels.BedrockAnthropicClaudeInstantV1]: {
    provider: LLMProviders.Bedrock,
    apiKeyName: LLMProviderKeys.Bedrock,
  },
  [BedrockModels.BedrockAnthropicClaudeV1]: {
    provider: LLMProviders.Bedrock,
    apiKeyName: LLMProviderKeys.Bedrock,
  },
  [BedrockModels.BedrockAnthropicClaudeV2]: {
    provider: LLMProviders.Bedrock,
    apiKeyName: LLMProviderKeys.Bedrock,
  },
  [BedrockModels.BedrockAnthropicClaudeV21]: {
    provider: LLMProviders.Bedrock,
    apiKeyName: LLMProviderKeys.Bedrock,
  },
  [BedrockModels.BedrockCohereCommand]: {
    provider: LLMProviders.Bedrock,
    apiKeyName: LLMProviderKeys.Bedrock,
  },
  [BedrockModels.BedrockMetaLlama2Chat13b]: {
    provider: LLMProviders.Bedrock,
    apiKeyName: LLMProviderKeys.Bedrock,
  },
  [BedrockModels.BedrockMetaLlama2Chat70b]: {
    provider: LLMProviders.Bedrock,
    apiKeyName: LLMProviderKeys.Bedrock,
  },
  [BedrockModels.BedrockAmazonTitanLite]: {
    provider: LLMProviders.Bedrock,
    apiKeyName: LLMProviderKeys.Bedrock,
  },

  // Perplexity AI Models
  [PerplexityAIModels.Pplx70bChat]: {
    provider: LLMProviders.PerplexityAI,
    apiKeyName: LLMProviderKeys.PerplexityAI,
  },
  [PerplexityAIModels.Pplx70bChatAlpha]: {
    provider: LLMProviders.PerplexityAI,
    apiKeyName: LLMProviderKeys.PerplexityAI,
  },
  [PerplexityAIModels.Pplx70bOnline]: {
    provider: LLMProviders.PerplexityAI,
    apiKeyName: LLMProviderKeys.PerplexityAI,
  },
  [PerplexityAIModels.Pplx7bOnline]: {
    provider: LLMProviders.PerplexityAI,
    apiKeyName: LLMProviderKeys.PerplexityAI,
  },
  [PerplexityAIModels.PplxCodeLlama34bInstruct]: {
    provider: LLMProviders.PerplexityAI,
    apiKeyName: LLMProviderKeys.PerplexityAI,
  },
  [PerplexityAIModels.PplxLlama213bChat]: {
    provider: LLMProviders.PerplexityAI,
    apiKeyName: LLMProviderKeys.PerplexityAI,
  },
  [PerplexityAIModels.PplxLlama270bChat]: {
    provider: LLMProviders.PerplexityAI,
    apiKeyName: LLMProviderKeys.PerplexityAI,
  },
  [PerplexityAIModels.PplxMistral7bInstruct]: {
    provider: LLMProviders.PerplexityAI,
    apiKeyName: LLMProviderKeys.PerplexityAI,
  },
  [PerplexityAIModels.PplxOpenhermes25Mistral7b]: {
    provider: LLMProviders.PerplexityAI,
    apiKeyName: LLMProviderKeys.PerplexityAI,
  },
  [PerplexityAIModels.PplxOpenhermes2Mistral7b]: {
    provider: LLMProviders.PerplexityAI,
    apiKeyName: LLMProviderKeys.PerplexityAI,
  },
  [PerplexityAIModels.Pplx7bChat]: {
    provider: LLMProviders.PerplexityAI,
    apiKeyName: LLMProviderKeys.PerplexityAI,
  },
  [PerplexityAIModels.Pplx7bChatAlpha]: {
    provider: LLMProviders.PerplexityAI,
    apiKeyName: LLMProviderKeys.PerplexityAI,
  },

  // VLLM Models
  [VLLMModels.CodellamaCodeLlama34bInstructHf]: {
    provider: LLMProviders.VLLM,
    apiKeyName: LLMProviderKeys.VLLM,
  },
  [VLLMModels.MetaLlamaLlama27bChat]: {
    provider: LLMProviders.VLLM,
    apiKeyName: LLMProviderKeys.VLLM,
  },
  [VLLMModels.MosaicmlMpt7bChat]: {
    provider: LLMProviders.VLLM,
    apiKeyName: LLMProviderKeys.VLLM,
  },
  [VLLMModels.PhindPhindCodeLlama34Bv2]: {
    provider: LLMProviders.VLLM,
    apiKeyName: LLMProviderKeys.VLLM,
  },
  [VLLMModels.TiiuaeFalcon7bInstruct]: {
    provider: LLMProviders.VLLM,
    apiKeyName: LLMProviderKeys.VLLM,
  },
  [VLLMModels.WizardLMWizardCoderPython34BV10]: {
    provider: LLMProviders.VLLM,
    apiKeyName: LLMProviderKeys.VLLM,
  },

  //Xinference Models
  [XinferenceModels.BgeBaseEn]: {
    provider: LLMProviders.Xinference,
    apiKeyName: LLMProviderKeys.Xinference,
  },
  [XinferenceModels.BgeBaseEnV15]: {
    provider: LLMProviders.Xinference,
    apiKeyName: LLMProviderKeys.Xinference,
  },
  [XinferenceModels.BgeBaseZh]: {
    provider: LLMProviders.Xinference,
    apiKeyName: LLMProviderKeys.Xinference,
  },
  [XinferenceModels.BgeLargeEn]: {
    provider: LLMProviders.Xinference,
    apiKeyName: LLMProviderKeys.Xinference,
  },
  [XinferenceModels.BgeLargeEnV15]: {
    provider: LLMProviders.Xinference,
    apiKeyName: LLMProviderKeys.Xinference,
  },
  [XinferenceModels.BgeLargeZh]: {
    provider: LLMProviders.Xinference,
    apiKeyName: LLMProviderKeys.Xinference,
  },
  [XinferenceModels.BgeLargeZhNoinstruct]: {
    provider: LLMProviders.Xinference,
    apiKeyName: LLMProviderKeys.Xinference,
  },
  [XinferenceModels.BgeLargeZhV15]: {
    provider: LLMProviders.Xinference,
    apiKeyName: LLMProviderKeys.Xinference,
  },
  [XinferenceModels.BgeSmallEnV15]: {
    provider: LLMProviders.Xinference,
    apiKeyName: LLMProviderKeys.Xinference,
  },
  [XinferenceModels.BgeSmallZh]: {
    provider: LLMProviders.Xinference,
    apiKeyName: LLMProviderKeys.Xinference,
  },
  [XinferenceModels.BgeSmallZhV15]: {
    provider: LLMProviders.Xinference,
    apiKeyName: LLMProviderKeys.Xinference,
  },
  [XinferenceModels.E5LargeV2]: {
    provider: LLMProviders.Xinference,
    apiKeyName: LLMProviderKeys.Xinference,
  },
  [XinferenceModels.GteBase]: {
    provider: LLMProviders.Xinference,
    apiKeyName: LLMProviderKeys.Xinference,
  },
  [XinferenceModels.GteLarge]: {
    provider: LLMProviders.Xinference,
    apiKeyName: LLMProviderKeys.Xinference,
  },
  [XinferenceModels.JinaEmbeddingsV2BaseEn]: {
    provider: LLMProviders.Xinference,
    apiKeyName: LLMProviderKeys.Xinference,
  },
  [XinferenceModels.JinaEmbeddingsV2SmallEn]: {
    provider: LLMProviders.Xinference,
    apiKeyName: LLMProviderKeys.Xinference,
  },
  [XinferenceModels.MultilingualE5Large]: {
    provider: LLMProviders.Xinference,
    apiKeyName: LLMProviderKeys.Xinference,
  },
  [XinferenceModels.BgeBaseZhV15]: {
    provider: LLMProviders.Xinference,
    apiKeyName: LLMProviderKeys.Xinference,
  },

  // Cloudflare Workers AI Models
  [CloudflareWorkersAIModels.MetaLlama27bChatFp16]: {
    provider: LLMProviders.CloudflareWorkersAI,
    apiKeyName: LLMProviderKeys.CloudflareWorkersAI,
  },
  [CloudflareWorkersAIModels.MetaLlama27bChatInt8]: {
    provider: LLMProviders.CloudflareWorkersAI,
    apiKeyName: LLMProviderKeys.CloudflareWorkersAI,
  },
  [CloudflareWorkersAIModels.Mistral7bInstructV01]: {
    provider: LLMProviders.CloudflareWorkersAI,
    apiKeyName: LLMProviderKeys.CloudflareWorkersAI,
  },
  [CloudflareWorkersAIModels.TheBlokeCodellama7bInstructAwq]: {
    provider: LLMProviders.CloudflareWorkersAI,
    apiKeyName: LLMProviderKeys.CloudflareWorkersAI,
  },

  // AI21 Models
  [AI21Models.J2Light]: {
    provider: LLMProviders.AI21,
    apiKeyName: LLMProviderKeys.AI21,
  },
  [AI21Models.J2Mid]: {
    provider: LLMProviders.AI21,
    apiKeyName: LLMProviderKeys.AI21,
  },
  [AI21Models.J2Ultra]: {
    provider: LLMProviders.AI21,
    apiKeyName: LLMProviderKeys.AI21,
  },

  //NLPCloud Models
  [NLPCloudModels.ChatDolphin]: {
    provider: LLMProviders.NLPCloud,
    apiKeyName: LLMProviderKeys.NLPCloud,
  },
  [NLPCloudModels.Dolphin]: {
    provider: LLMProviders.NLPCloud,
    apiKeyName: LLMProviderKeys.NLPCloud,
  },

  // Deep Infra Models
  [DeepInfraChatModels.CodellamaCodeLlama34bInstructHf]: {
    provider: LLMProviders.DeepInfra,
    apiKeyName: LLMProviderKeys.DeepInfra,
  },
  [DeepInfraChatModels.JondurbinAiroborosL270bGpt4141]: {
    provider: LLMProviders.DeepInfra,
    apiKeyName: LLMProviderKeys.DeepInfra,
  },
  [DeepInfraChatModels.MetaLlamaLlama213bChatHf]: {
    provider: LLMProviders.DeepInfra,
    apiKeyName: LLMProviderKeys.DeepInfra,
  },
  [DeepInfraChatModels.MetaLlamaLlama270bChatHf]: {
    provider: LLMProviders.DeepInfra,
    apiKeyName: LLMProviderKeys.DeepInfra,
  },
  [DeepInfraChatModels.MetaLlamaLlama27bChatHf]: {
    provider: LLMProviders.DeepInfra,
    apiKeyName: LLMProviderKeys.DeepInfra,
  },
  [DeepInfraChatModels.MistralaiMistral7BInstructV01]: {
    provider: LLMProviders.DeepInfra,
    apiKeyName: LLMProviderKeys.DeepInfra,
  },

  // Together AI Models
  [TogetherAIModels.TogetherLlama270bChat]: {
    provider: LLMProviders.TogetherAI,
    apiKeyName: LLMProviderKeys.TogetherAI,
  },
  [TogetherAIModels.TogetherLlama270b]: {
    provider: LLMProviders.TogetherAI,
    apiKeyName: LLMProviderKeys.TogetherAI,
  },
  [TogetherAIModels.TogetherLlama27B32K]: {
    provider: LLMProviders.TogetherAI,
    apiKeyName: LLMProviderKeys.TogetherAI,
  },
  [TogetherAIModels.TogetherLlama27B32KInstruct]: {
    provider: LLMProviders.TogetherAI,
    apiKeyName: LLMProviderKeys.TogetherAI,
  },
  [TogetherAIModels.TogetherLlama27b]: {
    provider: LLMProviders.TogetherAI,
    apiKeyName: LLMProviderKeys.TogetherAI,
  },
  [TogetherAIModels.TogetherFalcon40bInstruct]: {
    provider: LLMProviders.TogetherAI,
    apiKeyName: LLMProviderKeys.TogetherAI,
  },
  [TogetherAIModels.TogetherFalcon7bInstruct]: {
    provider: LLMProviders.TogetherAI,
    apiKeyName: LLMProviderKeys.TogetherAI,
  },
  [TogetherAIModels.TogetherAlpaca7b]: {
    provider: LLMProviders.TogetherAI,
    apiKeyName: LLMProviderKeys.TogetherAI,
  },
  [TogetherAIModels.TogetherStarchatAlpha]: {
    provider: LLMProviders.TogetherAI,
    apiKeyName: LLMProviderKeys.TogetherAI,
  },
  [TogetherAIModels.TogetherCodeLlama34b]: {
    provider: LLMProviders.TogetherAI,
    apiKeyName: LLMProviderKeys.TogetherAI,
  },
  [TogetherAIModels.TogetherCodeLlama34bInstruct]: {
    provider: LLMProviders.TogetherAI,
    apiKeyName: LLMProviderKeys.TogetherAI,
  },
  [TogetherAIModels.TogetherCodeLlama34bPython]: {
    provider: LLMProviders.TogetherAI,
    apiKeyName: LLMProviderKeys.TogetherAI,
  },
  [TogetherAIModels.TogetherSqlCoder]: {
    provider: LLMProviders.TogetherAI,
    apiKeyName: LLMProviderKeys.TogetherAI,
  },
  [TogetherAIModels.TogetherNSQLLlama27B]: {
    provider: LLMProviders.TogetherAI,
    apiKeyName: LLMProviderKeys.TogetherAI,
  },
  [TogetherAIModels.TogetherWizardCoder15BV10]: {
    provider: LLMProviders.TogetherAI,
    apiKeyName: LLMProviderKeys.TogetherAI,
  },
  [TogetherAIModels.TogetherNousHermesLlama213b]: {
    provider: LLMProviders.TogetherAI,
    apiKeyName: LLMProviderKeys.TogetherAI,
  },
  [TogetherAIModels.TogetherChronosHermes13b]: {
    provider: LLMProviders.TogetherAI,
    apiKeyName: LLMProviderKeys.TogetherAI,
  },
  [TogetherAIModels.TogetherSolar070b16bit]: {
    provider: LLMProviders.TogetherAI,
    apiKeyName: LLMProviderKeys.TogetherAI,
  },
  [TogetherAIModels.TogetherWizardLM70BV10]: {
    provider: LLMProviders.TogetherAI,
    apiKeyName: LLMProviderKeys.TogetherAI,
  },

  // Base Ten Models
  [BaseTenModels.Falcon7B]: {
    provider: LLMProviders.Baseten,
    apiKeyName: LLMProviderKeys.Baseten,
  },
  [BaseTenModels.MPT7BBase]: {
    provider: LLMProviders.Baseten,
    apiKeyName: LLMProviderKeys.Baseten,
  },
  [BaseTenModels.WizardLM]: {
    provider: LLMProviders.Baseten,
    apiKeyName: LLMProviderKeys.Baseten,
  },

  // Petals Models
  [PetalsModels.HuggyLlamaLlama65]: {
    provider: LLMProviders.Petals,
    apiKeyName: LLMProviderKeys.Petals,
  },
  [PetalsModels.PetalsTeamStableBeluga]: {
    provider: LLMProviders.Petals,
    apiKeyName: LLMProviderKeys.Petals,
  },

  // Voyage AI Models
  [VoyageAIModels.Voyage01]: {
    provider: LLMProviders.VoyageAI,
    apiKeyName: LLMProviderKeys.VoyageAI,
  },
  [VoyageAIModels.VoyageLite01]: {
    provider: LLMProviders.VoyageAI,
    apiKeyName: LLMProviderKeys.VoyageAI,
  },
  [VoyageAIModels.VoyageLite01Instruct]: {
    provider: LLMProviders.VoyageAI,
    apiKeyName: LLMProviderKeys.VoyageAI,
  },

  // Aleph Alpha Models
  [AlephAlphaModels.LuminousBase]: {
    provider: LLMProviders.AlephAlpha,
    apiKeyName: LLMProviderKeys.AlephAlpha,
  },
  [AlephAlphaModels.LuminousBaseControl]: {
    provider: LLMProviders.AlephAlpha,
    apiKeyName: LLMProviderKeys.AlephAlpha,
  },
  [AlephAlphaModels.LuminousExtended]: {
    provider: LLMProviders.AlephAlpha,
    apiKeyName: LLMProviderKeys.AlephAlpha,
  },
  [AlephAlphaModels.LuminousExtendedControl]: {
    provider: LLMProviders.AlephAlpha,
    apiKeyName: LLMProviderKeys.AlephAlpha,
  },
  [AlephAlphaModels.LuminousSupreme]: {
    provider: LLMProviders.AlephAlpha,
    apiKeyName: LLMProviderKeys.AlephAlpha,
  },
  [AlephAlphaModels.LuminousSupremeControl]: {
    provider: LLMProviders.AlephAlpha,
    apiKeyName: LLMProviderKeys.AlephAlpha,
  },

  // Embedding Models
  [BedrockEmbeddingModels.AmazonTitanEmbedTextV1]: {
    provider: LLMProviders.Bedrock,
    apiKeyName: LLMProviderKeys.Bedrock,
  },
  [BedrockEmbeddingModels.CohereEmbedEnglishV3]: {
    provider: LLMProviders.Bedrock,
    apiKeyName: LLMProviderKeys.Bedrock,
  },
  [BedrockEmbeddingModels.CohereEmbedMultilingualV3]: {
    provider: LLMProviders.Bedrock,
    apiKeyName: LLMProviderKeys.Bedrock,
  },

  [CohereEmbeddingModels.EmbedEnglishLightV20]: {
    provider: LLMProviders.Cohere,
    apiKeyName: LLMProviderKeys.Cohere,
  },
  [CohereEmbeddingModels.EmbedEnglishLightV30]: {
    provider: LLMProviders.Cohere,
    apiKeyName: LLMProviderKeys.Cohere,
  },
  [CohereEmbeddingModels.EmbedEnglishV20]: {
    provider: LLMProviders.Cohere,
    apiKeyName: LLMProviderKeys.Cohere,
  },
  [CohereEmbeddingModels.EmbedEnglishV30]: {
    provider: LLMProviders.Cohere,
    apiKeyName: LLMProviderKeys.Cohere,
  },
  [CohereEmbeddingModels.EmbedMultilingualLightV30]: {
    provider: LLMProviders.Cohere,
    apiKeyName: LLMProviderKeys.Cohere,
  },
  [CohereEmbeddingModels.EmbedMultilingualV20]: {
    provider: LLMProviders.Cohere,
    apiKeyName: LLMProviderKeys.Cohere,
  },
  [CohereEmbeddingModels.EmbedMultilingualV30]: {
    provider: LLMProviders.Cohere,
    apiKeyName: LLMProviderKeys.Cohere,
  },

  [MistralEmbeddingModels.MistralEmbed]: {
    provider: LLMProviders.Mistral,
    apiKeyName: LLMProviderKeys.Mistral,
  },

  [VoyageEmbeddingModels.Voyage02]: {
    provider: LLMProviders.VoyageAI,
    apiKeyName: LLMProviderKeys.VoyageAI,
  },
  [VoyageEmbeddingModels.VoyageCode02]: {
    provider: LLMProviders.VoyageAI,
    apiKeyName: LLMProviderKeys.VoyageAI,
  },
  [OpenAIEmbeddingModels.TextEmbeddingAda002]: {
    provider: LLMProviders.OpenAI,
    apiKeyName: LLMProviderKeys.OpenAI,
  },
  [HuggingFaceEmbeddingModels.HuggingFaceAnyHfEmbeddingModel]: {
    provider: LLMProviders.HuggingFace,
    apiKeyName: LLMProviderKeys.HuggingFace,
  },
  [HuggingFaceEmbeddingModels.HuggingFaceBAAIBgeLargeZh]: {
    provider: LLMProviders.HuggingFace,
    apiKeyName: LLMProviderKeys.HuggingFace,
  },
  [HuggingFaceEmbeddingModels.HuggingFaceMicrosoftCodebertBase]: {
    provider: LLMProviders.HuggingFace,
    apiKeyName: LLMProviderKeys.HuggingFace,
  },
  [AnyscaleModels.AnyscaleCodellamaCodeLlama34bInstructHf]: {
    provider: LLMProviders.Anyscale,
    apiKeyName: LLMProviderKeys.Anyscale,
  },

  [AnyscaleModels.AnyscaleMetaLlamaLlama213bChatHf]: {
    provider: LLMProviders.Anyscale,
    apiKeyName: LLMProviderKeys.Anyscale,
  },
  [AnyscaleModels.AnyscaleMetaLlamaLlama270bChatHf]: {
    provider: LLMProviders.Anyscale,
    apiKeyName: LLMProviderKeys.Anyscale,
  },
  [AnyscaleModels.AnyscaleMetaLlamaLlama27bChatHf]: {
    provider: LLMProviders.Anyscale,
    apiKeyName: LLMProviderKeys.Anyscale,
  },
  [AnyscaleModels.AnyscaleZephyr7BBeta]: {
    provider: LLMProviders.Anyscale,
    apiKeyName: LLMProviderKeys.Anyscale,
  },
  [AnyscaleModels.AnyscaleMistral7BInstructV01]: {
    provider: LLMProviders.Anyscale,
    apiKeyName: LLMProviderKeys.Anyscale,
  },
  [OpenRouterModels.OpenRouterAnthropicClaud2]: {
    provider: LLMProviders.OpenRouter,
    apiKeyName: LLMProviderKeys.OpenRouter,
  },
  [OpenRouterModels.OpenRouterAnthropicClaudInstantV1]: {
    provider: LLMProviders.OpenRouter,
    apiKeyName: LLMProviderKeys.OpenRouter,
  },
  [OpenRouterModels.OpenRouterMetaLlamaLlama213bChat]: {
    provider: LLMProviders.OpenRouter,
    apiKeyName: LLMProviderKeys.OpenRouter,
  },
  [OpenRouterModels.OpenRouterMetaLlamaLlama270bChat]: {
    provider: LLMProviders.OpenRouter,
    apiKeyName: LLMProviderKeys.OpenRouter,
  },
  [OpenRouterModels.OpenRouterOpenAIGpt35turbo]: {
    provider: LLMProviders.OpenRouter,
    apiKeyName: LLMProviderKeys.OpenRouter,
  },
  [OpenRouterModels.OpenRouterOpenAIGpt35turbo16k]: {
    provider: LLMProviders.OpenRouter,
    apiKeyName: LLMProviderKeys.OpenRouter,
  },
  [OpenRouterModels.OpenRouterOpenAIGpt4]: {
    provider: LLMProviders.OpenRouter,
    apiKeyName: LLMProviderKeys.OpenRouter,
  },
  [OpenRouterModels.OpenRouterOpenAIGpt432k]: {
    provider: LLMProviders.OpenRouter,
    apiKeyName: LLMProviderKeys.OpenRouter,
  },
  [OpenRouterModels.OpenRouterPalm2ChatBison]: {
    provider: LLMProviders.OpenRouter,
    apiKeyName: LLMProviderKeys.OpenRouter,
  },
  [OpenRouterModels.OpenRouterPalm2CodeChatBison]: {
    provider: LLMProviders.OpenRouter,
    apiKeyName: LLMProviderKeys.OpenRouter,
  },
}
