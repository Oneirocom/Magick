// DOCUMENTED
import { CompletionHandlerInputData} from '@magickml/core'
import axios from 'axios'
import { geocodeLocation } from './shared'

/**
 * Generates the api url for the weather api for the location at given coordinates.
 *
 * @param {string} lat - The latitude of the location.
 * @param {string} lon - The longitude of the location.
 * @param {string} appId - The api key for the weather api.
 * @param {string} units - (optional) The units to get the weather in.
 *
 * @returns {string} - The url for the weather api.
 */
function generateWeatherApiUrlWithCoords(
  lat: number,
  lon: number,
  appId: string,
  units?: string
): string {
  let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${encodeURIComponent(
    lat
  )}&lon=${encodeURIComponent(lon)}&appid=${encodeURIComponent(appId)}`
  if (units) {
    url += `&units=${encodeURIComponent(units)}`
  }
  return url
}

/**
 * Makes an API request to an AI text completion service.
 *
 * @param {CompletionHandlerInputData} data - The input data for the completion API.
 * @returns {Promise<{success: boolean, result?: string | null, error?: string | null}>} - A Promise resolving to the result of the completion API call.
 */
export async function getCurrentForecast(
  data: CompletionHandlerInputData
): Promise<{
  success: boolean
  result?: object | null
  error?: string | null
  model?: string
  totalTokens?: number
}> {
  // Destructure necessary properties from the data object.
  const { node, inputs, context } = data
  const { projectId, currentSpell } = context

  // Get the units from the node inspector.
  const units = node?.data?.units as string | undefined

  // Get the city, state, and country from the inputs.
  const city = inputs['city'][0] as string
  const state = inputs?.state?.[0] as string | undefined
  const country = inputs?.country?.[0] as string | undefined

  if (!context.module.secrets) {
    throw new Error('ERROR: No secrets found')
  }

  // Get the weather api key from the secrets.
  const weatherKey = context.module.secrets!['weather_api_key']

  // Get the coordinates of the location.
  const coords = await geocodeLocation(city, weatherKey, state, country)

  // Generate the url for the weather api.
  const url = generateWeatherApiUrlWithCoords(
    coords.lat,
    coords.lon,
    weatherKey,
    units
  )

  // Make the API request and handle the response.
  try {
    const resp = await axios.get(url)

    if (resp.status === 404) {
      throw new Error('ERROR: City not found')
    }

    if (resp.status !== 200) {
      throw new Error('ERROR: ' + resp.statusText)
    }
    return { success: true, result: resp.data.list }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: err.message }
  }
}
