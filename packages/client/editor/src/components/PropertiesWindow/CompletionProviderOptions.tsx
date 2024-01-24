import React, { useState, useEffect } from "react";
import { ConfigurationComponentProps } from "./PropertiesWindow";
import { LLMProviders, CompletionModels } from "plugins/core/src/lib/services/coreLLMService/types";
import { ai21ModelsArray, anthropicModelsArray } from "plugins/core/src/lib/services/coreLLMService/constants/completionModelArrays";


export const CompletionProviderOptions = (props: ConfigurationComponentProps) => {
  const [selectedProvider, setSelectedProvider] = useState<LLMProviders>(LLMProviders.OpenAI);
  const [selectedModel, setSelectedModel] = useState<CompletionModels | null>(null);
  const [filteredModels, setFilteredModels] = useState<CompletionModels[]>([]);

  useEffect(() => {

    // get all completion models for the selected provider`
    switch (selectedProvider) {
      case LLMProviders.AI21:
        setFilteredModels(ai21ModelsArray);
        break;
      case LLMProviders.Anthropic:
        setFilteredModels(anthropicModelsArray);
        break;
      case LLMProviders.AlephAlpha:
        setFilteredModels([]);
        break;
      case LLMProviders.Anyscale:
        setFilteredModels([]);
        break;
      case LLMProviders.Azure:
        setFilteredModels([]);
        break;
      case LLMProviders.Baseten:
        setFilteredModels([]);
        break;
      case LLMProviders.Bedrock:
        setFilteredModels([]);
        break;
      case LLMProviders.CloudflareWorkersAI:
        setFilteredModels([]);
        break;
      // case LLMProviders.OpenAI:
      //   setFilteredModels(allOpenAICompletionModelsArray);
      //   break;


    }
  }, [selectedProvider]);

  const onProviderChange = (provider: LLMProviders) => {
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
          onChange={(e) => onProviderChange(e.currentTarget.value as LLMProviders)}
        >
          {Object.values(LLMProviders).map((provider) => (
            <option key={provider} value={provider}>{provider}</option>
          ))}
        </select>
      </div>
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
