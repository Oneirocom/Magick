import React, { useEffect, useState } from 'react'
import { ConfigurationComponentProps } from './PropertiesWindow'
import { useConfig } from '@magickml/providers'
import { useListCredentialsQuery, useGetUserQuery } from 'client/state'
import {
  isModelAvailableToUser,
  groupModelsByProvider,
  Model,
  getProvidersWithUserKeys,
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
  const [providerData, setProviderData] = useState<
    Record<string, { models: Model[]; apiKey: string }>
  >({})
  const [isLoading, setIsLoading] = useState(true)

  const config = useConfig()
  const { data: credentials } = useListCredentialsQuery({
    projectId: config.projectId,
  })
  const { data: userData, isLoading: isUserDataLoading } = useGetUserQuery({
    projectId: config.projectId,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://api.keywordsai.co/api/models/public'
        )
        const data = await response.json()
        const { models } = data

        const groupedModels = groupModelsByProvider(models)
        setProviderData(groupedModels)

        if (userData) {
          let modelProvider = props.fullConfig.modelProvider
          const model = props.fullConfig.model

          if (!groupedModels[props.fullConfig.modelProvider]) {
            // set up fallback for the model provider in case config is wrong
            props.updateConfigKey('modelProvider', 'OpenAI')
            modelProvider = 'OpenAI'
          }

          setSelectedProvider(modelProvider || 'openai')
          setSelectedModel(model || 'gpt-3.5-turbo')
          setActiveModels(groupedModels[modelProvider].models || [])

          // If the API key has not been set, set it to the key name
          // We need this for backwards compatibility
          if (!props.fullConfig.modelProviderApiKey) {
            props.updateConfigKey(
              'providerApiKeyName',
              groupedModels[modelProvider].apiKey
            )
          }
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching models:', error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userData])

  useEffect(() => {
    if (props.node && props.node.id === lastActiveNodeId) return
    setLastActiveNodeId(props.node?.id || '')
    setSelectedProvider(props.fullConfig.modelProvider || '')
    setSelectedModel(props.fullConfig.model || '')
  }, [props.node])

  useEffect(() => {
    setSelectedProvider(props.fullConfig.modelProvider || '')
    setSelectedModel(props.fullConfig.model || '')
  }, [props.fullConfig.modelProvider])

  useEffect(() => {
    if (!providerData) return

    setProvidersWithUserKeys(
      getProvidersWithUserKeys(providerData, credentials || [])
    )
  }, [credentials, providerData])

  useEffect(() => {
    if (selectedProvider) {
      const models = providerData[selectedProvider]?.models || []
      setActiveModels(models)
    }
  }, [selectedProvider])

  const onSelectModel = (model: string) => {
    setSelectedModel(model)
    props.updateConfigKey('model', model)
  }

  const onSelectProvider = (provider: string) => {
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
            {Object.keys(providerData).map(provider => (
              <SelectItem key={provider} value={provider}>
                {provider}
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
