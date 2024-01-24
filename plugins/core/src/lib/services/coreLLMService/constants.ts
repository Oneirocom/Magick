import { allEmbeddingModels } from '../coreEmbeddingService/constants'
import { EmbeddingModels } from '../coreEmbeddingService/types'
import {
  AI21Models,
  AlephAlphaModels,
  AnthropicModels,
  BaseTenModels,
  BedrockModels,
  CloudflareWorkersAIModels,
  DeepInfraChatModels,
  GoogleAIStudioModels,
  HuggingFaceModelsWithPromptFormatting,
  LLMModels,
  LLMProviderKeys,
  MistralAIModels,
  NLPCloudModels,
  OllamaModels,
  OllamaVisionModels,
  OpenAIChatCompletionModels,
  OpenAITextCompletionInstructModels,
  OpenAIVisionModels,
  PalmModels,
  PerplexityAIModels,
  PetalsModels,
  SageMakerModels,
  TogetherAIModels,
  VLLMModels,
  VertexAIGoogleModels,
  VoyageAIModels,
  XinferenceModels,
} from './types'

export const modelProviderMap: Record<LLMModels, LLMProviderKeys> = {
  /// OpenAI Chat Completion Models
  [OpenAIChatCompletionModels.GPT35Turbo1106Preview]: LLMProviderKeys.OpenAI,
  [OpenAIChatCompletionModels.GPT35Turbo]: LLMProviderKeys.OpenAI,
  [OpenAIChatCompletionModels.GPT35Turbo1106]: LLMProviderKeys.OpenAI,
  [OpenAIChatCompletionModels.GPT35Turbo0301]: LLMProviderKeys.OpenAI,
  [OpenAIChatCompletionModels.GPT35Turbo0613]: LLMProviderKeys.OpenAI,
  [OpenAIChatCompletionModels.GPT35Turbo16k]: LLMProviderKeys.OpenAI,
  [OpenAIChatCompletionModels.GPT35Turbo16k0613]: LLMProviderKeys.OpenAI,
  [OpenAIChatCompletionModels.GPT4]: LLMProviderKeys.OpenAI,
  [OpenAIChatCompletionModels.GPT40314]: LLMProviderKeys.OpenAI,
  [OpenAIChatCompletionModels.GPT40613]: LLMProviderKeys.OpenAI,

  // OpenAI Text Completion / Instruct Models
  [OpenAITextCompletionInstructModels.Ada001]: LLMProviderKeys.OpenAI,
  [OpenAITextCompletionInstructModels.Babbage001]: LLMProviderKeys.OpenAI,
  [OpenAITextCompletionInstructModels.Babbage002]: LLMProviderKeys.OpenAI,
  [OpenAITextCompletionInstructModels.Curie001]: LLMProviderKeys.OpenAI,
  [OpenAITextCompletionInstructModels.Davinci002]: LLMProviderKeys.OpenAI,
  [OpenAITextCompletionInstructModels.GPT35TurboInstruct]:
    LLMProviderKeys.OpenAI,
  [OpenAITextCompletionInstructModels.TextDavinci003]: LLMProviderKeys.OpenAI,

  // OpenAI Vision Models
  [OpenAIVisionModels.GPT4VisionPreview]: LLMProviderKeys.OpenAI,

  // HuggingFace Models With Prompt Formatting
  [HuggingFaceModelsWithPromptFormatting.HuggingFaceCodellamaCodeLlama34bInstructHf]:
    LLMProviderKeys.HuggingFace,
  [HuggingFaceModelsWithPromptFormatting.HuggingFaceMetaLlamaLlama27bChat]:
    LLMProviderKeys.HuggingFace,
  [HuggingFaceModelsWithPromptFormatting.HuggingFaceMistral7BInstructV01]:
    LLMProviderKeys.HuggingFace,
  [HuggingFaceModelsWithPromptFormatting.HuggingFaceMosaicmlMpt7bChat]:
    LLMProviderKeys.HuggingFace,
  [HuggingFaceModelsWithPromptFormatting.HuggingFacePhindPhindCodeLlama34Bv2]:
    LLMProviderKeys.HuggingFace,
  [HuggingFaceModelsWithPromptFormatting.HuggingFaceTiiuaeFalcon7bInstruct]:
    LLMProviderKeys.HuggingFace,
  [HuggingFaceModelsWithPromptFormatting.HuggingFaceWizardLMWizardCoderPython34BV10]:
    LLMProviderKeys.HuggingFace,

  // Ollama Models
  [OllamaModels.OlamaMistral]: LLMProviderKeys.Ollama,
  [OllamaModels.OlamaLlama27B]: LLMProviderKeys.Ollama,
  [OllamaModels.OlamaLlama213B]: LLMProviderKeys.Ollama,
  [OllamaModels.OlamaLlama270B]: LLMProviderKeys.Ollama,
  [OllamaModels.OlamaLlama2Uncensored]: LLMProviderKeys.Ollama,
  [OllamaModels.OlamaCodeLlama]: LLMProviderKeys.Ollama,
  [OllamaModels.OlamaNousHermes]: LLMProviderKeys.Ollama,
  [OllamaModels.OlamaOrcaMini]: LLMProviderKeys.Ollama,
  [OllamaModels.OlamaVicuna]: LLMProviderKeys.Ollama,
  [OllamaModels.OlamaNousHermes13B]: LLMProviderKeys.Ollama,
  [OllamaModels.OlamaWizardVicunaUncensored]: LLMProviderKeys.Ollama,

  // Ollama Vision Models
  [OllamaVisionModels.LLAVA]: LLMProviderKeys.Ollama,

  // VertexAI
  [VertexAIGoogleModels.GeminiPro]: LLMProviderKeys.VertexAI,
  [VertexAIGoogleModels.GeminiProVision]: LLMProviderKeys.VertexAI,

  //Palm
  [PalmModels.ChatBison]: LLMProviderKeys.Palm,

  // Google AI Studio
  [GoogleAIStudioModels.GeminiGeminiPro]: LLMProviderKeys.GoogleAIStudio,
  [GoogleAIStudioModels.GeminiGeminiProVision]: LLMProviderKeys.GoogleAIStudio,

  // Mistral AI Models
  [MistralAIModels.MistralTiny]: LLMProviderKeys.Mistral,
  [MistralAIModels.MistralSmall]: LLMProviderKeys.Mistral,
  [MistralAIModels.MistralMedium]: LLMProviderKeys.Mistral,

  // Anthropic Models
  [AnthropicModels.Claude21]: LLMProviderKeys.Anthropic,
  [AnthropicModels.Claude2]: LLMProviderKeys.Anthropic,
  [AnthropicModels.ClaudeInstant1]: LLMProviderKeys.Anthropic,
  [AnthropicModels.ClaudeInstant12]: LLMProviderKeys.Anthropic,

  // SageMaker Models
  [SageMakerModels.MetaLlama213B]: LLMProviderKeys.Sagemaker,
  [SageMakerModels.MetaLlama213BChatFineTuned]: LLMProviderKeys.Sagemaker,
  [SageMakerModels.MetaLlama270B]: LLMProviderKeys.Sagemaker,
  [SageMakerModels.MetaLlama270BChatFineTuned]: LLMProviderKeys.Sagemaker,
  [SageMakerModels.MetaLlama27B]: LLMProviderKeys.Sagemaker,
  [SageMakerModels.MetaLlama27BChatFineTuned]: LLMProviderKeys.Sagemaker,

  // Bedrock Models
  [BedrockModels.BedrockAI21J2Mid]: LLMProviderKeys.Bedrock,
  [BedrockModels.BedrockAI21J2Ultra]: LLMProviderKeys.Bedrock,
  [BedrockModels.BedrockAmazonTitanExpress]: LLMProviderKeys.Bedrock,
  [BedrockModels.BedrockAnthropicClaudeInstantV1]: LLMProviderKeys.Bedrock,
  [BedrockModels.BedrockAnthropicClaudeV1]: LLMProviderKeys.Bedrock,
  [BedrockModels.BedrockAnthropicClaudeV2]: LLMProviderKeys.Bedrock,
  [BedrockModels.BedrockAnthropicClaudeV21]: LLMProviderKeys.Bedrock,
  [BedrockModels.BedrockCohereCommand]: LLMProviderKeys.Bedrock,
  [BedrockModels.BedrockMetaLlama2Chat13b]: LLMProviderKeys.Bedrock,
  [BedrockModels.BedrockMetaLlama2Chat70b]: LLMProviderKeys.Bedrock,
  [BedrockModels.BedrockAmazonTitanLite]: LLMProviderKeys.Bedrock,

  // Perplexity AI Models
  [PerplexityAIModels.Pplx70bChat]: LLMProviderKeys.PerplexityAI,
  [PerplexityAIModels.Pplx70bChatAlpha]: LLMProviderKeys.PerplexityAI,
  [PerplexityAIModels.Pplx70bOnline]: LLMProviderKeys.PerplexityAI,
  [PerplexityAIModels.Pplx7bOnline]: LLMProviderKeys.PerplexityAI,
  [PerplexityAIModels.PplxCodeLlama34bInstruct]: LLMProviderKeys.PerplexityAI,
  [PerplexityAIModels.PplxLlama213bChat]: LLMProviderKeys.PerplexityAI,
  [PerplexityAIModels.PplxLlama270bChat]: LLMProviderKeys.PerplexityAI,
  [PerplexityAIModels.PplxMistral7bInstruct]: LLMProviderKeys.PerplexityAI,
  [PerplexityAIModels.PplxOpenhermes25Mistral7b]: LLMProviderKeys.PerplexityAI,
  [PerplexityAIModels.PplxOpenhermes2Mistral7b]: LLMProviderKeys.PerplexityAI,
  [PerplexityAIModels.Pplx7bChat]: LLMProviderKeys.PerplexityAI,
  [PerplexityAIModels.Pplx7bChatAlpha]: LLMProviderKeys.PerplexityAI,

  // VLLM Models
  [VLLMModels.CodellamaCodeLlama34bInstructHf]: LLMProviderKeys.VLLM,
  [VLLMModels.MetaLlamaLlama27bChat]: LLMProviderKeys.VLLM,
  [VLLMModels.MosaicmlMpt7bChat]: LLMProviderKeys.VLLM,
  [VLLMModels.PhindPhindCodeLlama34Bv2]: LLMProviderKeys.VLLM,
  [VLLMModels.TiiuaeFalcon7bInstruct]: LLMProviderKeys.VLLM,
  [VLLMModels.WizardLMWizardCoderPython34BV10]: LLMProviderKeys.VLLM,

  //Xinference Models
  [XinferenceModels.BgeBaseEn]: LLMProviderKeys.Xinference,
  [XinferenceModels.BgeBaseEnV15]: LLMProviderKeys.Xinference,
  [XinferenceModels.BgeBaseZh]: LLMProviderKeys.Xinference,
  [XinferenceModels.BgeLargeEn]: LLMProviderKeys.Xinference,
  [XinferenceModels.BgeLargeEnV15]: LLMProviderKeys.Xinference,
  [XinferenceModels.BgeLargeZh]: LLMProviderKeys.Xinference,
  [XinferenceModels.BgeLargeZhNoinstruct]: LLMProviderKeys.Xinference,
  [XinferenceModels.BgeLargeZhV15]: LLMProviderKeys.Xinference,
  [XinferenceModels.BgeSmallEnV15]: LLMProviderKeys.Xinference,
  [XinferenceModels.BgeSmallZh]: LLMProviderKeys.Xinference,
  [XinferenceModels.BgeSmallZhV15]: LLMProviderKeys.Xinference,
  [XinferenceModels.E5LargeV2]: LLMProviderKeys.Xinference,
  [XinferenceModels.GteBase]: LLMProviderKeys.Xinference,
  [XinferenceModels.GteLarge]: LLMProviderKeys.Xinference,
  [XinferenceModels.JinaEmbeddingsV2BaseEn]: LLMProviderKeys.Xinference,
  [XinferenceModels.JinaEmbeddingsV2SmallEn]: LLMProviderKeys.Xinference,
  [XinferenceModels.MultilingualE5Large]: LLMProviderKeys.Xinference,
  [XinferenceModels.BgeBaseZhV15]: LLMProviderKeys.Xinference,

  // Cloudflare Workers AI Models
  [CloudflareWorkersAIModels.MetaLlama27bChatFp16]:
    LLMProviderKeys.CloudflareWorkersAI,
  [CloudflareWorkersAIModels.MetaLlama27bChatInt8]:
    LLMProviderKeys.CloudflareWorkersAI,
  [CloudflareWorkersAIModels.Mistral7bInstructV01]:
    LLMProviderKeys.CloudflareWorkersAI,
  [CloudflareWorkersAIModels.TheBlokeCodellama7bInstructAwq]:
    LLMProviderKeys.CloudflareWorkersAI,

  // AI21 Models
  [AI21Models.J2Light]: LLMProviderKeys.AI21,
  [AI21Models.J2Mid]: LLMProviderKeys.AI21,
  [AI21Models.J2Ultra]: LLMProviderKeys.AI21,

  //NLPCloud Models
  [NLPCloudModels.ChatDolphin]: LLMProviderKeys.NLPCloud,
  [NLPCloudModels.Dolphin]: LLMProviderKeys.NLPCloud,

  // Deep Infra Models
  [DeepInfraChatModels.CodellamaCodeLlama34bInstructHf]:
    LLMProviderKeys.DeepInfra,
  [DeepInfraChatModels.JondurbinAiroborosL270bGpt4141]:
    LLMProviderKeys.DeepInfra,
  [DeepInfraChatModels.MetaLlamaLlama213bChatHf]: LLMProviderKeys.DeepInfra,
  [DeepInfraChatModels.MetaLlamaLlama270bChatHf]: LLMProviderKeys.DeepInfra,
  [DeepInfraChatModels.MetaLlamaLlama27bChatHf]: LLMProviderKeys.DeepInfra,
  [DeepInfraChatModels.MistralaiMistral7BInstructV01]:
    LLMProviderKeys.DeepInfra,

  // Together AI Models
  [TogetherAIModels.TogetherLlama270bChat]: LLMProviderKeys.TogetherAI,
  [TogetherAIModels.TogetherLlama270b]: LLMProviderKeys.TogetherAI,
  [TogetherAIModels.TogetherLlama27B32K]: LLMProviderKeys.TogetherAI,
  [TogetherAIModels.TogetherLlama27B32KInstruct]: LLMProviderKeys.TogetherAI,
  [TogetherAIModels.TogetherLlama27b]: LLMProviderKeys.TogetherAI,
  [TogetherAIModels.TogetherFalcon40bInstruct]: LLMProviderKeys.TogetherAI,
  [TogetherAIModels.TogetherFalcon7bInstruct]: LLMProviderKeys.TogetherAI,
  [TogetherAIModels.TogetherAlpaca7b]: LLMProviderKeys.TogetherAI,
  [TogetherAIModels.TogetherStarchatAlpha]: LLMProviderKeys.TogetherAI,
  [TogetherAIModels.TogetherCodeLlama34b]: LLMProviderKeys.TogetherAI,
  [TogetherAIModels.TogetherCodeLlama34bInstruct]: LLMProviderKeys.TogetherAI,
  [TogetherAIModels.TogetherCodeLlama34bPython]: LLMProviderKeys.TogetherAI,
  [TogetherAIModels.TogetherSqlCoder]: LLMProviderKeys.TogetherAI,
  [TogetherAIModels.TogetherNSQLLlama27B]: LLMProviderKeys.TogetherAI,
  [TogetherAIModels.TogetherWizardCoder15BV10]: LLMProviderKeys.TogetherAI,
  [TogetherAIModels.TogetherWizardCoderPython34BV10]:
    LLMProviderKeys.TogetherAI,
  [TogetherAIModels.TogetherNousHermesLlama213b]: LLMProviderKeys.TogetherAI,
  [TogetherAIModels.TogetherChronosHermes13b]: LLMProviderKeys.TogetherAI,
  [TogetherAIModels.TogetherSolar070b16bit]: LLMProviderKeys.TogetherAI,
  [TogetherAIModels.TogetherWizardLM70BV10]: LLMProviderKeys.TogetherAI,

  // Base Ten Models
  [BaseTenModels.Falcon7B]: LLMProviderKeys.Baseten,
  [BaseTenModels.MPT7BBase]: LLMProviderKeys.Baseten,
  [BaseTenModels.WizardLM]: LLMProviderKeys.Baseten,

  // Petals Models
  [PetalsModels.HuggyLlamaLlama65]: LLMProviderKeys.Petals,
  [PetalsModels.PetalsTeamStableBeluga]: LLMProviderKeys.Petals,

  // Voyage AI Models
  [VoyageAIModels.Voyage01]: LLMProviderKeys.VoyageAI,
  [VoyageAIModels.VoyageLite01]: LLMProviderKeys.VoyageAI,
  [VoyageAIModels.VoyageLite01Instruct]: LLMProviderKeys.VoyageAI,

  // Aleph Alpha Models
  [AlephAlphaModels.LuminousBase]: LLMProviderKeys.AlephAlpha,
  [AlephAlphaModels.LuminousBaseControl]: LLMProviderKeys.AlephAlpha,
  [AlephAlphaModels.LuminousExtended]: LLMProviderKeys.AlephAlpha,
  [AlephAlphaModels.LuminousExtendedControl]: LLMProviderKeys.AlephAlpha,
  [AlephAlphaModels.LuminousSupreme]: LLMProviderKeys.AlephAlpha,
  [AlephAlphaModels.LuminousSupremeControl]: LLMProviderKeys.AlephAlpha,
}

