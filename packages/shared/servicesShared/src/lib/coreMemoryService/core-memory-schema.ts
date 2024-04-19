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
