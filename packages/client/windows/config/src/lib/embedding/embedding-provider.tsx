import { Dropdown } from '@magickml/client-ui'
import { type FC } from 'react'

interface EmbeddingProviderDropdownProps {
  selectedEmbeddingProvider?: string
  onChange: (provider: string) => void
}

export const EmbeddingProviderDropdown: FC<EmbeddingProviderDropdownProps> = ({
  selectedEmbeddingProvider,
  onChange,
}) => {
  const providerOptions = [
    { label: 'Open AI', value: 'text-embedding-ada-002' },
  ]

  return (
    <div className="flex flex-col gap-y-2 w-full">
      <p className="font-semibold">Embedding Model Provider</p>
      <Dropdown
        options={providerOptions}
        selectedValue={selectedEmbeddingProvider || ''}
        onChange={value => onChange(value)}
        placeholder="Select a provider"
      />
    </div>
  )
}
