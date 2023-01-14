process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import axios from 'axios'

//Model Request using the Hugging Face API (models can be found at -> https://huggingface.co/models)
export async function MakeModelRequest(
  inputs: any,
  model: any,
  parameters = {},
  options = { use_cache: false, wait_for_model: true }
) {
  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      { inputs, parameters, options },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
      }
    )
    return await { sucess: true, data: response.data }
  } catch (err) {
    console.error(err)
    return { success: false }
  }
}
