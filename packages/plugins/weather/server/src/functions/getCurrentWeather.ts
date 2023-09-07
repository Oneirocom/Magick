// DOCUMENTED
import { CompletionHandlerInputData, saveRequest } from '@magickml/core'
import axios from 'axios'

/**
 * Generates the api url for the weather api for the location at given coordinates.
 * 
 * @param {string} lat - The latitude of the location.
 * @param {string} lon - The longitude of the location.
 * @param {string} appId - The api key for the weather api.
 * 
 * @returns {string} - The url for the weather api.
 */
function generateWeatherApiUrlWithCoords(
  lat: number,
  lon: number,
  appId: string
): string {
  return `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(
    lat)}&lon=${encodeURIComponent(lon)}&appid=${encodeURIComponent(appId)}`
}

/**
 * Gets the latitude and longitude of a given location, using the OpenWeatherMap geocoding api.
 * 
 * @param {string} city - The city to get the coordinates for.
 * @param {string} appId - The api key for the weather api.
 * @param {string} state - The state of the city.
 * @param {string} country - The country of the city.
 * 
 * @returns {number[]} - The latitude and longitude of the location in an array.
 */
async function geocodeLocation(
  city: string,
  appId: string,
  state?: string,
  country?: string
): Promise<number[]> {
  const coords: number[] = []
  let apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
    city
  )}`
  if (state && country) {
    apiUrl += `,${encodeURIComponent(state)},${encodeURIComponent(country)}`
  }
  apiUrl += `&limit=5&appid=${encodeURIComponent(appId)}`
  try {
    const resp = await axios.get(apiUrl)
    const lat = resp.data[0].lat
    const lon = resp.data[0].lon
    coords[0] = lat
    coords[1] = lon
  } catch (error) {
    console.log('error', error)
  }
  return coords
}


/**
 * Generates the api url for the weather api, needing atleast the api key and city.
 * If the state and country are provided, they are added to the url.
 * 
 * @param {string} city - The city to get the weather for.
 * @param {string} appId - The api key for the weather api.
 * @param {string} state - (optional) The state to get the weather for.
 * @param {string} country - (optional, but required if state is provided. The country to get the weather for.
 * 
 * @returns {string} - The api url for the weather api.
 */
function generateWeatherApiUrl(
  city: string,
  appId: string,
  state?: string,
  country?: string
): string {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}`

  if (state && country) {
    apiUrl += `,${encodeURIComponent(state)},${encodeURIComponent(country)}`
  } else if (country) {
    apiUrl += `,${encodeURIComponent(country)}`
  }

  apiUrl += `&appid=${encodeURIComponent(appId)}`
  return apiUrl
}

/**
 * Makes an API request to an AI text completion service.
 *
 * @param {CompletionHandlerInputData} data - The input data for the completion API.
 * @returns {Promise<{success: boolean, result?: string | null, error?: string | null}>} - A Promise resolving to the result of the completion API call.
 */
export async function getCurrentWeather(
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

  console.log('getCurrentWeather', data)

  console.log('!!!!!!!!!!!inputs', inputs)

  // Get the input text prompt.
  const city = inputs['city'][0] as string

  // state
  const state = inputs?.state?.[0] as string | undefined

  // country
  const country = inputs?.country?.[0] as string | undefined

  if (!context.module.secrets) {
    throw new Error('ERROR: No secrets found')
  }

  const weatherKey = context.module.secrets!['weather_api_key']

  console.log('weatherKey', weatherKey)

  const url = generateWeatherApiUrl(city, weatherKey, state, country)

  // Make the API request and handle the response.
  try {
    const resp = await axios.get(url)

    if (resp.status === 404) {
      throw new Error('ERROR: City not found')
    }

    if (resp.status !== 200) {
      throw new Error('ERROR: ' + resp.statusText)
    }
    return { success: true, result: resp.data }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: err.message }
  }
}
