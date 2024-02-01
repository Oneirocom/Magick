import React, { useState, useEffect } from "react";
import { ConfigurationComponentProps } from "./PropertiesWindow";
import { CompletionModels } from "plugins/core/src/lib/services/coreLLMService/types/completionModels";
import { useConfig } from "@magickml/providers";
import { filterProvidersBasedOnSubscription, getProvidersWithUserKeys } from "plugins/core/src/lib/services/coreLLMService/findProvider";
import { useListCredentialsQuery } from "client/state";
import { useGetUserQuery } from "client/state";
import { LLMProviders } from "plugins/core/src/lib/services/coreLLMService/types/providerTypes";
import { providers } from "plugins/core/src/lib/services/coreLLMService/types/providers";

export const CompletionProviderOptions = (props: ConfigurationComponentProps) => {
  const [selectedProvider, setSelectedProvider] = useState<LLMProviders>(props.fullConfig.modelProvider);
  const [selectedModel, setSelectedModel] = useState<CompletionModels>(props.fullConfig.model);
  const [activeModels, setActiveModels] = useState<CompletionModels[]>([])
  const [providersWithKeys, setProvidersWithKeys] = useState<LLMProviders[]>([])
  const [filteredProviders, setFilteredProviders] = useState<LLMProviders[]>([])
  const [openAIAPIBase, setOpenAIAPIBase] = useState('');

  const config = useConfig()
  const { data: credentials } = useListCredentialsQuery({
    projectId: config.projectId,
  })
  const { data: userData } = useGetUserQuery({
    projectId: config.projectId,
  })

  useEffect(() => {
    if (credentials) {
      const creds = credentials.map(cred => cred.name);
      const providers = getProvidersWithUserKeys(creds as any);
      setProvidersWithKeys(providers);
    }
  }, [credentials]);

  useEffect(() => {
    if (userData) {
      const filteredProviderNames = filterProvidersBasedOnSubscription({
        userData,
        providersWithKeys,
      });
      setFilteredProviders(filteredProviderNames);
      // Change the selected provider
      const newProvider = providers[selectedProvider] || providers[LLMProviders.GoogleAIStudio]; // Default to OpenAI if selectedProvider is not valid
      setActiveModels(newProvider.completionModels || []);
      // Set the first model of the new provider as the selected model
      const firstModel = newProvider.completionModels?.[0] || null;
      setSelectedModel(firstModel);
      // Update the configuration with the first model of the new provider
      if (firstModel) {
        props.updateConfigKey("model", firstModel);
      }
    }
  }, [userData, providersWithKeys, selectedProvider]);

  const onProviderChange = (provider: LLMProviders) => {
    setSelectedProvider(provider);
    props.updateConfigKey("modelProvider", provider);
  };

  const onModelChange = (model: CompletionModels) => {
    setSelectedModel(model);
    props.updateConfigKey("model", model);
  };

  const handleCustomOpenAIChange = (e) => {
    const value = e.target.value;
    setOpenAIAPIBase(value);
    props.updateConfigKey("customBaseUrl", value);
  };

  function removeFirstVendorTag(modelName) {
    // Define a regex pattern to match the first vendor tag
    const prefixPattern = /^([^/]+\/)?(.+)$/;

    // Use regex to extract the model name without the first vendor tag
    const match = modelName.match(prefixPattern);
    if (match && match.length === 3) {
      return match[2]; // The second capture group is the model name without the first vendor tag
    }
    // If no tag is found, return the original model name
    return modelName;
  }

  const renderProviderOptions = () => {
    return filteredProviders?.map((prov) => {
      const isAvailable = providersWithKeys.includes(prov);
      const newProvider = providers[prov];
      return (
        <option key={prov} value={prov} style={{ color: isAvailable ? 'black' : 'gray' }}>
          {newProvider.displayName}
        </option>
      );
    });
  };

  const renderModelOptions = () => {
    return activeModels?.map((model) => {
      return (
        <option key={model} value={model}>
          {removeFirstVendorTag(model)}
        </option>
      );
    });
  };

  const isCustomOpenAISelected = selectedProvider === LLMProviders.CustomOpenAI;

  return (
    <div>
      <h3>Model Provider</h3>
      <div className="flex flex-col mt-1">
        <select
          className="bg-gray-600 disabled:bg-gray-700 w-full py-1 px-2 nodrag text-sm"
          value={selectedProvider}
          onChange={(e) => onProviderChange(e.currentTarget.value as any)}
        >
          {renderProviderOptions()}
        </select>
      </div>
      {isCustomOpenAISelected && (
        <div className="mt-4">
          <h3>Custom API URL</h3>
          <input
            type="text"
            id="customOpenAI"
            className="bg-gray-600 disabled:bg-gray-700 w-full py-1 px-2 nodrag text-sm"
            value={openAIAPIBase}
            onChange={handleCustomOpenAIChange}
          />
        </div>
      )}
      <div className="mt-4">
        <h3>Model</h3>
        <div className="flex flex-col mt-1">
          <select
            className="bg-gray-600 disabled:bg-gray-700 w-full py-1 px-2 nodrag text-sm"
            value={selectedModel}
            onChange={(e) => {
              console.log('MODEL CHANGE', e.target.value)
              onModelChange(e.target.value as CompletionModels)
            }
            }
          >
            {renderModelOptions()}
          </select>
        </div>
      </div>
    </div>
  );
};
