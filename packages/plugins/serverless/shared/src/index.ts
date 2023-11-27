// DOCUMENTED
import { MagickComponent, PluginSecret } from '@magickml/core'
import { HuggingFaceNode } from './nodes/HuggingFaceNode'
import { completionProviders } from './completionProviders'
import { TextToImageNode } from './nodes/TextToImageNode'

/**
 * An array of PluginSecret objects containing information about API key secrets.
 */
const secrets: PluginSecret[] = [
  {
    name: 'Replicate API Key',
    key: 'replicate-api-key',
    global: true,
    getUrl: 'https://replicate.com/account/api-tokens',
  },
  {
    name: 'Hugging Face Access Token',
    key: 'hf-access-token',
    global: true,
    getUrl: 'https://huggingface.co/settings/token',
  },
  {
    name: 'Runpod API Key',
    key: 'runpod-api-key',
  },
]

/**
 * Export an array of all nodes used in the plugin
 * @returns MagickComponent[]
 */
export function getNodes(): MagickComponent<any>[] {
  return [
    // HuggingFaceNode as any,
    TextToImageNode as any,
  ]
}
export default {
  secrets,
  getNodes,
  completionProviders,
}
