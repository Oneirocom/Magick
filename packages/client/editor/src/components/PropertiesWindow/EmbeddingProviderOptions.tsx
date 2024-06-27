import React, { useEffect, useState } from 'react'
import { ConfigurationComponentProps } from './PropertiesWindow'
import { useConfig } from '@magickml/providers'
import { useListCredentialsQuery, useGetUserQuery } from 'client/state'
import {
  Model,
  getProvidersWithUserKeys,
  groupModelsByProvider,
  isModelAvailableToUser,
} from '@magickml/shared-services'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@magickml/client-ui'

export const EmbeddingProviderOptions: React.FC<
  ConfigurationComponentProps
> = props => {
  const [selectedProvider, setSelectedProvider] = useState(
    props.fullConfig.modelProvider || ''
  )
  const [selectedModel, setSelectedModel] = useState(
    props.fullConfig.model || ''
  )
  const [activeModels, setActiveModels] = useState<Model[]>([])

  const [providersWithUserKeys, setProvidersWithUserKeys] = useState<
    Record<string, { models: Model[]; apiKey: string }>
  >({})

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
          setSelectedProvider(props.fullConfig.modelProvider || '')
          setSelectedModel(props.fullConfig.model || '')
          setActiveModels(
            groupedModels[props.fullConfig.modelProvider].models || []
          )
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
    if (!providerData) return

    setProvidersWithUserKeys(
      getProvidersWithUserKeys(providerData, credentials || [])
    )
  }, [credentials, providerData])

  useEffect(() => {
    if (selectedProvider) {
      const models = providerData[selectedProvider].models || []
      setActiveModels(models)
    }
  }, [selectedProvider])

  if (isLoading || isUserDataLoading || !userData) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {/* Embedding Model Provider Selection */}
      <h3>Embedding Model Provider</h3>
      <div className="flex flex-col mt-1">
        <Select
          value={selectedProvider}
          onValueChange={(newValue: string) => setSelectedProvider(newValue)}
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
        <h3>Embedding Model</h3>
        <div className="flex flex-col mt-1">
          <Select
            value={selectedModel}
            onValueChange={(newValue: string) => {
              setSelectedModel(newValue)
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
