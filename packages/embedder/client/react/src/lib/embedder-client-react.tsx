import { createEmbedderClient } from '@magickml/embedder-client-ts'
import { ZodiosOptions } from '@zodios/core'

import { ZodiosHooks } from '@zodios/react'

interface CreateEmbedderClientOptions {
  tsqPrefix: string

  baseUrl: string
  options?: ZodiosOptions
}

export const createEmbedderReactClient = ({
  tsqPrefix,
  ...options
}: CreateEmbedderClientOptions) => {
  return new ZodiosHooks(
    tsqPrefix,
    createEmbedderClient(options.baseUrl, options.options)
  )
}
