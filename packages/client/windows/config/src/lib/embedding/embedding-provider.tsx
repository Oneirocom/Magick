import { Dropdown } from '@magickml/client-ui'
import { type FC } from 'react'
import { LLMProviders, availableEmbeddingProviders } from 'servicesShared'

interface EmbeddingProviderDropdownProps {
  selectedEmbeddingProvider?: LLMProviders
  onChange: (provider: LLMProviders) => void
}

export const EmbeddingProviderDropdown: FC<EmbeddingProviderDropdownProps> = ({
  selectedEmbeddingProvider,
  onChange,
}) => {
  const providerOptions = availableEmbeddingProviders.map(prov => ({
    value: prov.provider,
    label: prov.displayName,
  }))

  return (
    <div className="flex flex-col gap-y-2 w-full">
      <p className='font-semibold'>Embedding Model Provider</p>
      <Dropdown
        options={providerOptions}
        selectedValue={selectedEmbeddingProvider || ''}
        onChange={value => onChange(value as LLMProviders)}
        placeholder="Select a provider"
      />
    </div>
  )
}
