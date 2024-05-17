import React, { useEffect, useState } from 'react'
import { ConfigurationComponentProps } from './PropertiesWindow'
import { useConfig } from '@magickml/providers'
import { useListCredentialsQuery, useGetUserQuery } from 'client/state'
import {
  isModelAvailableToUser,
  Model,
  getProvidersWithUserKeys,
  getProviderIdMapping,
} from 'servicesShared'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@magickml/client-ui'

export const CompletionProviderOptions: React.FC<
  ConfigurationComponentProps
> = props => {
  const providerData = useConfig().providerData

  const [selectedProvider, setSelectedProvider] = useState<string>(
    props.fullConfig.modelProvider || ''
  )
  const [selectedModel, setSelectedModel] = useState(
    props.fullConfig.model || ''
  )
  const [activeModels, setActiveModels] = useState<Model[]>([])
  const [providersWithUserKeys, setProvidersWithUserKeys] = useState<
    Record<string, { models: Model[]; apiKey: string }>
  >({})
  const [lastActiveNodeId, setLastActiveNodeId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const config = useConfig()
  const { data: credentials } = useListCredentialsQuery({
    projectId: config.projectId,
  })
  const { data: userData, isLoading: isUserDataLoading } = useGetUserQuery({
    projectId: config.projectId,
  })

  useEffect(() => {
    if (!userData || !providerData) return
    let modelProvider = getProviderIdMapping(
      props.fullConfig.modelProvider.toLowerCase()
    )

    let model = props.fullConfig.model
    let updateConfig = false
    if (modelProvider === 'unsupported') {
      // set up fallback for the model provider in case config is wrong
      modelProvider = 'openai'
      model = 'gpt-3.5-turbo'
      updateConfig = true
    }

    setSelectedProvider(modelProvider || 'openai')
    setSelectedModel(
      providerData[modelProvider]?.models[0]?.model_name || 'gpt-3.5-turbo'
    )
    setActiveModels(
      providerData[modelProvider]?.models || providerData['openai'].models
    )

    // If the API key has not been set, set it to the key name
    // We need this for backwards compatibility
    let updateApiKey = false
    if (!props.fullConfig.providerApiKeyName) {
      updateApiKey = true
    }

    if (updateConfig || updateApiKey) {
      props.updateConfigKeys({
        modelProvider,
        model: model || 'gpt-3.5-turbo',
        providerApiKeyName: modelProvider,
      })
    }
    setIsLoading(false)
  }, [userData, providerData])

  useEffect(() => {
    if ((props.node && props.node.id === lastActiveNodeId) || !providerData)
      return
    setLastActiveNodeId(props.node?.id || '')
    let modelProvider = getProviderIdMapping(props.fullConfig.modelProvider)
    let model = props.fullConfig.model
    let updateConfig = false
    if (modelProvider === 'unsupported') {
      // set up fallback for the model provider in case config is wrong
      modelProvider = 'openai'
      model = 'gpt-3.5-turbo'
      updateConfig = true
    }

    setSelectedProvider(modelProvider)
    setSelectedModel(
      providerData[modelProvider]?.models[0]?.model_name || 'gpt-3.5-turbo'
    )
    setActiveModels(
      providerData[modelProvider]?.models || providerData['openai']?.models
    )
    updateConfig &&
      props.updateConfigKeys({
        modelProvider,
        model: model || 'gpt-3.5-turbo',
      })
  }, [props.node, providerData])

  useEffect(() => {
    if (!providerData) return
    let modelProvider = getProviderIdMapping(props.fullConfig.modelProvider)

    let model = props.fullConfig.model
    let updateConfig = false
    if (modelProvider === 'unsupported') {
      // set up fallback for the model provider in case config is wrong
      modelProvider = 'openai'
      model = 'gpt-3.5-turbo'
      updateConfig = true
    }
    setSelectedProvider(modelProvider)
    setSelectedModel(
      providerData[modelProvider]?.models[0]?.model_name || 'gpt-3.5-turbo'
    )
    setActiveModels(
      providerData[modelProvider]?.models || providerData['openai']?.models
    )

    updateConfig &&
      props.updateConfigKeys({
        modelProvider,
        model: model || 'gpt-3.5-turbo',
      })
  }, [selectedProvider, providerData])

  useEffect(() => {
    if (!providerData) return
    setProvidersWithUserKeys(
      getProvidersWithUserKeys(providerData, credentials || [])
    )
  }, [credentials, providerData])

  useEffect(() => {
    if (!selectedProvider || !providerData) return
    const models = providerData[selectedProvider]?.models || []
    setActiveModels(models)
  }, [selectedProvider, providerData])

  const onSelectModel = (model: string) => {
    setSelectedModel(model)
    props.updateConfigKey('model', model)
  }

  const onSelectProvider = (provider: string) => {
    if (!providerData) return
    const providerId = providerData[provider].models[0].provider.provider_id
    setSelectedProvider(provider)

    props.updateConfigKeys({
      modelProvider: providerId,
      providerApiKeyName: providerData[provider]?.apiKey || '',
    })
  }

  if (isLoading || isUserDataLoading || !userData) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {/* Provider Selection */}
      <h3>Completion Model Provider</h3>
      <div className="flex flex-col mt-1">
        <Select
          value={selectedProvider}
          onValueChange={(newValue: string) => onSelectProvider(newValue)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Provider" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(providerData).map(
              ([provider, { providerName }]) => {
                return (
                  <SelectItem key={provider} value={provider}>
                    {providerName}
                  </SelectItem>
                )
              }
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Model Selection */}
      <div className="mt-4">
        <h3>Model</h3>
        <div className="flex flex-col mt-1">
          <Select
            value={selectedModel}
            onValueChange={(newValue: string) => {
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
                  providersWithUserKeys,
                })
                return (
                  <SelectItem
                    key={model.model_name}
                    value={model.model_name}
                    disabled={!isAvailable}
                  >
                    {model.model_name}
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
