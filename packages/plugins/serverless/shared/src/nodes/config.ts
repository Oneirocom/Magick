import { cameltoTitle } from './utils'
import { DropdownControl, InputControl, triggerSocket } from '@magickml/core'
import Rete from '@magickml/rete'

/**
 * Tooltip for the HuggingFace node.
 */
export const huggingFaceNodeTooltip =
  'AI completions with a Hugging Face model.'

/**
 * Record object mapping each HuggingFace task type to a default model.
 * The keys are task types and the values are the corresponding default models.
 */
export const defaultModelsForTasks = {
  fillMask: 'bert-base-uncased',
  summarization: 't5-small',
  questionAnswering: 'distilbert-base-cased-distilled-squad',
  tableQuestionAnswering: 'google/tapas-large-finetuned-wtq',
  textClassification: 'distilbert-base-uncased-finetuned-sst-2-english',
  textGeneration: 'gpt-2',
  tokenClassification: 'dbmdz/bert-large-cased-finetuned-conll03-english',
  translation: 'Helsinki-NLP/opus-mt-en-fr',
  zeroShotClassification: 'facebook/bart-large-mnli',
  conversational: 'microsoft/DialoGPT-medium',
  sentenceSimilarity: 'sentence-transformers/stsb-roberta-large',
  featureExtraction: 'bert-base-uncased',
  automaticSpeechRecognition: 'facebook/wav2vec2-base-960h',
  audioClassification: 'hf4/audeep',
  textToSpeech: 'tts_models/en/ljspeech/tts',
  audioToAudio: 'tscholak/glow-tts-22050',
  imageClassification: 'google/vit-base-patch16-224-in21k',
  objectDetection: 'facebook/detr-resnet-50',
  imageSegmentation: 'mit-han-lab/picasso',
  textToImage: 'text2image/default',
  imageToText: 'image2text/default',
  imageToImage: 'image2image/default',
  zeroShotImageClassification: 'zeroShotImage/default',
  visualQuestionAnswering: 'visualQA/default',
  documentQuestionAnswering: 'documentQA/default',
  tabularRegression: 'tabularRegression/default',
  tabularClassification: 'tabularClassification/default',
  customTask: 'custom/default',
} as const

/**
 * Type definition for HuggingFace task types based on the keys of defaultModelsForTasks.
 */
export type HuggingFaceTaskType = keyof typeof defaultModelsForTasks

/**
 * List of supported HuggingFace task types generated from the keys of defaultModelsForTasks.
 */
export const huggingFaceTaskTypes: HuggingFaceTaskType[] = Object.keys(
  defaultModelsForTasks
) as HuggingFaceTaskType[]

/**
 * Returns a DropdownControl for specifying task types.
 */
export function getTaskTypeControl() {
  return new DropdownControl({
    name: 'Task',
    dataKey: 'taskType',
    values: huggingFaceTaskTypes.map(task => cameltoTitle(task)),
    defaultValue: cameltoTitle(huggingFaceTaskTypes[0]),
    tooltip: 'Choose an AI task',
  })
}

/**
 * Returns an InputControl for specifying the model name.
 */
export const modelControl = {
  type: InputControl,
  dataKey: 'model',
  name: 'Model ID',
  icon: 'moon',
  defaultValue: 'Default',
  tooltip: 'HugginFace model id.',
}

/**
 * Returns an Input socket for the trigger.
 */
export function getTriggerInputSocket() {
  return new Rete.Input('trigger', 'Trigger', triggerSocket, true)
}

/**
 * Returns an Output socket for the trigger.
 */
export function getTriggerOutputSocket() {
  return new Rete.Output('trigger', 'Trigger', triggerSocket)
}
