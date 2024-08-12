// @ts-ignore
import { handlers as tools } from '#tools-virtual/tools'

import type { BaseVirtualHandler } from '@gtc-nova/kit/runtime'
import type { ToolDefinition } from '../types'

export const getVirtualTools = (): BaseVirtualHandler<{
  name: string
  definition: ToolDefinition
}>[] => tools
