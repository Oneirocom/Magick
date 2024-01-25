import React, { useState, useEffect } from "react";
import { ConfigurationComponentProps } from "./PropertiesWindow";

import {
  allOpenAICompletionModelsArray,
  googleAIStudioModelsArray,
  togetherAIModelsArray,
  // ai21ModelsArray,
  // alephAlphaModelsArray,
  // anthropicModelsArray,
  // anyscaleModelsArray,
  // baseTenModelsArray,
  // bedrockModelsArray,
  // cloudflareWorkersAIModelsArray,
  // deepInfraChatModelsArray,
  // huggingFaceModelsWithPromptFormattingArray,
  // mistralAIModelsArray,
  // nlpCloudModelsArray,
  // ollamaModelsArray,
  // openRouterModelsArray,
  // palmModelsArray,
  // perplexityAIModelsArray,
  // petalsModelsArray,
  // replicateModelsArray,
  // sageMakerModelsArray,
  // vertexAIGoogleModelsArray,
  // vllmModelsArray,
  // voyageAIModelsArray,
  // xinferenceModelsArray
} from "plugins/core/src/lib/services/coreLLMService/constants/completionModelArrays";
import { CompletionModels } from "plugins/core/src/lib/services/coreLLMService/types/completionModels";
import { ActiveProviders, LLMProviders } from 'plugins/core/src/lib/services/coreLLMService/types/providerTypes';
import { activeProviders } from "plugins/core/src/lib/services/coreLLMService/constants/providers";

export const CompletionProviderOptions = (props: ConfigurationComponentProps) => {
  console.log('!!!PROPS', props)
  const [selectedProvider, setSelectedProvider] = useState<ActiveProviders>(LLMProviders.OpenAI);
  const [selectedModel, setSelectedModel] = useState<CompletionModels | null>(null);
  const [filteredModels, setFilteredModels] = useState<CompletionModels[]>([]);

  useEffect(() => {
    // get all completion models for the selected provider`
    switch (selectedProvider) {
      case LLMProviders.OpenAI:
        setFilteredModels(allOpenAICompletionModelsArray);
        break;
      case LLMProviders.GoogleAIStudio:
        setFilteredModels(googleAIStudioModelsArray);
        break;
      case LLMProviders.TogetherAI:
        setFilteredModels(togetherAIModelsArray);
        break;
      // case LLMProviders.VertexAI:
      //   setFilteredModels(vertexAIGoogleModelsArray);
      //   break;
      // case LLMProviders.AI21:
      //   setFilteredModels(ai21ModelsArray);
      //   break;
      // case LLMProviders.Anthropic:
      //   setFilteredModels(anthropicModelsArray);
      //   break;
      // case LLMProviders.AlephAlpha:
      //   setFilteredModels(alephAlphaModelsArray);
      //   break;
      // case LLMProviders.Anyscale:
      //   setFilteredModels(anyscaleModelsArray);
      //   break;
      // case LLMProviders.Baseten:
      //   setFilteredModels(baseTenModelsArray);
      //   break;
      // case LLMProviders.Bedrock:
      //   setFilteredModels(bedrockModelsArray);
      //   break;
      // case LLMProviders.CloudflareWorkersAI:
      //   setFilteredModels(cloudflareWorkersAIModelsArray);
      //   break;
      // case LLMProviders.DeepInfra:
      //   setFilteredModels(deepInfraChatModelsArray);
      //   break;
      // case LLMProviders.HuggingFace:
      //   setFilteredModels(huggingFaceModelsWithPromptFormattingArray);
      //   break;
      // case LLMProviders.Mistral:
      //   setFilteredModels(mistralAIModelsArray);
      //   break;
      // case LLMProviders.NLPCloud:
      //   setFilteredModels(nlpCloudModelsArray);
      //   break;
      // case LLMProviders.Ollama:
      //   setFilteredModels(ollamaModelsArray);
      //   break;
      // case LLMProviders.OpenRouter:
      //   setFilteredModels(openRouterModelsArray);
      //   break;
      // case LLMProviders.Palm:
      //   setFilteredModels(palmModelsArray);
      //   break;
      // case LLMProviders.PerplexityAI:
      //   setFilteredModels(perplexityAIModelsArray);
      //   break;
      // case LLMProviders.Petals:
      //   setFilteredModels(petalsModelsArray);
      //   break;
      // case LLMProviders.Replicate:
      //   setFilteredModels(replicateModelsArray);
      //   break;
      // case LLMProviders.Sagemaker:
      //   setFilteredModels(sageMakerModelsArray);
      //   break;
      // case LLMProviders.VLLM:
      //   setFilteredModels(vllmModelsArray);
      //   break;
      // case LLMProviders.VoyageAI:
      //   setFilteredModels(voyageAIModelsArray);
      //   break;
      // case LLMProviders.Xinference:
      //   setFilteredModels(xinferenceModelsArray);
      //   break;
      default: setFilteredModels([]);
    }
  }, [selectedProvider]);

  const onProviderChange = (provider: ActiveProviders) => {
    setSelectedProvider(provider);
    props.updateConfigKey("modelProvider", provider);
  };

  const onModelChange = (model: CompletionModels) => {
    setSelectedModel(model);
    props.updateConfigKey("model", model);
  };

  return (
    <div>
      <h3>Model Provider</h3>
      <div className="flex flex-col mt-1">
        <select
          className="bg-gray-600 disabled:bg-gray-700 w-full py-1 px-2 nodrag text-sm"
          value={selectedProvider}
          onChange={(e) => onProviderChange(e.currentTarget.value as ActiveProviders)}
        >
          {activeProviders.map((provider) => (
            <option key={provider} value={provider}>{provider}</option>
          ))}
        </select>
      </div>
      <br />
      <h3>Model</h3>
      <div className="flex flex-col mt-1">
        <select
          className="bg-gray-600 disabled:bg-gray-700 w-full py-1 px-2 nodrag text-sm"
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value as CompletionModels)}
          disabled={filteredModels.length === 0}
        >
          {filteredModels.map((model) => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
