import { TextToSpeechClient } from '@google-cloud/text-to-speech'
import * as fs from 'fs'
import util from 'util'

let client: TextToSpeechClient

export async function initTextToSpeech() {
  client = new TextToSpeechClient()
}

export async function tts(input: string, character = "en-GB-Standard-B", languageCode = 'en-GB') {
  if (!client || client === undefined) {
    client = new TextToSpeechClient()
  }

  const ttsRequest = {
    input: { text: input },
    voice: {
      languageCode: languageCode,
      name: character,
      ssmlGender: 1 /*Male*/,
    },
    audioConfig: { audioEncoding: 2 /*MP3*/ },
  }

  console.log("ttsRequest is", ttsRequest)

  const fileName = makeid(8) + '.mp3'
  const outputFile = 'files/' + fileName
  if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile)
  }

  const [response] = await client.synthesizeSpeech(ttsRequest)
  const writeFile = util.promisify(fs.writeFile)
  await writeFile(outputFile, response.audioContent as string, 'binary')
  console.log(`Audio content written to file: ${outputFile}`)
  return outputFile
}

function makeid(length: number) {
  var result = ''
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
