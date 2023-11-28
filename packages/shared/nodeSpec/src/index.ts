import { NodeSpecJSON } from '@magickml/behave-graph'
import nodeSpec from './nodeSpec.json'

export const getNodeSpec = (): NodeSpecJSON[] => {
  return nodeSpec as NodeSpecJSON[]
}
