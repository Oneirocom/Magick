import { atomWithReset } from 'jotai/utils'
import { AddKnowledgeSchema, type AddKnowledge } from 'servicesShared'
import { z } from 'zod'

/* This is used for form elements for both file and url uploads. Its a single object */
export const addKnowledgeFormAtom = atomWithReset<AddKnowledge>(
  AddKnowledgeSchema.parse({
    tag: '',
    name: '',
    sourceUrl: '',
    dataType: '',
  })
)

/* This is an array used for create knowledge mutations */
export const addKnowledgeDialogAtom = atomWithReset<AddKnowledge[]>([])
