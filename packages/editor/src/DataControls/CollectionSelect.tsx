import { useConfig } from '@magickml/client-core'
import { CollectionControl, collectionApi } from '@magickml/core'
import React, { FC, useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@magickml/ui'

interface Collection {
  value: string
  name: string
}

interface CollectionSelectProps {
  control?: CollectionControl
  updateData: (data: { collection: { label: string; value: string } }) => void
  initialValue?: Collection
  defaultvalue?: string | number
}

const CollectionSelect: FC<CollectionSelectProps> = ({
  control,
  updateData,
  initialValue,
  defaultvalue,
}) => {
  const config = useConfig()

  const [selectedOption, setSelectedOption] = useState(
    initialValue || { value: 'all', label: 'All' }
  )

  const { data: collections } = collectionApi.useGetCollectionsQuery({
    projectId: config.projectId,
  })

  const mappedCollections = collections?.data.map(collection => ({
    value: collection.id,
    label: collection.name,
  }))

  const findCollection = (collectionId: string) => {
    const c = mappedCollections?.find(
      collection => collection.value === collectionId
    )

    console.log('c', c)
    return c
  }

  const onChange = (value: string) => {
    console.log('valueOnchange', value)
    if (!value) return
    const e = findCollection(value)
    console.log('e', e)
    setSelectedOption(e)
    updateData({ collection: e })
    if (control && control instanceof CollectionControl) {
      control.updateData({
        collection: e,
      })
    }
    console.log('selectedOption', selectedOption)
  }

  return (
    <div style={{ flex: 1 }}>
      <Select
        value={selectedOption?.value}
        disabled={!collections?.data}
        onValueChange={onChange}
      >
        <SelectTrigger className="py-8">
          <SelectValue
            placeholder={defaultvalue?.toString() || 'Select a collection'}
          />
        </SelectTrigger>
        <SelectContent className="bg-black text-whiite">
          {mappedCollections?.map(collection => (
            <SelectItem key={collection.value} value={collection.value}>
              {collection.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default CollectionSelect
