import { NodeSpecJSON } from '@magickml/behave-graph'
import nodeSpec from './nodeSpec.json'
import pluginCredentials from './credentials.json'
import { SpellInterface } from '@magickml/agent-server-schemas'
import {
  generateVariableNodeSpecs,
  sortNodeSpecsByType,
} from './generateDynamicNodeSpecs'

export * from './generateDynamicNodeSpecs'

export const getNodeSpec = (spell?: SpellInterface): NodeSpecJSON[] => {
  if (!spell) return nodeSpec.sort(sortNodeSpecsByType) as NodeSpecJSON[]

  const variableSpecs = generateVariableNodeSpecs(
    nodeSpec as NodeSpecJSON[],
    spell
  )

  const allSpecs = [...nodeSpec, ...variableSpecs].sort(sortNodeSpecsByType)

  return allSpecs as NodeSpecJSON[]
}

export const getRawNodeSpec = () => {
  return nodeSpec
}

export const getPluginCredentials = () => {
  return pluginCredentials
}

export function getUniquePluginNames(): string[] {
  const uniquePluginNames = new Set<string>()
  pluginCredentials.forEach(service => {
    uniquePluginNames.add(service.pluginName)
  })
  return Array.from(uniquePluginNames)
}
