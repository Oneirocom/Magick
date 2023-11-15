// DOCUMENTED
import { GraphData } from '../types'

/**
 * Extracts all module inputs based upon a given key.
 * @param data The data object which contains the GraphData to search inputs for.
 * @returns An array containing string values of all input keys found in the GraphData.
 */
export function extractModuleInputKeys(data: GraphData): string[] {
  return Object.values(data.nodes).reduce((inputKeys: string[], node) => {
    if (
      (node.name === 'Input' || node.name === 'Socket Input') &&
      node.data.name &&
      !node.data.useDefault
    ) {
      inputKeys.push(node.data.name as string)
    }
    return inputKeys
  }, [])
}
