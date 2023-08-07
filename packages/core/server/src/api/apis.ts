// DOCUMENTED
/**
 * This module provides REST APIs for Text to Speech and Image Generation.
 * @module controller/api
 */

import Koa from 'koa'
import { Route } from '../config/types'
import { tts } from '../servers/googleTextToSpeech'
import { tts_tiktalknet } from '../servers/tiktalknet'

/**
 * Retrieves a URL of the audio pronunciation of the given text input, using either Google or TikTalkNet.
 * @function
 * @async
 * @param {Koa.Context} ctx - Context object representing a RESTful HTTP request/response
 * @returns {Promise<void>} Nothing
 */
const getTextToSpeech = async (ctx: Koa.Context): Promise<void> => {
  const text = ctx.request.query.text as string
  const voice_provider = ctx.request.query.voice_provider as string
  const voice_character = ctx.request.query.voice_character as string
  const voice_endpoint = ctx.request.query.voice_endpoint as string
  let url = ''

  if (voice_provider === 'google') {
    url = await tts(text, voice_character as string)
  } else {
    url = await tts_tiktalknet(text, voice_character, voice_endpoint)
  }

  ctx.body = url
}

/**
 * Generates an image from the supplied image data.
 * @function
 * @async
 * @param {Koa.Context} ctx - Context object representing a RESTful HTTP request/response
 * @returns {Promise<void>} Nothing
 */
const image_generation = async (ctx: Koa.Context): Promise<void> => {
  const url = 'http://localhost:7860/sdapi/v1/txt2img' // Endpoint to send the image data

  // Proxy the request to the endpoint and return the response
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ctx.request.body),
  })

  const data = await response.json()
  ctx.body = data
}

// const getTokenUser = async (ctx: Koa.Context): Promise<void> => {
//   const code = ctx.request.query.code
//   console.log("id", ctx.request.query.github_client_id)
//   console.log("secret", ctx.request.query.github_client_secret)
//   const data = qs.stringify({
//     client_id: ctx.request.query.github_client_id,
//     client_secret : ctx.request.query.github_client_secret,
//     code: code
//   })

//   const reqOptions = {
//     host: "github.com",
//     port: 443,
//     path: "/login/oauth/access_token",
//     method: "POST",
//     headers: { 'content-length': data.length }
//   }

//   let body = "";

//   const sendReq = async(reqOptions, data) => {
//     return new Promise(( resolve, reject ) => {
//       const req = https.request(reqOptions, function(res) {
//         res.setEncoding('utf8')
//         res.on('data', function (chunk) { body += chunk; });
//         res.on('end', function() {
//           console.log(qs.parse(body).access_token);
//           resolve(qs.parse(body).access_token)
//         })
//         req.on('error', (err) => {
//           reject(err);
//         });
//       })

//       req.write(data);
//       req.end();
//     })

//   }

//   const token = await sendReq(reqOptions, data)

//   ctx.body=token
// }

// Export a list of REST APIs
export const apis: Route[] = [
  {
    path: '/text_to_speech',
    get: getTextToSpeech,
  },
  {
    path: '/image_generation',
    post: image_generation,
  },
  // {
  //   path: '/gettokenuser',
  //   get: getTokenUser,
  // }
]
