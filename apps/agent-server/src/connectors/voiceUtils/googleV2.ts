import axios, { AxiosRequestConfig } from 'axios'

/**
 * You can obtain API key here [http://www.chromium.org/developers/how-tos/api-keys](http://www.chromium.org/developers/how-tos/api-keys)
 */
export interface GoogleSpeechV2Options {
  key?: string
  lang?: string
  profanityFilter?: boolean
}

/**
 * If API key is not specified uses generic key that works out of the box.
 * If language is not specified uses ``"en-US"``
 * See [python speech recognition package](https://github.com/Uberi/speech_recognition/blob/c89856088ad81d81d38be314e3db50905481c5fe/speech_recognition/__init__.py#L850) for more details.
 * @param options
 * @returns Request config for {@link resolveSpeechWithGoogleSpeechV2}
 */
function getGoogleRequestOptions(
  options?: GoogleSpeechV2Options
): AxiosRequestConfig {
  let key = 'AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw'
  let lang = 'en-US'
  let profanityFilter = '1' // Google's default

  if (options) {
    if (options.key) key = options.key
    if (options.lang) lang = options.lang
    if (options.profanityFilter !== undefined)
      profanityFilter = options.profanityFilter ? '1' : '0'
  }

  const googleRequestOptions: AxiosRequestConfig = {
    url: `https://www.google.com/speech-api/v2/recognize?output=json&lang=${lang}&key=${key}&pFilter=${profanityFilter}`,
    headers: {
      'Content-Type': 'audio/l16; rate=48000;',
    },
    method: 'POST',
    transformResponse: [
      data => {
        const fixedData = data.replace('{"result":[]}', '')
        try {
          return JSON.parse(fixedData)
        } catch (e) {
          return { error: e }
        }
      },
    ],
  }
  return googleRequestOptions
}

/**
 * Performs speech recognition using the Google Speech Recognition API V2
 * @param audioBuffer PCM mono audio with 48kHz
 * @param options
 * @returns Recognized text from speech
 */
export async function resolveSpeechWithGoogleSpeechV2(
  audioBuffer: Buffer,
  options: GoogleSpeechV2Options = { lang: 'en-US' }
): Promise<string> {
  const requestOptions = getGoogleRequestOptions(options)
  requestOptions.data = audioBuffer
  const response = await axios(requestOptions)
  if (response.data.error)
    throw new Error(`Google speech api error: ${JSON.stringify(response.data)}`)
  return response.data.result[0].alternative[0].transcript
}
