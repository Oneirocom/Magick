// DOCUMENTED
/**
 * Initializes a TextToSpeechClient client from the Google Cloud text-to-speech library.
 */
import { TextToSpeechClient } from '@google-cloud/text-to-speech'
import * as fs from 'fs'

let client: TextToSpeechClient

export async function initTextToSpeech() {
  client = new TextToSpeechClient()
}

/**
 * Accepts an input text string, a character (defaults to en-US Wavenet D), and a language code (defaults to en-US),
 * and returns a Promise that resolves to an output file with an 8-character random alphanumeric filename.
 * @param input A string of text to be synthesized.
 * @param character A string representing the name of the Wavenet voice to use.
 * @param languageCode A string representing the language code to use.
 * @returns A Promise that resolves to an output file path.
 */
export async function tts(
  input: string,
  character = 'en-US-Wavenet-D',
  languageCode = 'en-US'
) {
  // If no existing TextToSpeechClient client exists, create one
  if (!client || client === undefined) {
    client = new TextToSpeechClient()
  }

  // Set a request object for text-to-speech synthesis
  const ttsRequest = {
    input: { text: input },
    voice: {
      languageCode: languageCode,
      name: character,
    },
    audioConfig: { audioEncoding: 2 /*MP3*/ },
  }

  // Generate a random 8-character string to use as the output file name
  const fileName = makeid(8) + '.mp3'
  const outputFile = 'files/' + fileName

  // Delete file if it already exists
  if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile)
  }

  function promisify(fn) {
    return function (...args) {
      return new Promise((resolve, reject) => {
        fn(...args, (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      })
    }
  }

  // Synthesize speech and write to a file
  const [response] = await client.synthesizeSpeech(ttsRequest)
  const writeFile = promisify(fs.writeFile)
  await writeFile(outputFile, response.audioContent as string, 'binary')

  return outputFile
}

/**
 * Accepts a numerical value and returns a randomly generated string of that length, made up of random
 * uppercase and lowercase letters and digits.
 * @param length A numerical value specifying how long the output string should be.
 * @returns Returns a randomly generated string that is between 1 and (length) characters in length.
 */
function makeid(length: number) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
