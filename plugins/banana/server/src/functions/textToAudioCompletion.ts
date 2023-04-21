// UNDOCUMENTED
import { CompletionHandlerInputData, saveRequest } from '@magickml/core'
import axios from 'axios'
import { BANANA_ENDPOINT } from '../constants'
import { run } from '@banana-dev/banana-dev'
import { createClient } from '@supabase/supabase-js'

/**
 * Makes an request to a riffusion completion service.
 *
 * @param {CompletionHandlerInputData} data - The input data for the completion API.
 * @returns {Promise<{success: boolean, result?: string | null, error?: string | null}>} - A Promise resolving to the result of the completion API call.
 */
export async function textToAudioCompletion(
  data: CompletionHandlerInputData
): Promise<{
  success: boolean
  result?: Object | null
  error?: string | null
}> {
  // Destructure necessary properties from the data object.
  const { node, inputs, context } = data
  const { projectId, currentSpell } = context

  // Set the current spell for record keeping.
  const spell = currentSpell
  // Get the input text prompts.
  console.log('inputs are', inputs)
  const prompt = inputs['prompt'][0]
  const bucket_name = node?.data?.bucket_name as string
  const supabase_url = node?.data?.supabase_url as string

  const modelInputs = {
    prompt,
  }

  // create supabase new client
  const supabase = createClient(
    supabase_url,
    // @ts-ignore
    context.module.secrets['riffusion_supabase_key']
  )

  // Make the API request and handle the response.
  try {
    const start = Date.now()
    type ModelOutput = {
      id: string
      message: string
      created: number
      apiVersion: string
      modelOutputs: {
        image_base64: string
        audio_base64: string
      }[]
    }

    const outputs = (await run(
      // @ts-ignore
      context.module.secrets['banana_api_key'],
      // @ts-ignore
      context.module.secrets['banana_riffusion_key'],
      modelInputs
    )) as ModelOutput

    console.log(outputs)

    // Save the request data for future reference.
    saveRequest({
      projectId: projectId,
      requestData: JSON.stringify(modelInputs),
      responseData: JSON.stringify(outputs),
      startTime: start,
      statusCode: 200,
      status: 'success',
      model: 'riffusion',
      parameters: JSON.stringify(modelInputs),
      type: 'completion',
      provider: 'banana',
      totalTokens: 0,
      hidden: false,
      processed: false,
      spell,
      nodeId: node.id as number,
    })

    // Upload the audio to Supabase bucket
    const audio_base64 = outputs.modelOutputs[0].audio_base64
    const buffer = Buffer.from(audio_base64, 'base64')
    const fileName = `audio-${Date.now()}.mp3`
    const { error: uploadError, data } = await supabase.storage
      .from(bucket_name)
      .upload(fileName, buffer, { contentType: 'audio/wav' })

    if (uploadError) {
      console.error(uploadError)
      return { success: false, error: uploadError.message }
    }

    return {
      success: true,
      result: `${supabase_url}/storage/v1/object/public/${bucket_name}/${data.path}`,
    }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: err.message }
  }
}
