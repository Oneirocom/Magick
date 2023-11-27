export type ImageDimension =
  | 64
  | 128
  | 192
  | 256
  | 320
  | 384
  | 448
  | 512
  | 576
  | 640
  | 704
  | 768
  | 832
  | 896
  | 960
  | 1024
  | 1088
  | 1152
  | 1216
  | 1280
  | 1344
  | 1408
  | 1472
  | 1536

export type Pipeline =
  | 'StableDiffusionPipeline'
  | 'StableDiffusionImg2ImgPipeline'
  | 'StableDiffusionInpaintPipeline'

export type SCHEDULER =
  | 'DPMSolverMultistepScheduler'
  | 'DPMSolverMultistepSchedulerKarras'
  | 'DPMSolverMultistepSchedulerSDE'
  | 'DPMSolverMultistepSchedulerSDEKarras'
  | 'DPMSolverSinglestepScheduler'
  | 'DPMSolverSinglestepSchedulerKarras'
  | 'KDPM2DiscreteScheduler'
  | 'KDPM2DiscreteSchedulerKarras'
  | 'KDPM2AncestralDiscreteScheduler'
  | 'KDPM2AncestralDiscreteSchedulerKarras'
  | 'EulerDiscreteScheduler'
  | 'EulerAncestralDiscreteScheduler'
  | 'HeunDiscreteScheduler'
  | 'LMSDiscreteScheduler'
  | 'LMSDiscreteSchedulerKarras'
  | 'DEISMultistepScheduler'
  | 'UniPCMultistepScheduler'

export type MODEL_ID =
  | 'runwayml/stable-diffusion-v1-5'
  | 'stabilityai/stable-diffusion-xl-base-1.0'
  | 'stablediffusionapi/juggernaut-xl-v5'

export interface ModelInputs {
  prompt: string
  negative_prompt?: string
  num_inference_steps: number
  guidance_scale: number
  width: ImageDimension
  height: ImageDimension
  seed?: number
  cross_attention_kwargs?: string
}

export interface CallInputs {
  MODEL_ID: string
  PIPELINE?: Pipeline
  SCHEDULER?: SCHEDULER
  safety_checker?: boolean
  SEND_URL?: string
  SIGN_KEY?: string
  attn_procs?: string
}

export interface DiffusersInputs {
  modelInputs: ModelInputs
  callInputs: CallInputs
  extraInputs: any
}

export interface DiffusersOutputs {
  $timings: string
  $mem_usage: string
  image_base64?: string
  images_base64?: string[]
  nsfw_content_detected?: boolean
}
