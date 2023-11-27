import {
  BooleanControl,
  DropdownControl,
  InputControl,
  NumberControl,
} from '@magickml/core'

const summarization = [
  {
    type: NumberControl,
    dataKey: 'max_length',
    name: 'Max Length',
    icon: 'moon',
    defaultValue: 100,
  },
  {
    type: NumberControl,
    dataKey: 'min_length',
    name: 'Min Length',
    icon: 'moon',
    defaultValue: 50,
  },
  {
    type: NumberControl,
    dataKey: 'repetition_penalty',
    name: 'Repetition Penalty',
    icon: 'moon',
    defaultValue: 10.0,
  },
  {
    type: NumberControl,
    dataKey: 'temperature',
    name: 'Temperature',
    icon: 'moon',
    defaultValue: 1.0,
  },
  {
    type: NumberControl,
    dataKey: 'top_k',
    name: 'Top K',
    icon: 'moon',
    defaultValue: 50,
  },
  {
    type: NumberControl,
    dataKey: 'top_p',
    name: 'Top P',
    icon: 'moon',
    defaultValue: 1.0,
  },
]

const textGeneration = [
  {
    type: BooleanControl,
    dataKey: 'do_sample',
    name: 'Do Sample',
    icon: 'moon',
    defaultValue: true,
  },
  {
    type: NumberControl,
    dataKey: 'num_return_sequences',
    name: 'Number of Return Sequences',
    icon: 'moon',
    defaultValue: 1,
  },
  {
    type: BooleanControl,
    dataKey: 'return_full_text',
    name: 'Return Full Text',
    icon: 'moon',
    defaultValue: true,
  },
  {
    type: NumberControl,
    dataKey: 'temperature',
    name: 'Temperature',
    icon: 'moon',
    defaultValue: 1.0,
  },
]

const tokenClassification = [
  {
    type: DropdownControl,
    dataKey: 'aggregation_strategy',
    name: 'Aggregation Strategy',
    icon: 'moon',
    values: ['none', 'simple', 'first', 'average', 'max'],
    defaultValue: 'simple',
  },
]

const zeroShotClassification = [
  {
    type: InputControl,
    dataKey: 'candidate_labels',
    name: 'Candidate Labels',
    icon: 'moon',
    defaultValue: [],
  },
  {
    type: BooleanControl,
    dataKey: 'multi_label',
    name: 'Multi Label',
    icon: 'moon',
    defaultValue: false,
  },
]

const conversational = [
  {
    type: InputControl,
    dataKey: 'repetition_penalty',
    name: 'Repetition Penalty',
    icon: 'moon',
    defaultValue: 1.0,
  },
]

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
  summarization,
  textGeneration,
  tokenClassification,
  zeroShotClassification,
  conversational,
  textToImage,
  imageToImage,
}
