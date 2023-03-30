// GENERATED 
/**
 * This module provides REST APIs for Text to Speech and Image Generation.
 * @module controller/api
 */

import Koa from 'koa';
import solc from 'solc';
import fetch from 'node-fetch';
import { Route } from '../config/types';
import { tts } from '../servers/googleTextToSpeech';
import { tts_tiktalknet } from '../servers/tiktalknet';
import { ServerError } from '../utils/ServerError';

/**
 * Retrieves a URL of the audio pronunciation of the given text input, using either Google or TikTalkNet.
 * @function
 * @async
 * @param {Koa.Context} ctx - Context object representing a RESTful HTTP request/response
 * @returns {Promise<void>} Nothing
 */
const getTextToSpeech = async (ctx: Koa.Context): Promise<void> => {
  const text = ctx.request.query.text as string;
  const voice_provider = ctx.request.query.voice_provider as string;
  const voice_character = ctx.request.query.voice_character as string;
  const tiktalknet_url = ctx.request.query.tiktalknet_url as string;
  let url = '';

  if (voice_provider === 'google') {
    url = await tts(text, voice_character as string);
  } else {
    url = await tts_tiktalknet(text, voice_character, tiktalknet_url);
  }

  ctx.body = url;
};

/**
 * Generates an image from the supplied image data.
 * @function
 * @async
 * @param {Koa.Context} ctx - Context object representing a RESTful HTTP request/response
 * @returns {Promise<void>} Nothing
 */
const image_generation = async (ctx: Koa.Context): Promise<void> => {
  const url = 'http://localhost:7860/sdapi/v1/txt2img'; // Endpoint to send the image data

  // Log the request
  console.log(url);
  console.log(ctx);

  // Proxy the request to the endpoint and return the response
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ctx.request.body),
  });

  const data = await response.json();
  ctx.body = data;
};

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
];