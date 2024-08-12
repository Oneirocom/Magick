// @ts-ignore
import { handlers as schemas } from '#schemas-virtual/schemas'

import type { BaseVirtualHandler } from '@gtc-nova/kit/runtime'
import type { SchemaDefinition } from '../types'

export const getVirtualSchemas = (): BaseVirtualHandler<{
  key: string
  definition: SchemaDefinition
}>[] => schemas
