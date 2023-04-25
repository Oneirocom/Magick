// UNDOCUMENTED 
import {
  CompletionHandlerInputData,
  Event,
  saveRequest
} from '@magickml/core'
import axios from 'axios'


async function callTextToSpeechApi(text: string, voice_id: string, stability: number, similarity_boost: number, apiKey: string) {
  const apiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`
  const requestBody = {
    text,
    voice_settings: {
      stability,
      similarity_boost
    }
  }

  const response = await axios.post(apiUrl, requestBody, {
    headers: {
      'xi-api-key': apiKey
    },
    responseType: 'arraybuffer'
  });

  return response.data;
}


/**
 * Generate speech from text.
 * @param data - CompletionHandlerInputData object.
 * @returns An object with success status and either a result or an error message.
 */
export async function textToSpeech(
  data: CompletionHandlerInputData
): Promise<{ success: boolean, result?: ArrayBuffer | null, error?: string | null }> {
  const { node, inputs, context } = data

  const settings = {
    stability: parseFloat(inputs['stability']?.[0] as string ?? "0.0"),
    similarity_boost: parseFloat(inputs['similarity_boost']?.[0] as string ?? "0.0"),
    voice_id: inputs['voice_id']?.[0] as string
  }

  const text = inputs['input']?.[0] as string

  // @ts-ignore
  const key = context.module.secrets['elevenlabs_api_key'] as string
  try {
    const audioBuffer = await callTextToSpeechApi(text, 'MF3mGyEYCl7XYWbV9V6O', settings.stability, settings.similarity_boost, key);

    if (audioBuffer) {
      return { success: true, result: audioBuffer }
    }
    return { success: false, error: 'No result' }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}