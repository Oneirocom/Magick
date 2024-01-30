import React, { useState, useEffect } from "react";
import { ConfigurationComponentProps } from "./PropertiesWindow";

import { CompletionModels } from "plugins/core/src/lib/services/coreLLMService/types/completionModels";

import { ActiveProviders, activeProviders } from "plugins/core/src/lib/services/coreLLMService/constants/providers";

import { useConfig } from "@magickml/providers";
import { getProvidersWithUserKeys } from "plugins/core/src/lib/services/coreLLMService/findProvider";
import { getAvailableModelsForProvider } from "plugins/core/src/lib/services/coreLLMService/findModels";
import { useListCredentialsQuery } from "client/state";
import { useGetUserQuery } from "client/state";
import { SubscriptionNames } from "plugins/core/src/lib/services/userService/types";


export const CompletionProviderOptions = (props: ConfigurationComponentProps) => {

  const [selectedProvider, setSelectedProvider] = useState<ActiveProviders>(props.fullConfig.modelProvider);
  const [selectedModel, setSelectedModel] = useState<CompletionModels | null>(props.fullConfig.model);
  const [filteredModels, setFilteredModels] = useState<CompletionModels[]>([])
  const [providersWithKeys, setProvidersWithKeys] = useState([])
  const [filteredProviders, setFilteredProviders] = useState<ActiveProviders[]>([])

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
      const hasSubscription = userData.user.hasSubscription

      let filteredProviders

      if (!hasSubscription) {
        const userSubscriptionName = String(userData.user.subscriptionName || '').trim();
        const wizard = String(SubscriptionNames.Wizard).trim();
        const apprentice = String(SubscriptionNames.Apprentice).trim();

        switch (userSubscriptionName) {
          case wizard:
            filteredProviders = activeProviders
            break;
          case apprentice:
            filteredProviders = activeProviders.filter(provider => providersWithKeys.includes(provider));
            break;
        }
        setFilteredProviders(filteredProviders);
      } else {

        const budget = userData.user.balance
        if (budget > 0) {
          filteredProviders = activeProviders
        } else {
          filteredProviders = []
        }

        setFilteredProviders(filteredProviders);
      }
    }
  }, [userData]);

  useEffect(() => {
    const models = getAvailableModelsForProvider(selectedProvider)
    setFilteredModels(models as CompletionModels[]);
  }, [selectedProvider]);

  const onProviderChange = (provider: ActiveProviders) => {
    setSelectedProvider(provider);
    props.updateConfigKey("modelProvider", provider);
  };

  const onModelChange = (model: CompletionModels) => {
    setSelectedModel(model);
    props.updateConfigKey("model", model);
  };


  const renderProviderOptions = () => {
    return activeProviders.map((provider) => {
      const isAvailable = filteredProviders.includes(provider);
      return (
        <option key={provider} value={provider} disabled={!isAvailable} style={{ color: isAvailable ? 'black' : 'gray' }}>
          {provider}
        </option>
      );
    });
  };

  const renderModelOptions = () => {
    return filteredModels.map((model) => {
      const isModelAvailable = filteredModels.includes(model);
      return (
        <option key={model} value={model} disabled={!isModelAvailable}>
          {model}
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
          onChange={(e) => onProviderChange(e.currentTarget.value as ActiveProviders)}
        >
          {renderProviderOptions()}
        </select>
      </div>
      <br />
      <h3>Model</h3>
      <div className="flex flex-col mt-1">
        <select
          className="bg-gray-600 disabled:bg-gray-700 w-full py-1 px-2 nodrag text-sm"
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value as CompletionModels)}
        >
          {renderModelOptions()}
        </select>
      </div>
    </div>
  );
};
