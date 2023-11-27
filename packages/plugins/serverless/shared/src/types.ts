export interface HFTask {
  taskType: string
  model: string
  inputs: any
  token: string
  parameters?: any
}

type Pipeline =
  | 'StableDiffusionPipeline'
  | 'StableDiffusionImg2ImgPipeline'
  | 'StableDiffusionInpaintPipeline'

interface ModelInputs {
  prompt: string
  num_inference_steps: number
  guidance_scale: number
  width: number
  height: number
  seed?: number
}

interface CallInputs {
  MODEL_ID: string
  PIPELINE?: Pipeline
  SCHEDULER?: string
  safety_checker?: boolean
  SEND_URL?: string
  SIGN_KEY?: string
}

interface DiffusersInputs {
  modelInputs: ModelInputs
  callInputs: CallInputs
}
