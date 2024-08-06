// @ts-ignore
import { handlers as nodes } from '#nodes-virtual/nodes'

import type { BaseVirtualHandler } from '@gtc-nova/kit/runtime'
import type { NodeDefinition } from '@magickml/behave-graph'

export const getVirtualNodes = (): BaseVirtualHandler<NodeDefinition>[] => nodes
