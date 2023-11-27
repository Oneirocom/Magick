import {
  BooleanControl,
  DropdownControl,
  InputControl,
  triggerSocket,
} from '@magickml/core'
import Rete from '@magickml/rete'
import {
  CallInputs,
  DiffusersInputs,
  MODEL_ID,
  ModelInputs,
  Pipeline,
  SCHEDULER,
} from '../types'
import { ImageDimension } from '../types'

/**
 * Returns an Input socket for the trigger.
 */
export function getTriggerInputSocket() {
  return new Rete.Input('trigger', 'Trigger', triggerSocket, true)
}

/**
 * Returns an Output socket for the trigger.
 */
export function getTriggerOutputSocket() {
  return new Rete.Output('trigger', 'Trigger', triggerSocket)
}

export const modelIDs: Record<MODEL_ID, string> = {
  'runwayml/stable-diffusion-v1-5': 'Stable Diffusion v1.5',
  'stabilityai/stable-diffusion-xl-base-1.0': 'Stable Diffusion XL Base 1.0',
  'stablediffusionapi/juggernaut-xl-v5': 'Juggernaut XL v5',
}

export const imageDimensions: Record<ImageDimension, string> = {
  64: '64',
  128: '128',
  192: '192',
  256: '256',
  320: '320',
  384: '384',
  448: '448',
  512: '512',
  576: '576',
  640: '640',
  704: '704',
  768: '768',
  832: '832',
  896: '896',
  960: '960',
  1024: '1024',
  1088: '1088',
  1152: '1152',
  1216: '1216',
  1280: '1280',
  1344: '1344',
  1408: '1408',
  1472: '1472',
  1536: '1536',
}

export const pipelines: Record<Pipeline, string> = {
  StableDiffusionPipeline: 'Text to Image',
  StableDiffusionImg2ImgPipeline: 'Image to Image',
  StableDiffusionInpaintPipeline: 'Inpainting',
}

export const schedulers: Record<SCHEDULER, string> = {
  DPMSolverMultistepScheduler: 'DPM Solver Multistep Scheduler',
  DPMSolverMultistepSchedulerKarras: 'DPM Solver Multistep Scheduler Karras',
  DPMSolverMultistepSchedulerSDE: 'DPM Solver Multistep Scheduler SDE',
  DPMSolverMultistepSchedulerSDEKarras:
    'DPM Solver Multistep Scheduler SDE Karras',
  DPMSolverSinglestepScheduler: 'DPM Solver Singlestep Scheduler',
  DPMSolverSinglestepSchedulerKarras: 'DPM Solver Singlestep Scheduler Karras',
  KDPM2DiscreteScheduler: 'K DPM2 Discrete Scheduler',
  KDPM2DiscreteSchedulerKarras: 'K DPM2 Discrete Scheduler Karras',
  KDPM2AncestralDiscreteScheduler: 'K DPM2 Ancestral Discrete Scheduler',
  KDPM2AncestralDiscreteSchedulerKarras:
    'K DPM2 Ancestral Discrete Scheduler Karras',
  EulerDiscreteScheduler: 'Euler Discrete Scheduler',
  EulerAncestralDiscreteScheduler: 'Euler Ancestral Discrete Scheduler',
  HeunDiscreteScheduler: 'Heun Discrete Scheduler',
  LMSDiscreteScheduler: 'LMS Discrete Scheduler',
  LMSDiscreteSchedulerKarras: 'LMS Discrete Scheduler Karras',
  DEISMultistepScheduler: 'DEIS Multistep Scheduler',
  UniPCMultistepScheduler: 'Uni PC Multistep Scheduler',
}

export const getModelInputsControls = (defaults: Partial<ModelInputs> = {}) => {
  return [
    new InputControl({
      dataKey: 'negative_prompt',
      name: 'Negative Prompt',
      defaultValue: defaults.negative_prompt ?? '',
    }),
    new InputControl({
      dataKey: 'num_inference_steps',
      name: 'Number of Inference Steps',
      defaultValue: defaults.num_inference_steps ?? '25',
    }),
    new InputControl({
      dataKey: 'guidance_scale',
      name: 'Guidance Scale',
      defaultValue: defaults.guidance_scale ?? '7.5',
    }),
    new DropdownControl({
      dataKey: 'width',
      name: 'Width',
      values: Object.values(imageDimensions).map(String),
      defaultValue: String(defaults.width ?? imageDimensions[512]),
    }),
    new DropdownControl({
      dataKey: 'height',
      name: 'Height',
      values: Object.values(imageDimensions).map(String),
      defaultValue: String(defaults.height ?? imageDimensions[512]),
    }),
    new InputControl({
      dataKey: 'seed',
      name: 'Seed (-1 or empty for random)',
      defaultValue: defaults.seed ?? '-1',
    }),
    new InputControl({
      dataKey: 'seed',
      name: 'Seed (-1 or empty for random)',
      defaultValue: defaults.seed ?? '-1',
    }),
    // new InputControl({
    //   dataKey: 'cross_attention_kwargs',
    //   name: 'Lora keywords',
    //   defaultValue: defaults.cross_attention_kwargs ?? '',
    // }),
  ]
}

