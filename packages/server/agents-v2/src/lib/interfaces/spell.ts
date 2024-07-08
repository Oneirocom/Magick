import { GraphJSON } from '@magickml/behave-graph'

export interface ISpell {
  id: string
  name: string
  graph: GraphJSON
}

export type SpellState = {
  isRunning: boolean
  debug: boolean
}
