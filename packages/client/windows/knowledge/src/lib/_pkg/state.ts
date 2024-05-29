import type { createEmbedderReactClient } from '@magickml/embedder-client-react'
import { atomWithReset } from 'jotai/utils'

export const clientAtom = atomWithReset<ReturnType<
  typeof createEmbedderReactClient
> | null>(null)

export const activePackIdAtom = atomWithReset<string | null>(null)

export const embedderTokenAtom = atomWithReset<string | null>(null)
