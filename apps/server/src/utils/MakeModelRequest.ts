import { HF_API_KEY } from '@magickml/engine'
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
          Authorization: `Bearer ${HF_API_KEY}`,
        },
      }
    )
    return await { sucess: true, data: response.data }
  } catch (err) {
    console.error(err)
    return { success: false }
  }
}
