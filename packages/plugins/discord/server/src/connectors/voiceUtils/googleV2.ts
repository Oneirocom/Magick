// DOCUMENTED 
import axios, { AxiosRequestConfig } from 'axios';

/**
 * Interface for Google Speech V2 options.
 */
export interface GoogleSpeechV2Options {
  key?: string;
  lang?: string;
  profanityFilter?: boolean;
}

/**
 * Generates the request options needed for the Google Speech Recognition API V2.
 * 
 * @param options - Optional configuration for the request.
 * @returns An AxiosRequestConfig object to be used with resolveSpeechWithGoogleSpeechV2.
 */
function getGoogleRequestOptions(
  options?: GoogleSpeechV2Options
): AxiosRequestConfig {
  // Set default values
  let key = 'AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw';
  let lang = 'en-US';
  let profanityFilter = '1';

  // Override default values if provided
  if (options) {
    if (options.key) key = options.key;
    if (options.lang) lang = options.lang;
    if (options.profanityFilter !== undefined)
      profanityFilter = options.profanityFilter ? '1' : '0';
  }

  // Construct the request options object
  const googleRequestOptions: AxiosRequestConfig = {
    url: `https://www.google.com/speech-api/v2/recognize?output=json&lang=${lang}&key=${key}&pFilter=${profanityFilter}`,
    headers: {
      'Content-Type': 'audio/l16; rate=48000;',
    },
    method: 'POST',
    transformResponse: [
      data => {
        const fixedData = data.replace('{"result":[]}', '');
        try {
          return JSON.parse(fixedData);
        } catch (e) {
          return { error: e };
        }
      },
    ],
  };

  return googleRequestOptions;
}

/**
 * Performs speech recognition using the Google Speech Recognition API V2.
 * 
 * @param audioBuffer - The audio buffer containing PCM mono audio with a 48kHz sample rate.
 * @param options - Optional configuration for the request.
 * @returns A Promise that resolves to a string containing the recognized text from the speech.
 */
export async function resolveSpeechWithGoogleSpeechV2(
  audioBuffer: Buffer,
  options: GoogleSpeechV2Options = { lang: 'en-US' }
): Promise<string> {
  // Obtain the API request options
  const requestOptions = getGoogleRequestOptions(options);
  requestOptions.data = audioBuffer;

  // Perform the API request
  const response = await axios(requestOptions);

  // Handle any errors
  if (response.data.error) {
    throw new Error(
      `Google speech api error: ${JSON.stringify(response.data)}`
    );
  }

  // Return the text result of the speech recognition
  return response.data.result[0].alternative[0].transcript;
}