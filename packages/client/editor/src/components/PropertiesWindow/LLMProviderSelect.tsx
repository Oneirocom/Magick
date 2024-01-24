import React, { useState } from "react";
import { ConfigurationComponentProps } from "./PropertiesWindow";
import { LLMProviders } from "plugins/core/src/lib/services/coreLLMService/types";

export const LLMProviderSelect = (props: ConfigurationComponentProps) => {
  // TODO: We should make google default when available
  const [selectedProvider, setSelectedProvider] = useState<LLMProviders>(LLMProviders.OpenAI);

  const onChange = (provider: LLMProviders) => {
    setSelectedProvider(provider);
    props.updateConfigKey("modelProvider", provider);
  }

  return (
    <div>
      <h3>LLM Provider</h3>
      <div className="flex flex-col mt-1">
        <select
          className="bg-gray-600 disabled:bg-gray-700 w-full py-1 px-2 nodrag text-sm"
          value={selectedProvider}
          onChange={(e) => onChange(e.currentTarget.value as LLMProviders)}
        >
          {Object.values(LLMProviders).map((provider) => (
            <option key={provider} value={provider}>{provider}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
