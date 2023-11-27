import {
  BooleanControl,
  DropdownControl,
  InputControl,
  NumberControl,
} from '@magickml/core'

const textToImage = [
  {
    type: InputControl,
    dataKey: 'negative_prompt',
    name: 'Negative Prompt',
    icon: 'moon',
    defaultValue: '',
  },
  {
    type: NumberControl,
    dataKey: 'width',
    name: 'Width',
    icon: 'moon',
    defaultValue: 512,
  },
  {
    type: NumberControl,
    dataKey: 'height',
    name: 'Height',
    icon: 'moon',
    defaultValue: 512,
  },
  {
    type: NumberControl,
    dataKey: 'num_inference_steps',
    name: 'Num Inference Steps',
    icon: 'moon',
    defaultValue: 30,
  },
  {
    type: NumberControl,
    dataKey: 'guidance_scale',
    name: 'Guidance Scale',
    icon: 'moon',
    defaultValue: 7.5,
  },
]

const imageToImage = [
  {
    type: InputControl,
    dataKey: 'prompt',
    name: 'Prompt',
    icon: 'moon',
    defaultValue: '',
  },
  {
    type: InputControl,
    dataKey: 'negative_prompt',
    name: 'Negative Prompt',
    icon: 'moon',
    defaultValue: '',
  },
  {
    type: InputControl,
    dataKey: 'width',
    name: 'Width',
    icon: 'moon',
    defaultValue: 512,
  },
  {
    type: NumberControl,
    dataKey: 'height',
    name: 'Height',
    icon: 'moon',
    defaultValue: 512,
  },
  {
    type: NumberControl,
    dataKey: 'strength',
    name: 'Strength',
    icon: 'moon',
    defaultValue: 0.5,
  },
  {
    type: NumberControl,
    dataKey: 'num_inference_steps',
    name: 'Num Inference Steps',
    icon: 'moon',
    defaultValue: 30,
  },
  {
    type: NumberControl,
    dataKey: 'guidance_scale',
    name: 'Guidance Scale',
    icon: 'moon',
    defaultValue: 7.5,
  },
  {
    type: BooleanControl,
    dataKey: 'guess_mode',
    name: 'Guess Mode',
    icon: 'moon',
    defaultValue: false,
  },
]

export const inspectorControls = {
  textToImage,
  imageToImage,
}
