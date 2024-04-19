import { TabsContent, InputWithLabel, Badge } from '@magickml/client-ui'
import { KnowledgeUploadInput } from './knowledge-upload-input'
import { useConfig } from '@magickml/providers'
import axios from 'axios'
import {
  ClientProjectPresignType,
  useGetPresignedUrlMutation,
} from 'client/state'
import { KnowledgeDialogTab } from './types'
import { useAtom } from 'jotai'
import {
  addKnowledgeDialogAtom,
  addKnowledgeDialogSchema,
  addKnowledgeFormAtom,
} from './schema-state'
import toast from 'react-hot-toast'

type KnowledgeUploadContentProps = {
  disabledState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

export const KnowledgeUploadContent: React.FC<
  KnowledgeUploadContentProps
> = () => {
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

        const response = await getPresignedUrl({
          //
          id: file.name,
          projectId: config?.projectId || '',
          fileName: file.name,
          type: fileType as ClientProjectPresignType,
        })

        if ('data' in response && response.data) {
          const { url, key } = response.data

          await axios.put(url, file, {
            headers: { 'Content-Type': file.type },
          })

          return {
            id: key,
            type: fileType,
            status: 'uploaded',
            name: file.name,
            rawType: file.type,
          }
        } else if ('error' in response) {
          toast.error('Error generating URL for upload')
        } else {
          toast.error('Error uploading file. Please try again.')
        }

        return null
      })

      const uploadedFiles = await Promise.all(filePromises)

      for (const file of uploadedFiles) {
        const parse = addKnowledgeDialogSchema.safeParse({
          tag: 'tag',
          name: file?.name || '',
          sourceUrl: file?.id,
          dataType: file?.rawType,
        })
        if (parse.success) {
          setNewKnowledge([...newKnowledge, parse.data])
        }
      }
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
        />

        <div className="flex flex-row-wrap">
          {newKnowledge.map((knowledge, index) => (
            <Badge key={index} variant="outline" className="border-ds-neutral">
              {knowledge.name}
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