export const getCallInputsControls = (defaults: Partial<CallInputs> = {}) => {
  return [
    // new DropdownControl({
    //   dataKey: 'MODEL_ID',
    //   name: 'Model',
    //   values: Object.keys(modelIDs),
    //   defaultValue: modelIDs['runwayml/stable-diffusion-v1-5'],
    // }),
    new InputControl({
      dataKey: 'MODEL_ID',
      name: 'Model ID',
      defaultValue: defaults.MODEL_ID ?? Object.keys(modelIDs)[0],
    }),

    new DropdownControl({
      dataKey: 'PIPELINE',
      name: 'Pipeline',
      values: Object.keys(pipelines),
      defaultValue: defaults.PIPELINE ?? '',
    }),
    new DropdownControl({
      dataKey: 'SCHEDULER',
      name: 'Scheduler',
      values: Object.keys(schedulers),
      defaultValue: defaults.SCHEDULER ?? '',
    }),
    // new InputControl({
    //   dataKey: 'attn_procs',
    //   name: 'Lora URL',
    //   defaultValue: defaults.attn_procs ?? '',
    // }),
  ]
}

export const getExtraInputsControls = (defaults: Partial<CallInputs> = {}) => {
  return [
    new BooleanControl({
      dataKey: 'safety_checker',
      name: 'Safety Checker',
      defaultValue: defaults.safety_checker ?? false,
    }),
    new InputControl({
      dataKey: 'SEND_URL',
      name: 'Send URL',
      defaultValue: defaults.SEND_URL ?? '',
      placeholder: 'https://example.com/webhook',
    }),
    new InputControl({
      dataKey: 'SIGN_KEY',
      name: 'Sign Key',
      defaultValue: defaults.SIGN_KEY ?? '',
      placeholder: 'secret-key',
    }),
  ]
}

export const getDiffusersInputsControls = (
  defaults: Partial<DiffusersInputs> = {}
) => {
  return {
    modelInputs: getModelInputsControls(defaults.modelInputs),
    callInputs: getCallInputsControls(defaults.callInputs),
    extraInputs: getExtraInputsControls(defaults.callInputs),
  }
}

export function setDefaultDiffusersInputs(
  diffusersInputs?: Partial<DiffusersInputs>
): DiffusersInputs {
  return {
    modelInputs: {
      prompt: '',
      negative_prompt: diffusersInputs?.modelInputs?.negative_prompt ?? '',
      num_inference_steps:
        diffusersInputs?.modelInputs?.num_inference_steps ?? 25,
      guidance_scale: diffusersInputs?.modelInputs?.guidance_scale ?? 7.5,
      width: diffusersInputs?.modelInputs?.width ?? 512,
      height: diffusersInputs?.modelInputs?.height ?? 512,
      seed: diffusersInputs?.modelInputs?.seed ?? -1,
      // cross_attention_kwargs:
      //   diffusersInputs?.modelInputs?.cross_attention_kwargs ?? '',
    },
    callInputs: {
      MODEL_ID:
        diffusersInputs?.callInputs?.MODEL_ID ?? Object.keys(modelIDs)[0],
      PIPELINE: (diffusersInputs?.callInputs?.PIPELINE ??
        Object.keys(pipelines)[0]) as Pipeline,
      SCHEDULER: (diffusersInputs?.callInputs?.SCHEDULER ??
        Object.keys(schedulers)[0]) as SCHEDULER,
      safety_checker: diffusersInputs?.callInputs?.safety_checker ?? false,
      SEND_URL: diffusersInputs?.callInputs?.SEND_URL ?? '',
      SIGN_KEY: diffusersInputs?.callInputs?.SIGN_KEY ?? '',
      // attn_procs: diffusersInputs?.callInputs?.attn_procs ?? '',
    },
    extraInputs: diffusersInputs?.extraInputs ?? {},
  }
}
