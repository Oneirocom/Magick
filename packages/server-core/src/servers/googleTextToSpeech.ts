import { TextToSpeechClient } from '@google-cloud/text-to-speech'
import * as fs from 'fs'
import util from 'util'

let client: TextToSpeechClient

export async function initTextToSpeech() {
  client = new TextToSpeechClient()
}

export async function tts(
  input: string,
  character = 'en-US-Wavenet-D',
  languageCode = 'en-US'
) {
  if (!client || client === undefined) {
    client = new TextToSpeechClient()
  }

  const ttsRequest = {
    input: { text: input },
    voice: {
      languageCode: languageCode,
      name: character,
    },
    audioConfig: { audioEncoding: 2 /*MP3*/ },
  }

  const fileName = makeid(8) + '.mp3'
  const outputFile = 'files/' + fileName
  if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile)
  }

  const [response] = await client.synthesizeSpeech(ttsRequest)
  const writeFile = util.promisify(fs.writeFile)
  await writeFile(outputFile, response.audioContent as string, 'binary')
  
  return outputFile
}

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
