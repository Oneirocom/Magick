/* eslint-disable no-console */
import { latitudeApiRootUrl } from '@/config'
import { getAuthHeader } from '../../contexts/AuthProvider'

export const getEnkiPrompt = async taskName => {
  try {
    const response = await fetch(latitudeApiRootUrl + `/enki/${taskName}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        ...(await getAuthHeader()),
      },
    })

    const parsed = await response.json()

    return parsed
  } catch (err) {
    console.warn('fetch error', err)
  }
}

export const getEnkis = async () => {
  try {
    const response = await fetch(latitudeApiRootUrl + `/enki`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        ...(await getAuthHeader()),
      },
    })

    const parsed = await response.json()

    return parsed
  } catch (err) {
    console.warn('fetch error', err)
  }
}

export const postEnkiCompletion = async (taskName, inputs) => {
  try {
    const response = await fetch(
      latitudeApiRootUrl + `/enki/${taskName}/completion`,
      {
        method: 'POST',

        mode: 'cors',
        body: JSON.stringify({ inputs }),
        headers: {
          'Content-Type': 'application/json',
          ...(await getAuthHeader()),
        },
      }
    )

    const parsed = await response.json()

    return parsed
  } catch (err) {
    console.warn('fetch error', err)
  }
}
