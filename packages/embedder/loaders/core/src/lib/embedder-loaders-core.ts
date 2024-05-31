import {
  BaseLoader,
  // ConfluenceLoader,
  DocxLoader,
  ExcelLoader,
  // JsonLoader,
  PdfLoader,
  PptLoader,
  SitemapLoader,
  TextLoader,
  WebLoader,
  YoutubeChannelLoader,
  YoutubeLoader,
  YoutubeSearchLoader,
} from '@llm-tools/embedjs'
import { info } from '@magickml/embedder/config'
// import { Loader } from '@magickml/embedder/db/sql'
import { LoaderConfigSchema } from '@magickml/embedder/schema'

type Loader = any //TODO: post db package setup

export function createLoader(loader: Loader): BaseLoader {
  info(`Creating loader: ${loader.type}: ${JSON.stringify(loader, null, 2)}`)

  const config = LoaderConfigSchema.parse({
    id: loader.id,
    type: loader.type,
    ...(loader.config as Object),
  })

  switch (config.type) {
    case 'text':
      return new TextLoader(config)
    case 'youtube':
      return new YoutubeLoader(config)
    case 'youtube_channel':
      return new YoutubeChannelLoader(config)
    case 'youtube_search':
      return new YoutubeSearchLoader(config)
    case 'web':
      return new WebLoader(config)
    case 'sitemap':
      return new SitemapLoader(config)
    case 'pdf':
      return new PdfLoader(config)
    case 'docx':
      return new DocxLoader(config)
    case 'excel':
      return new ExcelLoader(config)
    case 'ppt':
      return new PptLoader(config)
    // case 'confluence':
    //   return new ConfluenceLoader({
    //     spaceNames: config.spaceNames as [string, ...string[]],
    //   })
    // case 'json':
    //   return new JsonLoader(config)

    default:
      throw new Error(`Unsupported loader type: ${JSON.stringify(config)}`)
  }
}
