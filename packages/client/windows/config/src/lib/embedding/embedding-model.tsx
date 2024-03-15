import { Dropdown } from '@magickml/client-ui'
import { type FC } from 'react'
import {
  EmbeddingModel,
  isModelAvailableToUser,
  removeFirstVendorTag,
} from 'servicesShared'

interface EmbeddingModelDropdownProps {
  activeEmbeddingModels: EmbeddingModel[]
  selectedEmbeddingModel?: EmbeddingModel
  userData?: any
  modelsWithKeys: EmbeddingModel[]
  onChange: (model: EmbeddingModel) => void
}

export const EmbeddingModelDropdown: FC<EmbeddingModelDropdownProps> = ({
  activeEmbeddingModels,
  selectedEmbeddingModel,
  userData,
  modelsWithKeys,
  onChange,
}) => {
  const modelOptions = activeEmbeddingModels.map(model => {
    const isAvailable = isModelAvailableToUser({
      userData,
      model,
      modelsWithKeys,
    })
    return {
      value: model,
      label: removeFirstVendorTag(model),
      disabled: !isAvailable,
    }
  })

  return (
    <div className="flex flex-col gap-y-1 w-full">
      <p className="font-semibold">Embedding Model</p>
      <Dropdown
        options={modelOptions}
        selectedValue={selectedEmbeddingModel || ''}
        onChange={value => onChange(value as EmbeddingModel)}
        placeholder="Select a model"
      />
    </div>
  )
}
