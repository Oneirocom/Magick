// @ts-ignore
import { handlers as loaders } from '#embedjs-virtual/loaders'

import type { BaseVirtualHandler } from '@gtc-nova/kit/runtime'
import type { BaseLoader } from '@llm-tools/embedjs'

export const getVirtualLoaders = (): BaseVirtualHandler<typeof BaseLoader>[] =>
  loaders