const openAIChatCompletionModelsArray = Object.values(
  OpenAIChatCompletionModels
)
const openAITextCompletionInstructModelsArray = Object.values(
  OpenAITextCompletionInstructModels
)
const openAIVisionModelsArray = Object.values(OpenAIVisionModels)
const huggingFaceModelsWithPromptFormattingArray = Object.values(
  HuggingFaceModelsWithPromptFormatting
)
const ollamaModelsArray = Object.values(OllamaModels)
const ollamaVisionModelsArray = Object.values(OllamaVisionModels)
const vertexAIGoogleModelsArray = Object.values(VertexAIGoogleModels)
const palmModelsArray = Object.values(PalmModels)
const googleAIStudioModelsArray = Object.values(GoogleAIStudioModels)
const mistralAIModelsArray = Object.values(MistralAIModels)
const anthropicModelsArray = Object.values(AnthropicModels)
const sageMakerModelsArray = Object.values(SageMakerModels)
const bedrockModelsArray = Object.values(BedrockModels)
const perplexityAIModelsArray = Object.values(PerplexityAIModels)
const vllmModelsArray = Object.values(VLLMModels)
const xinferenceModelsArray = Object.values(XinferenceModels)
const cloudflareWorkersAIModelsArray = Object.values(CloudflareWorkersAIModels)
const ai21ModelsArray = Object.values(AI21Models)
const nlpCloudModelsArray = Object.values(NLPCloudModels)
const deepInfraChatModelsArray = Object.values(DeepInfraChatModels)
const togetherAIModelsArray = Object.values(TogetherAIModels)
const baseTenModelsArray = Object.values(BaseTenModels)
const petalsModelsArray = Object.values(PetalsModels)
const voyageAIModelsArray = Object.values(VoyageAIModels)
const alephAlphaModelsArray = Object.values(AlephAlphaModels)

