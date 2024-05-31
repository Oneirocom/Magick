import { z } from 'zod'
import { StatusSchema } from './shared.schema'

const CommonUrlLoaderSchema = z.object({
  url: z.string().url().describe('The URL to load data from.'),
})

export const LoaderTypeSchema = z.enum([
  'text',
  'youtube',
  'youtube_channel',
  'youtube_search',
  'web',
  'sitemap',
  'pdf',
  'docx',
  'excel',
  'ppt',
  // 'confluence',
  // 'json',
])

export const TextLoaderSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
})

export const YoutubeLoaderSchema = z.object({
  type: z.literal('youtube'),
  videoIdOrUrl: z.string(),
})

export const YoutubeChannelLoaderSchema = z.object({
  type: z.literal('youtube_channel'),
  channelId: z.string(),
})

export const YoutubeSearchLoaderSchema = z.object({
  type: z.literal('youtube_search'),
  searchString: z.string(),
})

export const WebLoaderSchema = CommonUrlLoaderSchema.extend({
  type: z.literal('web'),
})

export const SitemapLoaderSchema = CommonUrlLoaderSchema.extend({
  type: z.literal('sitemap'),
})

export const PdfLoaderSchema = CommonUrlLoaderSchema.extend({
  type: z.literal('pdf'),
})

export const DocxLoaderSchema = CommonUrlLoaderSchema.extend({
  type: z.literal('docx'),
})

export const ExcelLoaderSchema = CommonUrlLoaderSchema.extend({
  type: z.literal('excel'),
})

export const PptLoaderSchema = CommonUrlLoaderSchema.extend({
  type: z.literal('ppt'),
})

// export const ConfluenceLoaderSchema = z.object({
//   type: z.literal('confluence'),
//   spaceNames: z.array(z.string()),
// })

// export const JsonLoaderSchema = z.object({
//   type: z.literal('json'),
//   object: z.record(z.any()),
//   pickKeysForEmbedding: z.array(z.string()),
// })

export const LoaderWithoutConfigSchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  description: z.string().optional(),
  packId: z.string().uuid(),
  type: LoaderTypeSchema,
  status: StatusSchema,
})

const schemas = [
  TextLoaderSchema,
  YoutubeLoaderSchema,
  YoutubeChannelLoaderSchema,
  YoutubeSearchLoaderSchema,
  WebLoaderSchema,
  SitemapLoaderSchema,
  PdfLoaderSchema,
  DocxLoaderSchema,
  ExcelLoaderSchema,
  PptLoaderSchema,
  // ConfluenceLoaderSchema,
  // JsonLoaderSchema,
] as const

export const LoaderConfigSchema = z.union(schemas)

export const LoaderSchema = LoaderWithoutConfigSchema.extend({
  config: LoaderConfigSchema,
})

export const AddLoaderSchema = LoaderSchema.omit({
  id: true,
  packId: true,
  status: true,
})

export const AddLoaderResponseSchema = z.object({
  status: StatusSchema,
  id: z.string().uuid(),
})

export type Loader = z.infer<typeof LoaderSchema>

export type LoaderType = Loader['type']

export const loaderSchemaMap: Record<LoaderType, z.ZodObject<any>> = {
  text: TextLoaderSchema,
  youtube: YoutubeLoaderSchema,
  youtube_channel: YoutubeChannelLoaderSchema,
  youtube_search: YoutubeSearchLoaderSchema,
  web: WebLoaderSchema,
  sitemap: SitemapLoaderSchema,
  pdf: PdfLoaderSchema,
  docx: DocxLoaderSchema,
  excel: ExcelLoaderSchema,
  ppt: PptLoaderSchema,
  // confluence: ConfluenceLoaderSchema,
  // json: JsonLoaderSchema,
}
