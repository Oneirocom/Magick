// This whole file looks messed up, but its not.
// You should not import this at any point before the runtime is initalized.

// @ts-ignore
import { handlers as nodes } from '#grimoire-virtual/nodes'
import type { BaseVirtualHandler } from 'nova/runtime'

export const getNodes = (): BaseVirtualHandler[] => nodes
