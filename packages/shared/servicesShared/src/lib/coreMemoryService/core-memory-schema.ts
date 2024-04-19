import { z } from 'zod'

export const IndirectDataTypeSchema = z.enum([
  'youtube_video',
  'pdf_file',
  'web_page',
  'sitemap',
  'xml',
  'docx',
  'docs_site',
  'notion',
  'csv',
  'mdx',
  'image',
  'unstructured',
  'json',
  'openapi',
  'gmail',
  'substack',
  'youtube_channel',
  'discord',
  'custom',
  'rss_feed',
  'beehiiv',
  'google_drive',
  'directory',
  'slack',
  'dropbox',
  'text_file',
])

export const SpecialDataTypeSchema = z.enum(['auto', 'qna_pair'])

export const DataTypeSchema = z.union([
  z.literal('auto'),
  z.literal('text'),
  IndirectDataTypeSchema,
  SpecialDataTypeSchema,
])

export type ZIndirectDataType = z.infer<typeof IndirectDataTypeSchema>
export type ZSpecialDataType = z.infer<typeof SpecialDataTypeSchema>
export type ZDataType = z.infer<typeof DataTypeSchema>

/* Accept attribute values for file uploads */
export const AcceptValues = z.enum([
  'application/pdf',
  'text/html',
  'application/xml',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/csv',
  'text/markdown',
  'image/*',
  'application/json',
  'application/yaml',
  'message/rfc822',
  'application/rss+xml',
  'text/plain',
  'application/vnd.google-apps.document',
  'application/vnd.google-apps.spreadsheet',
  'application/vnd.google-apps.presentation',
  'application/vnd.google-apps.folder',
  'application/vnd.google-apps.file',
  'application/vnd.google-apps.script',
  'application/vnd.google-apps.site',
  'application/vnd.google-apps.jam',
  'application/vnd.google-apps.form',
  'application/vnd.google-apps.fusiontable',
  'application/vnd.google-apps.map',
  'application/vnd.google-apps.drawing',
  'application/vnd.google-apps.drive-sdk',
  'application/octet-stream',
])

export function getAcceptAttribute(): string {
  return AcceptValues.options.join(', ')
}

/* This validates with type/* included */
export function isValidAcceptValue(value: string): boolean {
  const regex = new RegExp(
    AcceptValues.options.map(option => option.replace(/\*/g, '.*')).join('|')
  )
  return regex.test(value)
}

/* Takes in an AcceptValue and returns a DataType */
export const getDataTypeFromAcceptValue = (acceptValue: string) => {
  const v = AcceptValues.options.reduce((acc, curr) => {
    if (acceptValue.includes(curr)) {
      return curr
    }
    return acc
  }, 'unstructured')
}

/* This is the base schema for both file and url knowledge uploads 
/* We send an array of these to the server regardless of source */
export const AddKnowledgeSchema = z.object({
  tag: z.string(),
  name: z.string(),
  sourceUrl: z.string(),
  dataType: z.string(), // TODO: use z.enum in shared package e2e. not doing now because of circular dependency
})

export type AddKnowledge = z.infer<typeof AddKnowledgeSchema>

/* This is the schema for the create knowledge mutation */
export const CreateKnowledgeMutationSchema = z.object({
  projectId: z.string(),
  knowledge: z.array(AddKnowledgeSchema),
})

export type CreateKnowledgeMutation = z.infer<
  typeof CreateKnowledgeMutationSchema
>
