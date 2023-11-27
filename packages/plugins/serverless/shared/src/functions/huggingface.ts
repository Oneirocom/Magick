// DOCUMENTED
import { saveRequest } from '@magickml/core'
import { HuggingFaceClient } from './hf'
import { HFTask } from '../types'

type Provider = 'huggingface' | 'replicate' | 'runpod'

/**
 * Generate a completion text based on prior chat conversation input.
 * @param data - CompletionHandlerInputData object.
 * @returns An object with success status and either a result or an error message.
 */
export async function makeServerlessCompletion(data: {
  provider: string
  task: string
  inputs: any
  token: string
  model: string
}): Promise<{
  success: boolean
  result?: any
  error?: string | null
  model?: string
  totalTokens?: number
}> {
  try {
    const start = Date.now()
    console.log('start', start)
    const response = await huggingface({
      taskType: data.task,
      model: data.model,
      inputs: data.inputs,
      token: data.token,
    })
    const end = Date.now()

    console.log('response', response)

    return {
      success: true,
      result: response,
    }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: err.message }
  }
}

const huggingface = async (task: HFTask) => {
  const hf = new HuggingFaceClient(task.token)
  console.log('task', task)

  switch (task.taskType) {
    case 'fillMask':
      return await hf.fillMask({ ...task })
    case 'summarization':
      return await hf.summarization({ ...task })
    case 'questionAnswering':
      return await hf.questionAnswering({ ...task })
    // case 'tableQuestionAnswering':
    // return hf.tableQuestionAnswering({ ...task })

    case 'textClassification':
      return hf.textClassification({ ...task })
    case 'textGeneration':
      return hf.textGeneration({ ...task })
    case 'tokenClassification':
      return hf.tokenClassification({ ...task })
    case 'translation':
      return hf.translation({ ...task })

    // case 'zeroShotClassification':
    //   return hf.zeroShotClassification({ ...task })
    // case 'conversational':
    //   return hf.conversational({ ...task })
    // case 'sentenceSimilarity':
    //   return hf.sentenceSimilarity({ ...task })
    // case 'featureExtraction':
    //   return hf.featureExtraction({ ...task })

    // case 'automaticSpeechRecognition':
    //   return hf.automaticSpeechRecognition({ ...task })
    // case 'audioClassification':
    //   return hf.audioClassification({ ...task })
    // case 'textToSpeech':
    //   return hf.textToSpeech({ ...task })
    // case 'audioToAudio':
    //   return hf.audioToAudio({ ...task })

    // case 'imageClassification':
    //   return hf.imageClassification({ ...task })
    // case 'objectDetection':
    //   return hf.objectDetection({ ...task })
    // case 'imageSegmentation':
    //   return hf.imageSegmentation({ ...task })
    // case 'textToImage':
    //   return hf.textToImage({ ...task })

    // case 'imageToText':
    //   return hf.imageToText({ ...task })
    // case 'imageToImage':
    //   return hf.imageToImage({ ...task })
    // case 'zeroShotImageClassification':
    //   return hf.zeroShotImageClassification({ ...task })
    // case 'visualQuestionAnswering':
    //   return hf.visualQuestionAnswering({ ...task })

    // case 'documentQuestionAnswering':
    //   return hf.documentQuestionAnswering({ ...task })
    // case 'tabularRegression':
    //   return hf.tabularRegression({ ...task })
    // case 'tabularClassification':
    //   return hf.tabularClassification({ ...task })
    // case 'customRequest':
    //   return hf.customRequest({ ...task })

    default:
      throw new Error('Invalid task type')
  }
}
