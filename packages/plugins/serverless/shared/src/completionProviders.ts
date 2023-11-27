import {
  CompletionProvider,
  anySocket,
  arraySocket,
  audioSocket,
  imageSocket,
  numberSocket,
  objectSocket,
  stringSocket,
} from '@magickml/core'

export const completionProviders: CompletionProvider[] = [
  // // fillMask
  // {
  //   type: 'huggingface',
  //   subtype: 'fillMask',
  //   inputs: [
  //     {
  //       socket: 'input',
  //       name: 'Input',
  //       type: stringSocket,
  //     },
  //   ],
  //   outputs: [
  //     {
  //       socket: 'output',
  //       name: 'Output',
  //       type: arraySocket,
  //     },
  //   ],
  //   models: ['huggingface'],
  // },
  // // summarization
  // {
  //   type: 'huggingface',
  //   subtype: 'summarization',
  //   inputs: [
  //     {
  //       socket: 'input',
  //       name: 'Input',
  //       type: stringSocket,
  //     },
  //   ],
  //   outputs: [
  //     {
  //       socket: 'output',
  //       name: 'Output',
  //       type: stringSocket,
  //     },
  //   ],
  //   models: ['huggingface'],
  // },
  // // questionAnswering
  // {
  //   type: 'huggingface',
  //   subtype: 'questionAnswering',
  //   inputs: [
  //     {
  //       socket: 'question',
  //       name: 'question',
  //       type: stringSocket,
  //     },
  //     {
  //       socket: 'context',
  //       name: 'Context',
  //       type: stringSocket,
  //     },
  //   ],
  //   outputs: [
  //     {
  //       socket: 'answer',
  //       name: 'Answer',
  //       type: stringSocket,
  //     },
  //     {
  //       socket: 'score',
  //       name: 'Score',
  //       type: numberSocket,
  //     },
  //     {
  //       socket: 'start',
  //       name: 'Start',
  //       type: numberSocket,
  //     },
  //     {
  //       socket: 'end',
  //       name: 'End',
  //       type: numberSocket,
  //     },
  //   ],
  //   models: ['huggingface'],
  // },
  // // tableQuestionAnswering
  // {
  //   type: 'huggingface',
  //   subtype: 'tableQuestionAnswering',
  //   inputs: [
  //     {
  //       socket: 'question',
  //       name: 'question',
  //       type: stringSocket,
  //     },
  //     {
  //       socket: 'table',
  //       name: 'table',
  //       type: objectSocket,
  //     },
  //   ],
  //   outputs: [
  //     {
  //       socket: 'answer',
  //       name: 'Answer',
  //       type: stringSocket,
  //     },
  //     {
  //       socket: 'aggregator',
  //       name: 'Aggregator',
  //       type: stringSocket,
  //     },
  //     {
  //       socket: 'coordinates',
  //       name: 'Coordinates',
  //       type: arraySocket,
  //     },
  //     {
  //       socket: 'cells',
  //       name: 'Cells',
  //       type: arraySocket,
  //     },
  //   ],
  //   models: ['huggingface'],
  // },
  // // textClassification
  // {
  //   type: 'huggingface',
  //   subtype: 'textClassification',
  //   inputs: [
  //     {
  //       socket: 'input',
  //       name: 'Input',
  //       type: stringSocket,
  //     },
  //   ],
  //   outputs: [
  //     {
  //       socket: 'label',
  //       name: 'Label',
  //       type: stringSocket,
  //     },
  //     {
  //       socket: 'score',
  //       name: 'Score',
  //       type: numberSocket,
  //     },
  //   ],
  //   models: ['huggingface'],
  // },
  // // textGeneration
  // {
  //   type: 'huggingface',
  //   subtype: 'textGeneration',
  //   inputs: [
  //     {
  //       socket: 'input',
  //       name: 'Input',
  //       type: stringSocket,
  //     },
  //   ],
  //   outputs: [
  //     {
  //       socket: 'output',
  //       name: 'Output',
  //       type: stringSocket,
  //     },
  //   ],
  //   models: ['huggingface'],
  // },
  // // tokenClassification
  // {
  //   type: 'huggingface',
  //   subtype: 'tokenClassification',
  //   inputs: [
  //     {
  //       socket: 'input',
  //       name: 'Input',
  //       type: stringSocket,
  //     },
  //   ],
  //   outputs: [
  //     {
  //       socket: 'entities',
  //       name: 'Entities',
  //       type: arraySocket,
  //     },
  //   ],
  //   models: ['huggingface'],
  // },
  // // translation
  // {
  //   type: 'huggingface',
  //   subtype: 'translation',
  //   inputs: [
  //     {
  //       socket: 'input',
  //       name: 'Input',
  //       type: stringSocket,
  //     },
  //   ],
  //   outputs: [
  //     {
  //       socket: 'output',
  //       name: 'Output',
  //       type: stringSocket,
  //     },
  //   ],
  //   models: ['huggingface'],
  // },
  // // zeroShotClassification
  // {
  //   type: 'huggingface',
  //   subtype: 'zeroShotClassification',
  //   inputs: [
  //     {
  //       socket: 'input',
  //       name: 'Input',
  //       type: stringSocket,
  //     },
  //   ],
  //   outputs: [
  //     {
  //       socket: 'output',
  //       name: 'Output',
  //       type: arraySocket,
  //     },
  //   ],
  //   models: ['huggingface'],
  // },
  // // conversational
  // {
  //   type: 'huggingface',
  //   subtype: 'conversational',
  //   inputs: [
  //     {
  //       socket: 'input',
  //       name: 'Input',
  //       type: stringSocket,
  //     },
  //     {
  //       socket: 'generated_responses',
  //       name: 'Generated Responses',
  //       type: arraySocket,
  //     },
  //     {
  //       socket: 'past_user_inputs',
  //       name: 'Past User Inputs',
  //       type: arraySocket,
  //     },
  //   ],
  //   outputs: [
  //     {
  //       socket: 'output',
  //       name: 'Output',
  //       type: stringSocket,
  //     },
  //     {
  //       socket: 'warnings',
  //       name: 'Warnings',
  //       type: arraySocket,
  //     },
  //   ],
  //   models: ['huggingface'],
  // },
  // // sentenceSimilarity
  // {
  //   type: 'huggingface',
  //   subtype: 'sentenceSimilarity',
  //   inputs: [
  //     {
  //       socket: 'sentences',
  //       name: 'Sentences',
  //       type: arraySocket,
  //     },
  //   ],
  //   outputs: [
  //     {
  //       socket: 'scores',
  //       name: 'Scores',
  //       type: arraySocket,
  //     },
  //   ],
  //   models: ['huggingface'],
  // },
  // // featureExtraction
  // {
  //   type: 'huggingface',
  //   subtype: 'featureExtraction',
  //   inputs: [
  //     {
  //       socket: 'input',
  //       name: 'Input',
  //       type: stringSocket,
  //     },
  //   ],
  //   outputs: [
  //     {
  //       socket: 'output',
  //       name: 'Output',
  //       type: arraySocket,
  //     },
  //   ],
  //   models: ['huggingface'],
  // },
  // // automaticSpeechRecognition
  // {
  //   type: 'huggingface',
  //   subtype: 'automaticSpeechRecognition',
  //   inputs: [
  //     {
  //       socket: 'input',
  //       name: 'Input',
  //       type: audioSocket,
  //     },
  //   ],
  //   outputs: [
  //     {
  //       socket: 'output',
  //       name: 'Output',
  //       type: stringSocket,
  //     },
  //   ],
  //   models: ['huggingface'],
  // },
  // // audioClassification
  // {
  //   type: 'huggingface',
  //   subtype: 'audioClassification',
  //   inputs: [
  //     {
  //       socket: 'input',
  //       name: 'Input',
  //       type: audioSocket,
  //     },
  //   ],
  //   outputs: [
  //     {
  //       socket: 'output',
  //       name: 'Output',
  //       type: arraySocket,
  //     },
  //   ],
  //   models: ['huggingface'],
  // },

  // // TEXT TO SPEECH
  // // AUDIO TO AUDIO

  // // imageClassification
  // {
  //   type: 'huggingface',
  //   subtype: 'imageClassification',
  //   inputs: [
  //     {
  //       socket: 'input',
  //       name: 'Input',
  //       type: imageSocket,
  //     },
  //   ],
  //   outputs: [
  //     {
  //       socket: 'output',
  //       name: 'Output',
  //       type: arraySocket,
  //     },
  //   ],
  //   models: ['huggingface'],
  // },
  // // objectDetection
  // {
  //   type: 'huggingface',
  //   subtype: 'objectDetection',
  //   inputs: [
  //     {
  //       socket: 'input',
  //       name: 'Input',
  //       type: imageSocket,
  //     },
  //   ],
  //   outputs: [
  //     {
  //       socket: 'output',
  //       name: 'Output',
  //       type: objectSocket,
  //     },
  //   ],
  //   models: ['huggingface'],
  // },
  // // imageSegmentation
  // {
  //   type: 'huggingface',
  //   subtype: 'imageSegmentation',
  //   inputs: [
  //     {
  //       socket: 'input',
  //       name: 'Input',
  //       type: imageSocket,
  //     },
  //   ],
  //   outputs: [
  //     {
  //       socket: 'output',
  //       name: 'Output',
  //       type: arraySocket,
  //     },
  //   ],
  //   models: ['huggingface'],
  // },
  // // textToImage
  // {
  //   type: 'huggingface',
  //   subtype: 'textToImage',
  //   inputs: [
  //     {
  //       socket: 'prompt',
  //       name: 'Prompt',
  //       type: stringSocket,
  //     },
  //   ],
  //   outputs: [
  //     {
  //       socket: 'output',
  //       name: 'Output',
  //       type: imageSocket,
  //     },
  //   ],
  //   models: ['huggingface'],
  // },
  // // imageToText
  // {
  //   type: 'huggingface',
  //   subtype: 'imageToText',
  //   inputs: [
  //     {
  //       socket: 'input',
  //       name: 'Input',
  //       type: imageSocket,
  //     },
  //   ],
  //   outputs: [
  //     {
  //       socket: 'output',
  //       name: 'Output',
  //       type: stringSocket,
  //     },
  //   ],
  //   models: ['huggingface'],
  // },
  // // imageToImage
  // {
  //   type: 'huggingface',
  //   subtype: 'imageToImage',
  //   inputs: [
  //     {
  //       socket: 'input',
  //       name: 'Input',
  //       type: imageSocket,
  //     },
  //   ],
  //   outputs: [
  //     {
  //       socket: 'output',
  //       name: 'Output',
  //       type: imageSocket,
  //     },
  //   ],
  //   models: ['huggingface'],
  // },

  // // ZERO SHOT IMAGE CLASSIFICATION

  // // visualQuestionAnswering
  // {
  //   type: 'huggingface',
  //   subtype: 'visualQuestionAnswering',
  //   inputs: [
  //     {
  //       socket: 'question',
  //       name: 'Question',
  //       type: stringSocket,
  //     },
  //     {
  //       socket: 'image',
  //       name: 'Image',
  //       type: imageSocket,
  //     },
  //   ],
  //   outputs: [
  //     {
  //       socket: 'answer',
  //       name: 'Answer',
  //       type: stringSocket,
  //     },
  //     {
  //       socket: 'score',
  //       name: 'Score',
  //       type: numberSocket,
  //     },
  //   ],
  //   models: ['huggingface'],
  // },
  // // documentQuestionAnswering
  // {
  //   type: 'huggingface',
  //   subtype: 'documentQuestionAnswering',
  //   inputs: [
  //     {
  //       socket: 'question',
  //       name: 'Question',
  //       type: stringSocket,
  //     },
  //     {
  //       socket: 'image',
  //       name: 'Context',
  //       type: stringSocket,
  //     },
  //   ],
  //   outputs: [
  //     {
  //       socket: 'answer',
  //       name: 'Answer',
  //       type: stringSocket,
  //     },
  //     {
  //       socket: 'score',
  //       name: 'Score',
  //       type: numberSocket,
  //     },
  //     {
  //       socket: 'start',
  //       name: 'Start',
  //       type: numberSocket,
  //     },
  //     {
  //       socket: 'end',
  //       name: 'End',
  //       type: numberSocket,
  //     },
  //   ],
  //   models: ['huggingface'],
  // },
  // // tabularRegression
  // {
  //   type: 'huggingface',
  //   subtype: 'tabularRegression',
  //   inputs: [
  //     {
  //       socket: 'input',
  //       name: 'Input',
  //       type: arraySocket,
  //     },
  //   ],
  //   outputs: [
  //     {
  //       socket: 'output',
  //       name: 'Output',
  //       type: arraySocket,
  //     },
  //   ],
  //   models: ['huggingface'],
  // },

  // // TABULAR CLASSIFICATION

  // // customTask
  // {
  //   type: 'huggingface',
  //   subtype: 'customTask',
  //   inputs: [
  //     {
  //       socket: 'input',
  //       name: 'Input',
  //       type: anySocket,
  //     },
  //   ],
  //   outputs: [
  //     {
  //       socket: 'output',
  //       name: 'Output',
  //       type: anySocket,
  //     },
  //   ],
  //   models: ['huggingface'],
  // },
]
