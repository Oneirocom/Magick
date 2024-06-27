import React, { useEffect, useState } from 'react'
import { ConfigurationComponentProps } from './PropertiesWindow'
import { useConfig } from '@magickml/providers'
import { useListCredentialsQuery, useGetUserQuery } from 'client/state'
import {
  isModelAvailableToUser,
  Model,
  getProvidersWithUserKeys,
  getProviderIdMapping,
} from '@magickml/shared-services'
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

  // Handle initial loading
  useEffect(() => {
    if (props.node && props.node.id === lastActiveNodeId) return
    setLastActiveNodeId(props.node?.id || '')

    if (!userData && !providerData) return

    // get the model provider
    let modelProvider = getProviderIdMapping(
      props.fullConfig.modelProvider.toLowerCase()
    )

    let model = props.fullConfig.model
    let updateConfig = false

    // correct config if the model provider is not supported for backward compatibility
    if (modelProvider === 'unsupported') {
      modelProvider = 'openai'
      model = 'gpt-3.5-turbo'
      updateConfig = true
    }

    // set the selected provider, model, and active models
    setSelectedProvider(modelProvider || 'openai')
    setSelectedModel(model || 'gpt-3.5-turbo')
    setActiveModels(
      providerData[modelProvider]?.models || providerData['openai'].models
    )

    // If the API key has not been set, set it to the key name
    // We need this for backwards compatibility
    let updateApiKey = false
    if (!props.fullConfig.providerApiKeyName) {
      updateApiKey = true
    }

    // update the config if needed
    if (updateConfig || updateApiKey) {
      props.updateConfigKeys({
        modelProvider,
        model: model || 'gpt-3.5-turbo',
        providerApiKeyName: modelProvider,
      })
    }

    // set loading to false
    setIsLoading(false)
  }, [userData, providerData, props.node])

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
    const model = providerData[provider]?.models[0]?.model_name

    console.log('model', model)
    setSelectedProvider(provider)

    setSelectedModel(model)
    setActiveModels(providerData[provider]?.models)

    props.updateConfigKeys({
      modelProvider: providerId,
      model: model,
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
            <SelectContent className="max-h-52 overflow-y-auto">
              {activeModels.map(model => {
                const isAvailable = isModelAvailableToUser({
                  userData,
                  model,
                  providersWithUserKeys,
                })
                return (
                  <SelectItem
                    className="truncate"
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
