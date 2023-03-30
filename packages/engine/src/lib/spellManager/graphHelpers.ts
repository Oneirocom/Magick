import { GraphData } from '../types'

/**
 * extracts all module inputs based upon a given key
 */
export const extractModuleInputKeys = (data: GraphData) =>
  Object.values(data.nodes).reduce((inputKeys: string[], node) => {
    if (node.name !== 'Input') return inputKeys
    if (node.data.name && !node.data.useDefault)
      inputKeys.push(node.data.name as string)

    return inputKeys
  }, [] as string[])
