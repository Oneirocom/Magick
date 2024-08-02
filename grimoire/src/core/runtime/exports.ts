// This whole file looks messed up, but its not.
// You should not import this at any point before the runtime is initalized.

import type { NodeHandlerVirtual } from '../../types/grimoire'
// @ts-ignore
import { handlers as nodes } from '#grimoire-virtual/nodes'

export const getNodes = (): NodeHandlerVirtual[] => nodes
