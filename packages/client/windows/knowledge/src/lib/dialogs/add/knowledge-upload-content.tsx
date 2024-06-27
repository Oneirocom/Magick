import { TabsContent, InputWithLabel, Badge } from '@magickml/client-ui'
import { KnowledgeUploadInput } from './knowledge-upload-input'
import { useConfig } from '@magickml/providers'
import {
  ClientProjectPresignType,
  useGetPresignedUrlMutation,
} from 'client/state'
import { KnowledgeDialogTab } from './types'
import { useAtom } from 'jotai'
import { addKnowledgeDialogAtom, addKnowledgeFormAtom } from './state'
import toast from 'react-hot-toast'
import { CheckIcon, Cross1Icon } from '@radix-ui/react-icons'
import { LoaderType } from '@magickml/embedder/schema'

type KnowledgeUploadContentProps = {
  disabledState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

export interface UploadImageProps {
  presignedUrl: {
    url: string
    key: string
  }
  imageFile: File
}

export const uploadImage = async ({
  presignedUrl,
  imageFile,
}: UploadImageProps) => {
  const url = new URL(presignedUrl.url)
  const headers = new Headers()
  for (const [key, value] of url.searchParams.entries()) {
    if (key.startsWith('x-goog-')) {
      headers.set(key, value)
    }
  }

  headers.set('Content-Type', 'application/octet-stream')

  const res = await fetch(url.toString(), {
    method: 'PUT',
    body: imageFile,
    headers,
  })

  if (res.status !== 200) {
    throw new Error('Failed to upload image. Please try a different image.')
  } else {
    return presignedUrl.key
  }
}

export const KnowledgeUploadContent: React.FC<
  KnowledgeUploadContentProps & { restrictedTypes?: LoaderType[] }
> = ({ restrictedTypes }) => {
  const config = useConfig()
  const [newKnowledge, setNewKnowledge] = useAtom(addKnowledgeDialogAtom)
  const [form, setForm] = useAtom(addKnowledgeFormAtom)

  const [getPresignedUrl, getPresignedUrlState] = useGetPresignedUrlMutation()

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files

    if (files) {
      const filePromises = Array.from(files).map(async file => {
        const fileType = file.name.split('.').pop()

        const newFile = {
          tag: 'tag',
          name: file.name,
          sourceUrl: '',
          dataType: file.type,
          status: 'uploading',
        }
        setNewKnowledge([...newKnowledge, newFile])

        const response = await getPresignedUrl({
          //
          id: file.name,
          projectId: config?.projectId || '',
          fileName: file.name,
          type: fileType as ClientProjectPresignType,
        })

        if ('data' in response && response.data) {
          const upload: UploadImageProps = {
            presignedUrl: {
              url: response.data.url,
              key: response.data.key,
            },
            imageFile: file,
          }

          const key = await uploadImage(upload)

          // Update the file status to 'uploaded' after successful upload
          setNewKnowledge(prevKnowledge =>
            prevKnowledge.map(knowledge =>
              knowledge.name === file.name
                ? { ...knowledge, status: 'uploaded', sourceUrl: key }
                : knowledge
            )
          )

          return {
            tag: 'tag',
            name: file.name,
            sourceUrl: key,
            dataType: file.type,
            status: 'uploaded',
          }
        } else if ('error' in response) {
          toast.error('Error generating URL for upload')

          // Update the file status to 'error' if URL generation fails
          setNewKnowledge(prevKnowledge =>
            prevKnowledge.map(knowledge =>
              knowledge.name === file.name
                ? { ...knowledge, status: 'error' }
                : knowledge
            )
          )

          return {
            tag: 'tag',
            name: file.name,
            sourceUrl: '',
            dataType: file.type,
            status: 'error',
          }
        } else {
          toast.error('Error uploading file. Please try again.')

          // Update the file status to 'error' if upload fails
          setNewKnowledge(prevKnowledge =>
            prevKnowledge.map(knowledge =>
              knowledge.name === file.name
                ? { ...knowledge, status: 'error' }
                : knowledge
            )
          )

          return {
            tag: 'tag',
            name: file.name,
            sourceUrl: '',
            dataType: file.type,
            status: 'error',
          }
        }
      })

      await Promise.all(filePromises)
    }
  }

  return (
    <TabsContent value={KnowledgeDialogTab.UPLOAD}>
      <div className="flex flex-col items-start gap-y-2 justify-center w-full pb-4">
        <KnowledgeUploadInput
          inputProps={{
            onChange: handleFileUpload,
            disabled: getPresignedUrlState.isLoading,
          }}
          restrictedTypes={restrictedTypes}
        />
        <span className="text-sm font-semibold">Uploaded Files:</span>
        <div className="flex flex-row-wrap gap-2">
          {newKnowledge.map((knowledge, index) => (
            <Badge
              key={index}
              variant="outline"
              className="border-ds-neutral gap-x-2 inline-flex items-center"
            >
              {knowledge.name}
              <KnowledgeBadgeStatus status={knowledge.status ?? ''} />
            </Badge>
          ))}
        </div>
      </div>

      <InputWithLabel
        id="tag"
        label="Tag"
        placeholder="Enter a tag"
        value={form.tag}
        onChange={e => setForm({ ...form, tag: e.target.value })}
      />
    </TabsContent>
  )
}

export const KnowledgeBadgeStatus: React.FC<{ status: string }> = ({
  status,
}) => {
  switch (status) {
    case 'uploaded':
      return <CheckIcon className="w-4 h-4 text-ds-alert" />
    case 'uploading':
      return <span className="loading loading-ring loading-xs" />
    case 'error':
      return <Cross1Icon className="w-4 h-4 text-ds-error" />
    default:
      return null
  }
}
