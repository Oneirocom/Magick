import React, { useEffect, useState } from 'react'
import { ConfigurationComponentProps } from './PropertiesWindow'
import { useConfig } from '@magickml/providers'
import {
  useListCredentialsQuery,
  useGetUserQuery,
  selectActiveNode,
} from 'client/state'
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
import { useSelector } from 'react-redux'

export const CompletionProviderOptions: React.FC<
  ConfigurationComponentProps
> = props => {
  const [selectedProvider, setSelectedProvider] = useState<string>('')
  const [selectedModel, setSelectedModel] = useState('')
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
  const selectedNode = useSelector(selectActiveNode(props.tab.id))

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
    if (selectedNode && selectedNode.id === lastActiveNodeId) return
    setLastActiveNodeId(selectedNode?.id || '')
    setSelectedProvider(props.fullConfig.modelProvider || '')
    setSelectedModel(props.fullConfig.model || '')
  }, [selectedNode])

  useEffect(() => {
    setSelectedProvider(props.fullConfig.modelProvider || '')
    setSelectedModel(props.fullConfig.model || '')
  }, [props.fullConfig.modelProvider, props.fullConfig.model])

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
    setSelectedProvider(provider)
    props.updateConfigKey('modelProvider', provider)
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
