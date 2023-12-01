// DOCUMENTED
import axios from 'axios'
import * as fs from 'fs'

/**
 * Fetches synthesized speech from tiktalk.net website and stores it in a file.
 * @param text - The text to be converted to speech.
 * @param voice - The voice to use.
 * @param voice_endpoint - The URL of the tiktalk.net API endpoint.
 * @returns The path of the output file containing the synthesized speech.
 */
export async function tts_tiktalknet(
  text: string,
  voice: string,
  voice_endpoint: string
): Promise<string> {
  // Check if the provided URL is valid
  if (!voice_endpoint || voice_endpoint.length <= 0) return ''

  // Fetch the speech synthesis stream
  const resp = await axios.get(voice_endpoint, {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
    responseType: 'stream',
    params: {
      voice: voice,
      s: text,
    },
  })

  // Generate an output file name and path
  const fileName = makeid(8) + '.wav'
  const outputFile = 'files/' + fileName

  // Create a stream writer and pipe the response data to it
  const writer = fs.createWriteStream(outputFile)
  resp.data.pipe(writer)

  // Error handling and file writing completion
  let error: any = null
  await new Promise((resolve, reject) => {
    writer.on('error', err => {
      error = err
      writer.close()
      reject(err)
    })
    writer.on('close', () => {
      if (!error) {
        resolve(true)
      }
      reject(error)
    })
  })

  return outputFile
}

/**
 * Generates a random alphanumeric string of the specified length.
 * @param length - The length of the string to generate.
 * @returns A random alphanumeric string.
 */
function makeid(length: number): string {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length

  // Generate the random string
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}
