import { CustomError } from './../../utils/CustomError';
import { EngineContext, ThothWorkerInputs } from '@thothai/core/types'
import Koa from 'koa'
import vm2 from 'vm2'
import { CompletionRequest, completionsParser } from '../completions'
import * as events from '../../services/events'
import { CreateEventArgs, GetEventArgs } from '../../services/events'
import { searchWikipedia } from '../wikipedia/helpers';
import { makeCompletion } from '../../utils/MakeCompletionRequest'

export const buildThothInterface = (
  ctx: Koa.Context,
  initialGameState: Record<string, unknown>
): EngineContext => {
  // eslint-disable-next-line functional/no-let
  let gameState = { ...initialGameState }

  return {
    completion: async (request: CompletionRequest) => {
      const {
        model,
        prompt,
        stop,
        maxTokens,
        temperature,
        frequencyPenalty,
        presencePenalty,
        topP
      } = request

      const { success, choice } = await makeCompletion(model, {
        prompt: prompt.trim(),
        temperature: temperature,
        max_tokens: maxTokens,
        top_p: topP,
        frequency_penalty: frequencyPenalty,
        presence_penalty: presencePenalty,
        stop: stop,
      })

      return choice.text
    },
    runSpell: () => {
      return {}
    },
    readFromImageCache: async () => {
      return { images: [] }
    },
    processCode: (
      code: unknown,
      inputs: ThothWorkerInputs,
      data: Record<string, any>,
      state: Record<string, any>
    ) => {
      const { VM } = vm2
      const vm = new VM()

      // Inputs are flattened before we inject them for a better code experience
      const flattenInputs = Object.entries(inputs)
        .reduce((acc, [key, value]: [string, any]) => {
          acc[key] = value[0]
          return acc
        }, {} as Record<string, any>)


      // Freeze the variables we are injecting into the VM
      vm.freeze(data, 'data')
      vm.freeze(flattenInputs, 'input')
      vm.protect(state, 'state')

      // run the code
      const codeToRun = `"use strict"; function runFn(input,data,state){ return (${code})(input,data,state)}; runFn(input,data,state);`

      try {
        const codeResult = vm.run(codeToRun)
        console.log("CODE RESULT", codeResult)
        return codeResult
      } catch (err) {
        console.log({ err })
        throw new CustomError('server-error', 'Error in spell runner: processCode component.')
      }
    },
    enkiCompletion: async (taskName: string, inputs: string) => {
      return { outputs: [] }
    },
    huggingface: async (model: string, options: any) => {
      // const outputs = await huggingface({ context: ctx, model, options })
      return {}
    },
    setCurrentGameState: (state) => {
      gameState = state
    },
    getCurrentGameState: () => {
      return gameState
    },
    updateCurrentGameState: (update: Record<string, unknown>) => {
      const newState = {
        ...gameState,
        ...update,
      }

      gameState = newState
    },
    // IMPLEMENT THESE INTERFACES FOR THE SERVER
    getEvent: async (args: GetEventArgs) => {
      return await events.getEvents(args)
    },
    storeEvent: async (args: CreateEventArgs) => {
      return await events.createEvent(args)
    },
    getWikipediaSummary: async (keyword: string) => {
      let out = null
      try {
        out = await searchWikipedia(keyword as string) as any
      } catch (err) {
        throw new Error('Error getting wikipedia summary')
      }

      console.log("WIKIPEDIA SEARCH", out)

      return out
    }
  }
}