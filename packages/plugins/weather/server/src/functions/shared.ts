import axios from "axios";

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
export async function geocodeLocation(
    city: string,
    appId: string,
    state?: string,
    country?: string
  ): Promise<{ lat: number; lon: number }> {
    let coords: number[] = []
    let apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      city
    )}`
    if (state) {
      apiUrl += `,${encodeURIComponent(state)},`
    } if (country) {
      apiUrl += `,${encodeURIComponent(country)}`
    }
    apiUrl += `&limit=5&appid=${encodeURIComponent(appId)}`
    try {
      const resp = await axios.get(apiUrl)
      console.log('resp', resp)
      const lat = resp.data[0].lat
      const lon = resp.data[0].lon
      coords[0] = lat
      coords[1] = lon
    } catch (error) {
      console.log('error', error)
    }
    return {
      lat: coords[0],
      lon: coords[1],
    }
  }