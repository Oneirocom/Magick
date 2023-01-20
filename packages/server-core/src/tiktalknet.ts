import axios from 'axios'
import * as fs from 'fs'
import { createWriteStream } from 'fs'

export async function tts_tiktalknet(
  text: string,
  voice: string,
  tiktalknet_url: string
) {
  if (!tiktalknet_url || tiktalknet_url?.length <= 0) return ''

  const resp = await axios.get(tiktalknet_url, {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
    responseType: 'stream',
    params: {
      voice: voice,
      s: text,
    },
  })
  const fileName = makeid(8) + '.wav'
  const outputFile = 'files/' + fileName
  const writer = createWriteStream(outputFile)
  resp.data.pipe(writer)
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
