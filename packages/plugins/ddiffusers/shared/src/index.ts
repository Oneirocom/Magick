// DOCUMENTED
import { MagickComponent, PluginSecret } from '@magickml/core'
import { completionProviders } from './completionProviders'
import { ImageGeneration } from './nodes/ImageGeneration'

/**
 * An array of PluginSecret objects containing information about API key secrets.
 */
const secrets: PluginSecret[] = []

/**
 * Export an array of all nodes used in the plugin
 * @returns MagickComponent[]
 */
export function getNodes(): MagickComponent<any>[] {
  return [ImageGeneration as any]
}
export default {
  secrets,
  getNodes,
  completionProviders,
}
