import { NodeSpecJSON } from '@magickml/behave-graph'
import nodeSpec from './nodeSpec.json'
import { SpellInterface } from 'server/schemas'
import {
  generateVariableNodeSpecs,
  sortNodeSpecsByType,
} from './generateVariableNodeSpecs'

export const getNodeSpec = (spell?: SpellInterface): NodeSpecJSON[] => {
  if (!spell) return nodeSpec.sort(sortNodeSpecsByType) as NodeSpecJSON[]

  const variableSpecs = generateVariableNodeSpecs(
    nodeSpec as NodeSpecJSON[],
    spell
  )

  const allSpecs = [...nodeSpec, ...variableSpecs].sort(sortNodeSpecsByType)

  return allSpecs as NodeSpecJSON[]
}
