import { useEffect, useState } from 'react'
import { useUpdateAgentMutation, useGetUserQuery } from 'client/state'
import { useConfig } from '@magickml/providers'

import { EmbeddingProviderDropdown } from './embedding-provider'
import { EmbeddingModelDropdown } from './embedding-model'

export const ConfigEmbeddings = ({
  agentId,
}: {
  agentId: string
}): JSX.Element => {
  const [selectedEmbeddingProvider, setSelectedEmbeddingProvider] =
    useState<string>()

  const [selectedEmbeddingModel, setSelectedEmbeddingModel] = useState<string>()

  const config = useConfig()

  // const { data: userData, isLoading: isUserDataLoading } = useGetUserQuery({
  //   projectId: config.projectId,
  // })

  const [updateAgent] = useUpdateAgentMutation()

  // useEffect(() => {
  //   if (userData) {
  //     const provider = userData.embeddingProvider
  //     const model = userData.embeddingModel
  //     setSelectedEmbeddingProvider(provider)
  //     setSelectedEmbeddingModel(model)
  //   }
  // }, [userData])

  const handleEmbeddingProviderChange = (provider: string) => {
    setSelectedEmbeddingProvider(provider)
    updateAgent({
      id: agentId,
      embeddingProvider: provider,
    })
  }

  const handleEmbeddingModelChange = (model: string) => {
    setSelectedEmbeddingModel(model)
    updateAgent({
      id: agentId,
      embeddingModel: model,
    })
  }

  // if (isUserDataLoading) {
  //   return <div>Loading...</div>
  // }

  return (
    <div className="flex flex-col max-w-2xl w-full gap-y-4">
      <EmbeddingProviderDropdown
        selectedEmbeddingProvider={selectedEmbeddingProvider}
        onChange={handleEmbeddingProviderChange}
      />
      <EmbeddingModelDropdown
        activeEmbeddingModels={['text-embedding-ada-002']}
        selectedEmbeddingModel={selectedEmbeddingModel}
        modelsWithKeys={['text-embedding-ada-002']}
        onChange={handleEmbeddingModelChange}
      />
    </div>
  )
}
