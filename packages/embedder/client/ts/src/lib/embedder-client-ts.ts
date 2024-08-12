import { Zodios, type ZodiosOptions } from '@zodios/core'

import { packEndpoints } from '@magickml/embedder-api-packs'
import { loaderEndpoints } from '@magickml/embedder-api-loaders'
import { jobEndpoints } from '@magickml/embedder-api-jobs'
import { tokenEndpoints } from '@magickml/embedder-api-auth'

export function createEmbedderClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(
    baseUrl,
    [...packEndpoints, ...loaderEndpoints, ...jobEndpoints, ...tokenEndpoints],
    options
  )
}

export const makeEmbedderClient = (token: string) =>
  createEmbedderClient(process.env['NEXT_PUBLIC_EMBEDDER_SERVER_URL'] || '', {
    axiosConfig: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })

export type EmbedderClient = ReturnType<typeof makeEmbedderClient>
