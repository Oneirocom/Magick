// UNDOCUMENTED
/**
 * A plugin for interacting with models hosted on banana.dev.
 * @class
 */
import { ClientPlugin, InputControl } from '@magickml/core'
import shared from '@magickml/plugin-banana-shared'

// Importing shared variables from plugin-banana-shared module
const { secrets, completionProviders } = shared

// {
//   "alpha": 0.75,
//   "num_inference_steps": 50,
//   "seed_image_id": "og_beat",
//   "start": {
//     "prompt": "church bells on sunday",
//     "seed": 42,
//     "denoising": 0.75,
//     "guidance": 7
//   },
//   "end": {
//     "prompt": "jazz with piano",
//     "seed": 123,
//     "denoising": 0.75,
//     "guidance": 7
//   }
// }

// Input controls for text2image completion
const text2audioCompletionControls = [
  {
    type: InputControl,
    dataKey: 'bucket_name',
    name: 'Bucket name',
    icon: 'moon',
    defaultValue: ''
  },
  {
    type: InputControl,
    dataKey: 'supabase_url',
    name: 'Supabase URL',
    icon: 'moon',
    defaultValue: '',
  },
]

// Object containing all input controls for different completion types
const inspectorControls = {
  text2audio: text2audioCompletionControls,
}

// Creating a new DockerDiffusersPlugin instance
const BananaPlugin = new ClientPlugin({
  name: 'BananaPlugin',
  secrets, // API Key and Model ID secrets
  completionProviders: completionProviders.map(provider => {
    // Adding custom input controls for each completion type
    return {
      ...provider,
      inspectorControls: inspectorControls[provider.subtype],
    }
  }),
})

export default BananaPlugin