export const allTextCompletionModels: LLMModels[] = [
  ...openAIChatCompletionModelsArray,
  ...openAITextCompletionInstructModelsArray,
  ...openAIVisionModelsArray,
  ...huggingFaceModelsWithPromptFormattingArray,
  ...ollamaModelsArray,
  ...ollamaVisionModelsArray,
  ...vertexAIGoogleModelsArray,
  ...palmModelsArray,
  ...googleAIStudioModelsArray,
  ...mistralAIModelsArray,
  ...anthropicModelsArray,
  ...sageMakerModelsArray,
  ...bedrockModelsArray,
  ...perplexityAIModelsArray,
  ...vllmModelsArray,
  ...xinferenceModelsArray,
  ...cloudflareWorkersAIModelsArray,
  ...ai21ModelsArray,
  ...nlpCloudModelsArray,
  ...deepInfraChatModelsArray,
  ...togetherAIModelsArray,
  ...baseTenModelsArray,
  ...petalsModelsArray,
  ...voyageAIModelsArray,
  ...alephAlphaModelsArray,
]

// TODO: Filter these out by provided environment variables so we only show what we have enabled.
export const allModels: (LLMModels | EmbeddingModels)[] = [
  ...allTextCompletionModels,
  ...allEmbeddingModels,
]
