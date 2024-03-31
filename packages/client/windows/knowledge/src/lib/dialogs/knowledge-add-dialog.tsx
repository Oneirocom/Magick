import {
  Dropdown,
  InputWithLabel,
  PortalDialog,
  SelectWithLabel,
} from '@magickml/client-ui'
import { useState } from 'react'
import { DataType } from '../file-types'

type AddKnowledgeDialogProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const AddKnowledgeDialog: React.FC<AddKnowledgeDialogProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [tag, setTag] = useState('')
  const [dataType, setDataType] = useState('')
  const addKnowledgeVersion = async ({
    templateId,
  }: {
    templateId: string
  }) => {}

  const handleAddKnowledge = async () => {
    await addKnowledgeVersion({ templateId: '123' })
  }

  const dataTypes = Object.values(DataType).map(type => ({
    label: type,
    value: type,
  }))

  const isLoading = false

  return (
    <PortalDialog
      base={{
        root: {
          open: isOpen,
          onOpenChange: setIsOpen,
        },
      }}
      title="Add Knowledge"
      description="Turn your data into memories for your agent."
      footerText={`${isLoading ? 'Updating' : 'Update'} Template`}
      footerButton={{
        onClick: handleAddKnowledge,
        isLoading: isLoading,
        className: 'w-full',
        variant: 'portal-primary',
      }}
    >
      <InputWithLabel
        id="name"
        label="Name"
        placeholder="Enter a name for your knowledge"
        className="w-full"
      />

      <InputWithLabel
        id="sourceUrl"
        label="Source URL"
        placeholder="Enter a source URL"
        className="w-full"
      />
      <div className="grid grid-cols-2 gap-x-2">
        <InputWithLabel id="tag" label="Tag" placeholder="Enter a tag" />

        <SelectWithLabel
          id="dataType"
          label="Data Type"
          className="w-full"
          options={dataTypes}
          group='Data Type'
        />
      </div>
    </PortalDialog>
  )
}
