import React, { useState } from 'react'
import {
  Dialog,
  DialogTrigger,
  Button,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  InputWithLabel,
  TextareaWithLabel,
} from '@magickml/client-ui'
import toast from 'react-hot-toast'
import { createEmbedderReactClient } from '@magickml/embedder-client-react'

interface CreateKnowledgePackFormProps {
  client: ReturnType<typeof createEmbedderReactClient>
}

const CreateKnowledgePackForm: React.FC<CreateKnowledgePackFormProps> = ({
  client,
}) => {
  const { invalidate } = client.useGetPacksByEntityAndOwner()

  const { mutateAsync: createPack } = client.useCreatePack(
    {},
    {
      onSuccess: async () => {
        toast.success('Knowledge pack created successfully!')
        await invalidate()
      },
      onError: () => {
        toast.error('Failed to create knowledge pack.')
      },
    }
  )

  const handleCreatePack = async () => {
    await createPack({
      name,
      description,
    })
  }

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create New</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Create New Knowledge Pack</DialogTitle>
          <DialogDescription>
            Fill out the details for your new knowledge pack.
          </DialogDescription>
        </DialogHeader>

        <InputWithLabel
          id="name"
          label="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter the name of the knowledge pack"
        />

        <TextareaWithLabel
          id="description"
          label="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Enter a description for the knowledge pack"
        />

        <DialogFooter>
          <Button onClick={handleCreatePack} type="submit">
            Create Pack
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateKnowledgePackForm
