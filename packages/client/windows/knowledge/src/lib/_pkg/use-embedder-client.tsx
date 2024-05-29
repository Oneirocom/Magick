import { useAtomValue } from 'jotai'
import { embedderTokenAtom } from './state'
import { createEmbedderReactClient } from '@magickml/embedder-client-react'

export const useEmbedder = () => {
  const token = useAtomValue(embedderTokenAtom)

  const client = createEmbedderReactClient({
    tsqPrefix: 'embedder',
    baseUrl:
      process.env.NEXT_PUBLIC_EMBEDDER_SERVER_URL || 'http://localhost:3000/api',
    options: {
      axiosConfig: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    },
  })

  return client
}
