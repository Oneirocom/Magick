// DOCUMENTED
import { CompletionHandlerInputData, saveRequest } from '@magickml/core'
import Replicate from 'replicate'
import axios from 'axios'

/**
 * Generate a completion text based on prior chat conversation input.
 * @param data - CompletionHandlerInputData object.
 * @returns An object with success status and either a result or an error message.
 */
export async function makeTextToImageCompletion(
  data: CompletionHandlerInputData
): Promise<{
  success: boolean
  result?: string[] | null
  error?: string | null
}> {
  const { node, inputs, context } = data

  const params = {
    model: node?.data?.model as string,
    width: parseInt((node?.data?.width as string) ?? '1024'),
    height: parseInt((node?.data?.height as string) ?? '1024'),
    // num_outputs: parseInt((node?.data?.num_outputs as string) ?? '4'),
    num_inference_steps: parseInt(
      (node?.data?.num_inference_steps as string) ?? '50'
    ),
    guidance_scale: parseFloat((node?.data?.guidance_scale as string) ?? '7.5'),
    scheduler: node?.data?.scheduler ?? 'DDIM',
  }

  console.log('Parameters:', JSON.stringify(params, null, 2)) // Debugging params

  const prompt = inputs['prompt']?.[0] as string | undefined
  const negative_prompt = inputs['negative_prompt']?.[0] as string | undefined
  const num_outputs = inputs['count']?.[0] as number | undefined
  console.log('Prompt:', prompt) // Debugging prompt
  console.log('Negative Prompt:', negative_prompt) // Debugging negative prompt
  console.log('Count:', num_outputs) // Debugging count

  const cogKey = context.module.secrets!['cog_api_key']
  const replicate = new Replicate({
    auth: cogKey,
  })

  console.log('Starting prediction...') // Debugging start of prediction

  try {
    const start = Date.now()
    const output = (await replicate.run(
      'stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4',
      {
        input: {
          prompt,
          negative_prompt,
          num_outputs,
          ...params,
        },
      }
    )) as string[]

    console.log('Prediction output:', output) // Debugging prediction output

    // Save the API request details
    saveRequest({
      projectId: context.projectId,
      requestData: JSON.stringify({
        prompt: prompt,
        negative_prompt: negative_prompt,
      }),
      responseData: JSON.stringify({}),
      startTime: start,
      status: 'success',
      model: params.model,
      parameters: JSON.stringify(params),
      type: 'completion',
      provider: 'cog',
      hidden: false,
      processed: false,
      spell: context.currentSpell,
      nodeId: node.id,
      agentId: context.agent?.id || 'preview',
    })

    const imgDatas: string[] = []
    // Fetch image data for every URL and keep as base64 string
    for (const url of output) {
      try {
        const response = await axios.get(url, { responseType: 'arraybuffer' })
        const imageData = Buffer.from(response.data, 'binary').toString(
          'base64'
        )
        imgDatas.push(imageData)
      } catch (err) {
        return { success: false, error: 'Failed to fetch image' }
      }
    }

    if (output.length > 0) {
      return { success: true, result: imgDatas }
    }

    return { success: false, error: 'No result' }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: err.message }
  }
}
