import request from 'request'
import fetch from 'node-fetch'

export function getAudioUrl(
  key: string,
  secretKey: string,
  character: string,
  text: string
) {
  if (character === undefined) throw new Error('Define the character voice.')
  if (key === undefined) throw new Error('Define the key you got from uberduck')
  if (character === undefined)
    throw new Error('Define the secret key you got from uberduck.')

  return new Promise(async (resolve, reject) => {
    await request(
      {
        url: 'https://api.uberduck.ai/speak',
        method: 'POST',
        body: `{"speech": "${text}","voice": "${character}"}`,
        auth: {
          user: key,
          pass: secretKey,
        },
      },
      async (erro: any, response: any, body: any) => {
        if (erro)
          throw new Error(
            'Error when making request, verify if yours params (key, secretKey, character) are correct.'
          )
        const audioResponse: string =
          'https://api.uberduck.ai/speak-status?uuid=' + JSON.parse(body).uuid
        let jsonResponse: any = false
        async function getJson(url: string) {
          let jsonResult: any = undefined
          await fetch(url)
            .then(res => res.json())
            .then(json => {
              jsonResult = json
            })
          return jsonResult
        }

        jsonResponse = await getJson(audioResponse)
        while (jsonResponse.path === null)
          jsonResponse = await getJson(audioResponse)

        resolve(jsonResponse.path)
      }
    )
  })
}
