import { Tabs, TabsList, TabsTrigger, PortalDialog } from '@magickml/client-ui'
import { useState } from 'react'
import { KnowledgeUploadContent } from './add/knowledge-upload-content'
import { KnowledgeDialogTab } from './add/types'
import { addKnowledgeDialogAtom, addKnowledgeFormAtom } from './add/state'

import { useAtom, useAtomValue } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import toast from 'react-hot-toast'
import { useCreateKnowledgeMutation } from 'client/state'
import { useConfig } from '@magickml/providers'
import { AddKnowledge } from 'servicesShared'
import { KnowledgeURLContent } from './add/knowledge-url-content'

export const ACCEPT =
  '.eml, .html, .json, .md, .msg, .rst, .rtf, .txt, .xml, .jpeg, .jpg, .png, .csv, .doc, .docx, .epub, .odt, .pdf, .ppt, .pptx, .tsv, .xlsx'

type AddKnowledgeDialogProps = {
  openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

export const AddKnowledgeDialog: React.FC<AddKnowledgeDialogProps> = ({
  openState,
}) => {
  /* State */
  const [tabState, setTabState] = useState<KnowledgeDialogTab>(
    KnowledgeDialogTab.URL
  )
  const uploadDisabled = useState(false)
  const urlDisabled = useState(false)
  const resetFiles = useResetAtom(addKnowledgeDialogAtom)
  const resetForm = useResetAtom(addKnowledgeFormAtom)
  const reset = () => {
    resetFiles()
    resetForm()
  }
  const newKnowledge = useAtomValue(addKnowledgeDialogAtom)
  const [formKnowledge, setFormKnowledge] = useAtom(addKnowledgeFormAtom)

  /* Hooks */
  const { projectId } = useConfig()
  const [createKnowledge, createKnowlegeMeta] = useCreateKnowledgeMutation()
  const handleCreateKnowledge = async () => {
    let knowledge: AddKnowledge[] = []
    if (tabState === KnowledgeDialogTab.UPLOAD) {
      knowledge = newKnowledge
    } else {
      knowledge = [
        {
          ...formKnowledge,
          external: true,
        },
      ]
    }

    try {
      await createKnowledge({
        projectId,
        knowledge,
      })

      reset()
      toast.success('Knowledge saved successfully')
      openState[1](false)
    } catch (error) {
      resetFiles()
      toast.error('Failed to save knowledge')
    }
  }

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
        <KnowledgeURLContent disabledState={urlDisabled} />

        {/* Upload Tab */}
        <KnowledgeUploadContent disabledState={uploadDisabled} />
      </Tabs>
    </PortalDialog>
  )
}
