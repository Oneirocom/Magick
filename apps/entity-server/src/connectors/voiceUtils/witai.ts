//@ts-nocheck
import fetch from 'node-fetch'
import { MessageResponse } from 'node-wit'

export interface WitaiOptions {
  key?: string
}

/**
 * There is an issue with wit.ai response from /speech endpoint, which returns multiple root objects. You can check the docs here: https://wit.ai/docs/http/20210928/#post__speech_link
 * This function converts response text to valid json by wrapping it in array and fixing commas.
 * @param text
 * @returns
 */
const formatWitaiResponse = (text: string): Array<MessageResponse> => {
  const fixedCommas = text.replaceAll('\n}\r\n', '},')
  const wrappedInArray = `[${fixedCommas}]`
  return JSON.parse(wrappedInArray)
}

async function extractSpeechText(
  key: string,
  audioBuffer: Buffer,
  contenttype: string
): Promise<MessageResponse> {
  const response = await fetch('https://api.wit.ai/speech', {
    method: 'post',
    body: audioBuffer,
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-type': contenttype,
    },
  })
  if (response.status !== 200)
    throw new Error(`Api error, code: ${response.status}`)

  const data = formatWitaiResponse(await response.text())

  const latestMessage = data.at(-1)
  if (!latestMessage) throw new Error(`Invalid API response`)

  return latestMessage
}

export async function resolveSpeechWithWitai(
  audioBuffer: Buffer,
  options?: WitaiOptions
): Promise<string> {
  const key = process.env.WITAI_KEY
  if (!key) throw new Error("wit.ai API key wasn't specified.")

  const contenttype =
    'audio/raw;encoding=signed-integer;bits=16;rate=48k;endian=little'
  const output = await extractSpeechText(key, audioBuffer, contenttype)

  return output.text
}
