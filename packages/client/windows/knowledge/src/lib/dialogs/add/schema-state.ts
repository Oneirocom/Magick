import { atomWithReset } from 'jotai/utils'
import { z } from 'zod'

/* This is the base schema for both file and url knowledge uploads */
/* We send an array of these to the server regardless of source */
export const addKnowledgeDialogSchema = z.object({
  tag: z.string(),
  name: z.string(),
  sourceUrl: z.string(),
  dataType: z.string(), // TODO: use z.enum in shared package e2e. not doing now because of circular dependency
})

export type AddKnowledgeDialogType = z.infer<typeof addKnowledgeDialogSchema>

/* This is used for form elements for both file and url uploads. Its a single object */
export const addKnowledgeFormAtom = atomWithReset<AddKnowledgeDialogType>(
  addKnowledgeDialogSchema.parse({
    tag: '',
    name: '',
    sourceUrl: '',
    dataType: '',
  })
)

/* This is an array used for create knowledge mutations */
export const addKnowledgeDialogAtom = atomWithReset<AddKnowledgeDialogType[]>(
  []
)
