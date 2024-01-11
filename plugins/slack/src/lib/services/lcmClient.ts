import axios, { AxiosResponse } from 'axios'

const bucket_prefix = 'https://storage.googleapis.com/sdxl-lcm'
class LCMCLient {
  private apiUrl: string
  private defaultInput: StableDiffusionLCMInput

  constructor(apiUrl: string, agentId: string) {
    this.apiUrl = apiUrl
    this.defaultInput = {
      // seed: 29070,
      width: 1024,
      height: 1024,
      prompt: '',
      scheduler: 'LCM',
      lora_scale: 0.6,
      num_outputs: 2,
      guidance_scale: 1,
      apply_watermark: true,
      negative_prompt: '',
      prompt_strength: 0.8,
      num_inference_steps: 4,
      disable_safety_checker: true,
      agent_id: agentId,
      bucket_prefix,
    }
  }

  async generateImage(
    input: Partial<StableDiffusionLCMInput>
  ): Promise<AxiosResponse<StableDiffusionResponse>> {
    const requestData = {
      input: { ...this.defaultInput, ...input },
    }

    return axios.post<StableDiffusionResponse>(this.apiUrl, requestData, {
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

type StableDiffusionLCMInput = {
  seed?: number
  width?: number
  height?: number
  prompt: string
  scheduler?: string
  lora_scale?: number
  num_outputs?: number
  guidance_scale?: number
  apply_watermark?: boolean
  negative_prompt?: string
  prompt_strength?: number
  num_inference_steps?: number
  disable_safety_checker?: boolean
  agent_id?: string
  bucket_prefix?: string
}

type StableDiffusionResponse = {
  completed_at: string
  created_at: string
  error: string | null
  id: string
  input: StableDiffusionLCMInput
  logs: string
  metrics: {
    predict_time: number
  }
  output: string[]
  started_at: string
  status: string
  urls: {
    get: string
    cancel: string
  }
  version: string
}

export default LCMCLient
