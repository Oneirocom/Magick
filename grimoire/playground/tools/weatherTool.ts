import { defineTool } from '@magickml/tools/runtime/utils'
import { z } from 'zod'

export default defineTool({
  description: 'A tool to get weather information for a given city',
  parameters: z.object({
    city: z.string(),
  }),
  execute: async args => {
    const { city } = args
    // Make an API call to get weather data for the city
    const weatherData = await fetchWeatherData(city)
    return `The current weather in ${city} is ${weatherData.description} with a temperature of ${weatherData.temperature}°C.`
  },
})
const fetchWeatherData = async (city: string) => {
  // Dummy
  return {
    description: 'Sunny',
    temperature: 23,
  }
}
