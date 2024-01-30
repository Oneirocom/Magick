import { NodeJSON, NodeSpecJSON } from '@magickml/behave-graph'

export const getConfig = (
  nodeJSON: NodeJSON,
  nodeSpec: NodeSpecJSON
): Record<string, any> => {
  const configuration = nodeJSON?.configuration || {}
  const nodespecConfig = nodeSpec?.configuration || []

  const defaultConfig = nodespecConfig.reduce((acc, config) => {
    const defaultConfig = config?.defaultValue
    const configName = config?.name

    return {
      ...acc,
      [configName]: defaultConfig,
    }
  }, {})

  return {
    ...defaultConfig,
    ...configuration,
  }
}

export const getConfigFromNodeSpec = (
  nodeSpec: NodeSpecJSON
): Record<string, any> => {
  const nodespecConfig = nodeSpec?.configuration || []

  const defaultConfig = nodespecConfig.reduce((acc, config) => {
    const defaultConfig = config?.defaultValue
    const configName = config?.name

    return {
      ...acc,
      [configName]: defaultConfig,
    }
  }, {})

  return {
    ...defaultConfig,
  }
}
