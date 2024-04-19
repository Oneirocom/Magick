import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  InputWithLabel,
  PortalDialog,
  SelectWithLabel,
} from '@magickml/client-ui'
import { useState } from 'react'
import { DataType } from './add/file-types'
import { KnowledgeUploadContent } from './add/knowledge-upload-content'
import { KnowledgeDialogTab } from './add/types'
import {
  addKnowledgeDialogAtom,
  addKnowledgeFormAtom,
} from './add/schema-state'

import { useAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import toast from 'react-hot-toast'
import { useCreateKnowledgeMutation } from 'client/state'
import { useConfig } from '@magickml/providers'

const ACCEPT =
  '.eml, .html, .json, .md, .msg, .rst, .rtf, .txt, .xml, .jpeg, .jpg, .png, .csv, .doc, .docx, .epub, .odt, .pdf, .ppt, .pptx, .tsv, .xlsx'

type AddKnowledgeDialogProps = {
  openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

export const AddKnowledgeDialog: React.FC<AddKnowledgeDialogProps> = ({
  openState,
}) => {
  const [tabState, setTabState] = useState<KnowledgeDialogTab>(
    KnowledgeDialogTab.URL
  )

  const { projectId } = useConfig()

  const resetFiles = useResetAtom(addKnowledgeDialogAtom)
  const resetForm = useResetAtom(addKnowledgeFormAtom)
  const [newKnowledge, setNewKnowledge] = useAtom(addKnowledgeDialogAtom)
  const [formKnowledge, setFormKnowledge] = useAtom(addKnowledgeFormAtom)

  const [createKnowledge, createKnowlegeMeta] = useCreateKnowledgeMutation()

  const uploadDisabled = useState(false)

  const handleCreateKnowledge = async () => {
    try {
      const response = await createKnowledge({
        projectId,
        knowledge: newKnowledge.map(k => ({
          ...k,
          name: formKnowledge.name,
          sourceUrl: formKnowledge.sourceUrl,
          tag: formKnowledge.tag,
          dataType: formKnowledge.dataType,
        })),
      }).unwrap()

      console.log('Knowledge created:', response)
      toast.success('Knowledge saved successfully')
      openState[1](false)
    } catch (error) {
      console.error('Error saving knowledge:', error)
    }
  }

  const dataTypes = Object.values(DataType).map(type => ({
    label: type,
    value: type,
  }))

  return (
    <PortalDialog
      base={{
        root: {
          open: openState[0],
          onOpenChange: openState[1],
        },
        content: { className: 'w-full max-w-2xl' },
      }}
      title="Add Knowledge"
      description={
        tabState === KnowledgeDialogTab.URL
          ? 'Upload your data from a URL into memories for your agent.'
          : 'Upload your data from a file into memories for your agent.'
      }
      footerText={
        tabState === KnowledgeDialogTab.URL
          ? 'Upload Knowledge From URL'
          : 'Upload Knowledge From File'
      }
      footerButton={{
        disabled:
          createKnowlegeMeta.isLoading || tabState === KnowledgeDialogTab.UPLOAD
            ? uploadDisabled[0]
            : false,
        onClick: handleCreateKnowledge,
        isLoading: createKnowlegeMeta.isLoading,
        className: 'w-full',
        variant: 'portal-primary',
      }}
    >
      {JSON.stringify(newKnowledge, null, 2)}
      <Tabs
        value={tabState}
        onValueChange={value => setTabState(value as KnowledgeDialogTab)} // safe to cast with the enum
        defaultValue={KnowledgeDialogTab.URL}
        className="w-full"
      >
        {/* Tabs List */}
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value={KnowledgeDialogTab.URL}>URL</TabsTrigger>
          <TabsTrigger value={KnowledgeDialogTab.UPLOAD}>Upload</TabsTrigger>
        </TabsList>

        {/* URL Tab */}
        <TabsContent
          value={KnowledgeDialogTab.URL}
          className="flex flex-col gap-y-4 pt-2"
        >
          <InputWithLabel
            id="name"
            label="Name"
            placeholder="Enter a name for this new knowledge entry"
            className="w-full"
            value={formKnowledge.name}
            onChange={e =>
              setFormKnowledge({ ...formKnowledge, name: e.target.value })
            }
            required
          />
          <InputWithLabel
            id="sourceUrl"
            label="Source URL"
            placeholder="Enter a source URL to download the knowledge from"
            className="w-full"
            value={formKnowledge.sourceUrl}
            onChange={e =>
              setFormKnowledge({ ...formKnowledge, sourceUrl: e.target.value })
            }
            disabled={!!formKnowledge.sourceUrl}
          />

          <div className="grid grid-cols-2 gap-x-2">
            <InputWithLabel
              id="tag"
              label="Tag"
              placeholder="Enter a tag"
              value={formKnowledge.tag}
              onChange={e =>
                setFormKnowledge({ ...formKnowledge, tag: e.target.value })
              }
            />
            <SelectWithLabel
              id="dataType"
              label="Data Type"
              className="w-full"
              options={dataTypes}
              group="Data Type"
              value={formKnowledge.dataType}
              onValueChange={(value: string) =>
                setFormKnowledge({ ...formKnowledge, dataType: value })
              }
              required
            />
          </div>
        </TabsContent>

        {/* Upload Tab */}
        <KnowledgeUploadContent disabledState={uploadDisabled} />
      </Tabs>
    </PortalDialog>
  )
}
