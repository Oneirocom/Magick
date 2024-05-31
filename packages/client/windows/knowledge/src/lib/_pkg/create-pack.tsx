import React, { useState } from 'react'
import {
  InputWithLabel,
  TextareaWithLabel,
  PortalDialog,
} from '@magickml/client-ui'
import toast from 'react-hot-toast'
import { createEmbedderReactClient } from '@magickml/embedder-client-react'

type CreateKnowledgePackDialog = {
  state: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  client: ReturnType<typeof createEmbedderReactClient>
}

export const CreateKnowledgePackDialog: React.FC<CreateKnowledgePackDialog> = ({
  state,
  client,
}) => {
  const [open, setOpen] = state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const { invalidate } = client.useGetPacksByEntityAndOwner()

  const { mutateAsync: createPack, isLoading } = client.useCreatePack(
    {},
    {
      onSuccess: async () => {
        toast.success('Knowledge pack created successfully!')
        await invalidate()
        setName('')
        setDescription('')
        setOpen(false)
      },
      onError: () => {
        toast.error('Failed to create knowledge pack.')
      },
    }
  )

  const handleCreate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!name) {
      toast.error('Please enter a name for your knowledge pack.')
      return
    }

    await createPack({
      name,
      description,
    })
  }

  return (
    <PortalDialog
      base={{
        root: {
          open: open,
          onOpenChange: setOpen,
        },
      }}
      title="Name Your Knowledge Pack"
      description="Fill out the details for your new knowledge pack."
      footerText="Create"
      footerButton={{
        onClick: handleCreate,
        disabled: !name,
        isLoading: isLoading,
        variant: 'portal-primary',
        className: 'w-full',
      }}
      triggerButton={{
        className: 'hidden',
      }}
    >
      <div className="flex flex-col gap-8">
        <InputWithLabel
          id="name"
          label="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter the name of the knowledge pack"
          autoComplete="off"
        />

        <TextareaWithLabel
          id="description"
          label="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Enter a description for the knowledge pack"
        />
      </div>
    </PortalDialog>
  )
}
