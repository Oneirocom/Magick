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
