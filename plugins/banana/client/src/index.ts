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
    dataKey: 'alpha',
    name: 'Alpha',
    icon: 'moon',
    defaultValue: 0.75,
  },
  {
    type: InputControl,
    dataKey: 'num_inference_steps',
    name: 'Number of Inference Steps',
    icon: 'moon',
    defaultValue: 50,
  },
  {
    type: InputControl,
    dataKey: 'seed_image_id',
    name: 'Seed Image ID',
    icon: 'moon',
    defaultValue: 'og_beat',
  },
  {
    type: InputControl,
    dataKey: 'start_seed',
    name: 'Start Seed',
    icon: 'moon',
    defaultValue: 42,
  },
  {
    type: InputControl,
    dataKey: 'start_denoising',
    name: 'Start Denoising',
    icon: 'moon',
    defaultValue: 0.75,
  },
  {
    type: InputControl,
    dataKey: 'start_guidance',
    name: 'Start Guidance',
    icon: 'moon',
    defaultValue: 7,
  },
  {
    type: InputControl,
    dataKey: 'end_seed',
    name: 'End Seed',
    icon: 'moon',
    defaultValue: 123,
  },
  {
    type: InputControl,
    dataKey: 'end_denoising',
    name: 'End Denoising',
    icon: 'moon',
    defaultValue: 0.75,
  },
  {
    type: InputControl,
    dataKey: 'end_guidance',
    name: 'End Guidance',
    icon: 'moon',
    defaultValue: 7,
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
