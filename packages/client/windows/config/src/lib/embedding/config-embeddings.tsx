import { useEffect, useState } from 'react'
import {
  useListCredentialsQuery,
  useUpdateAgentMutation,
  useGetUserQuery,
} from 'client/state'
import { useConfig } from '@magickml/providers'

import {
  LLMProviders,
  ProviderRecord,
  EmbeddingModel,
  providers,
  getProvidersWithUserKeys,
} from 'servicesShared'
import { EmbeddingProviderDropdown } from './embedding-provider'
import { EmbeddingModelDropdown } from './embedding-model'

export const ConfigEmbeddings = ({
  agentId,
}: {
  agentId: string
}): JSX.Element => {
  const [selectedEmbeddingProvider, setSelectedEmbeddingProvider] =
    useState<ProviderRecord>()
  const [activeEmbeddingModels, setActiveEmbeddingModels] = useState<
    EmbeddingModel[]
  >([])
  const [selectedEmbeddingModel, setSelectedEmbeddingModel] =
    useState<EmbeddingModel>()
  const [providersWithKeys, setProvidersWithKeys] = useState<LLMProviders[]>([])

  const config = useConfig()

  const { data: credentials } = useListCredentialsQuery({
    projectId: config.projectId,
  })

  const { data: userData } = useGetUserQuery({
    projectId: config.projectId,
  })

  const [updateAgent] = useUpdateAgentMutation()

  useEffect(() => {
    if (credentials) {
      const creds = credentials.map(cred => cred.name)
      const providers = getProvidersWithUserKeys(creds as any)
      setProvidersWithKeys(providers)
    }
  }, [credentials])

  useEffect(() => {
    setActiveEmbeddingModels(selectedEmbeddingProvider?.embeddingModels || [])
  }, [selectedEmbeddingProvider])

  useEffect(() => {
    if (userData) {
      const provider = userData.embeddingProvider
      const model = userData.embeddingModel
      setSelectedEmbeddingProvider(providers[provider])
      setSelectedEmbeddingModel(model)
    }
  }, [userData])

  const handleEmbeddingProviderChange = (provider: LLMProviders) => {
    setSelectedEmbeddingProvider(providers[provider])
    updateAgent({
      id: agentId,
      embeddingProvider: provider,
    })
  }

  const handleEmbeddingModelChange = (model: EmbeddingModel) => {
    setSelectedEmbeddingModel(model)
    updateAgent({
      id: agentId,
      embeddingModel: model,
    })
  }

  const modelsWithKeys = providersWithKeys
    .map(provider => {
      return providers[provider].embeddingModels
    })
    .flat()

  return (
    <div className="flex flex-col max-w-2xl w-full gap-y-4">
      <EmbeddingProviderDropdown
        selectedEmbeddingProvider={selectedEmbeddingProvider?.provider}
        onChange={handleEmbeddingProviderChange}
      />
      <EmbeddingModelDropdown
        activeEmbeddingModels={activeEmbeddingModels}
        selectedEmbeddingModel={selectedEmbeddingModel}
        userData={userData}
        modelsWithKeys={modelsWithKeys}
        onChange={handleEmbeddingModelChange}
      />
    </div>
  )
}
