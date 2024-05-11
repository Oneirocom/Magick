import { Dropdown } from '@magickml/client-ui'
import { type FC } from 'react'

interface EmbeddingModelDropdownProps {
  activeEmbeddingModels: string[]
  selectedEmbeddingModel?: string
  userData?: any
  modelsWithKeys: string[]
  onChange: (model: string) => void
}

export const EmbeddingModelDropdown: FC<EmbeddingModelDropdownProps> = ({
  activeEmbeddingModels,
  selectedEmbeddingModel,
  userData,
  modelsWithKeys,
  onChange,
}) => {
  const modelOptions = [{ value: 'text-embedding-ada-002', label: 'Ada 002' }]

  return (
    <div className="flex flex-col gap-y-1 w-full">
      <p className="font-semibold">Embedding Model</p>
      <Dropdown
        options={modelOptions}
        selectedValue={selectedEmbeddingModel || ''}
        onChange={value => onChange(value)}
        placeholder="Select a model"
      />
    </div>
  )
}
