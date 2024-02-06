import React, { useState, useEffect } from "react";
import { ConfigurationComponentProps } from "./PropertiesWindow";
import { useConfig } from "@magickml/providers";

import { useListCredentialsQuery } from "client/state";
import { useGetUserQuery } from "client/state";
import { LLMProviders, CompletionModel, availableProviders, providers, getProvidersWithUserKeys, isModelAvailableToUser, removeFirstVendorTag } from "servicesShared"

export const CompletionProviderOptions = (props: ConfigurationComponentProps) => {
  const [selectedProvider, setSelectedProvider] = useState<LLMProviders>(props.fullConfig.modelProvider);
  const [selectedModel, setSelectedModel] = useState<CompletionModel>(props.fullConfig.model);
  const [activeModels, setActiveModels] = useState<CompletionModel[]>([])
  const [providersWithKeys, setProvidersWithKeys] = useState<LLMProviders[]>([])

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
    setActiveModels(providers[selectedProvider].completionModels);
  }, [selectedProvider]);

  const onProviderChange = (provider: LLMProviders) => {
    setSelectedProvider(provider);
    props.updateConfigKey("modelProvider", provider);
  };

  const onModelChange = (model: CompletionModel) => {
    setSelectedModel(model);
    props.updateConfigKey("model", model);
  };

  const renderProviderOptions = () => {
    return availableProviders?.map((prov) => {
      return (
        <option key={prov.provider} value={prov.provider}>
          {prov.displayName}
        </option>
      );
    });
  };

  const renderModelOptions = () => {
    const modelsWithKeys = providersWithKeys.map((provider) => {
      return providers[provider].completionModels;
    }).flat();
    return activeModels?.map((model) => {
      const isAvailable = isModelAvailableToUser({
        userData,
        model,
        modelsWithKeys
      })
      return (
        <option key={model} value={model} disabled={!isAvailable} className="bg-gray-600 disabled:bg-gray-700 w-full py-1 px-2 nodrag text-sm">
          {removeFirstVendorTag(model)}
        </option>
      );
    });
  };


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
      <div className="mt-4">
        <h3>Model</h3>
        <div className="flex flex-col mt-1">
          <select
            className="bg-gray-600 disabled:bg-gray-700 w-full py-1 px-2 nodrag text-sm"
            value={selectedModel}
            onChange={(e) => {
              onModelChange(e.target.value as CompletionModel)
            }
            }
          >
            <option value="">Select a model</option>
            {renderModelOptions()}
          </select>
        </div>
      </div>
    </div>
  );
};
