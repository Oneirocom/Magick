import { latitudeApiRootUrl } from '@/config'
import axios from 'axios'
import { getAuthHeader } from '../../contexts/AuthProvider'

export const getModels = async () => {
  try {
    const response = await fetch(latitudeApiRootUrl + '/text/models', {
      method: 'GET',
      headers: {
        ...(await getAuthHeader()),
      },
    })
    const result = await response.json()
    return result
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('fetch error', err)
  }
}

type CompletionBody = {
  prompt: string,
  modelName: string,
  temperature: number,
  maxTokens: number,
  topP: number,
  frequencyPenalty: number,
  presencePenalty: number,
  stop: string[]
}

export const completion = async ({ modelName,
  prompt,
  stop,
  maxTokens,
  temperature,
  topP,
  frequencyPenalty,
  presencePenalty
}: CompletionBody) => {
  try {
    const filteredStop = stop.filter ? stop.filter(function (el: any) {
      return el != null && el !== undefined && el.length > 0
    }) : stop

    const resp = await axios.post(
      `${process.env.REACT_APP_API_URL ??
      process.env.API_URL ??
      'https://localhost:8001'
      }/text_completion`,
      {
        prompt: prompt,
        modelName: modelName,
        temperature: temperature,
        maxTokens: maxTokens,
        topP: topP,
        frequencyPenalty: frequencyPenalty,
        presencePenalty: presencePenalty,
        stop: filteredStop,
      }
    )

    const result = await resp.data
    return result.choice.text
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('fetch error', err)
  }
}
