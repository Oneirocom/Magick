import React, { useEffect, useState } from 'react'
import { ConfigurationComponentProps } from './PropertiesWindow'
import { useConfig } from '@magickml/providers'
import {
  useListCredentialsQuery,
  useGetUserQuery,
  selectActiveNode,
} from 'client/state'
import {
  LLMProviders,
  CompletionModel,
  availableProviders,
  providers,
  getProvidersWithUserKeys,
  isModelAvailableToUser,
  removeFirstVendorTag,
} from 'servicesShared'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@magickml/client-ui'
import { useSelector } from 'react-redux'

// Assuming props.fullConfig has the correct types for modelProvider and model
export const CompletionProviderOptions: React.FC<
  ConfigurationComponentProps
> = props => {
  const [selectedProvider, setSelectedProvider] = useState<LLMProviders | ''>(
    props.fullConfig.modelProvider || ''
  )
  const [selectedModel, setSelectedModel] = useState<CompletionModel | ''>(
    props.fullConfig.model || ''
  )
  const [activeModels, setActiveModels] = useState<CompletionModel[]>([])
  const [providersWithKeys, setProvidersWithKeys] = useState<LLMProviders[]>([])
  const [lastActiveNodeId, setLastActiveNodeId] = useState<string | null>(null)

  const config = useConfig()
  const { data: credentials } = useListCredentialsQuery({
    projectId: config.projectId,
  })
  const { data: userData } = useGetUserQuery({ projectId: config.projectId })
  const selectedNode = useSelector(selectActiveNode(props.tab.id))

  // keep state in sync with selected node
  useEffect(() => {
    if (selectedNode && selectedNode.id === lastActiveNodeId) return
    setLastActiveNodeId(selectedNode?.id || '')
    setSelectedProvider(props.fullConfig.modelProvider || '')
    setSelectedModel(props.fullConfig.model || '')
  }, [selectedNode])

  useEffect(() => {
    setSelectedProvider(props.fullConfig.modelProvider || '')
    setSelectedModel(props.fullConfig.model || '')
  }, [props.fullConfig.modelProvider, props.fullConfig.model])

  const onSelectModel = (model: CompletionModel | '') => {
    setSelectedModel(model)
    props.updateConfigKey('model', model)
  }

  const onSelectProvider = (provider: LLMProviders | '') => {
    setSelectedProvider(provider)
    props.updateConfigKey('modelProvider', provider)
  }

  useEffect(() => {
    const creds = credentials?.map(cred => cred.name) || []
    const providersWithUserKeys = getProvidersWithUserKeys(creds as any)
    setProvidersWithKeys(providersWithUserKeys)
  }, [credentials])

  useEffect(() => {
    if (selectedProvider) {
      const models = providers[selectedProvider]?.completionModels || []
      setActiveModels(models)
    }
  }, [selectedProvider])

  return (
    <div>
      {/* Provider Selection */}
      <h3>Completion Model Provider</h3>
      <div className="flex flex-col mt-1">
        <Select
          value={selectedProvider}
          onValueChange={(newValue: LLMProviders | '') =>
            onSelectProvider(newValue)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Provider" />
          </SelectTrigger>
          <SelectContent>
            {availableProviders.map(prov => (
              <SelectItem key={prov.provider} value={prov.provider}>
                {prov.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Model Selection */}
      <div className="mt-4">
        <h3>Model</h3>
        <div className="flex flex-col mt-1">
          <Select
            value={selectedModel}
            onValueChange={(newValue: CompletionModel | '') => {
              onSelectModel(newValue)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {activeModels.map(model => {
                const isAvailable = isModelAvailableToUser({
                  userData,
                  model,
                  modelsWithKeys: providersWithKeys.flatMap(
                    provider => providers[provider]?.completionModels || []
                  ),
                })
                return (
                  <SelectItem key={model} value={model} disabled={!isAvailable}>
                    {removeFirstVendorTag(model)}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
