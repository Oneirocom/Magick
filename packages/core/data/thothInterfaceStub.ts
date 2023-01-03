import {
  ImageCacheResponse,
  OpenAIResultChoice,
  ThothWorkerInputs,
} from '../types'
import { VM } from 'vm2'
export default {
  completion: () => {
    return new Promise(resolve => resolve('string')) as Promise<
      string | OpenAIResultChoice
    >
  },
  enkiCompletion: (): Promise<{ outputs: string[] }> => {
    return new Promise(resolve => resolve({ outputs: ['string'] }))
  },
  huggingface: (): Promise<{ outputs: string[] }> => {
    return new Promise(resolve => resolve({ outputs: ['string'] }))
  },
  getCurrentGameState: () => {
    return {}
  },
  setCurrentGameState: (_state: Record<string, unknown>) => {},
  updateCurrentGameState: (_state: Record<string, unknown>) => {},
  runSpell: (_flattenedInputs: Record<string, unknown>, _spellId: string) => {
    return new Promise(resolve => resolve({ outputs: ['string'] }))
  },
  readFromImageCache: (_caption: string): Promise<ImageCacheResponse> => {
    return new Promise(resolve => resolve({} as ImageCacheResponse))
  },
  processCode: (
    code: unknown,
    inputs: ThothWorkerInputs,
    data: Record<string, any>,
    state: Record<string, any>
  ) => {
    const logValues: any[] = []

    const sandboxConsole = {
      log: (val: any, ...rest: any[]) => {
        if (rest.length) {
          logValues.push(JSON.stringify([val, ...rest], null, 2))
        } else {
          logValues.push(JSON.stringify(val, null, 2))
        }
      },
    }

    const flattenedInputs = Object.entries(inputs as ThothWorkerInputs).reduce(
      (acc, [key, value]) => {
        // eslint-disable-next-line prefer-destructuring
        acc[key as string] = value[0] // as any[][0] <- this change was made 2 days ago
        return acc
      },
      {} as Record<string, any>
    )
    const vm = new VM()
    vm.protect(state, 'state')

    vm.freeze(flattenedInputs, 'input')
    vm.freeze(data, 'data')
    vm.freeze(sandboxConsole, 'console')

    const codeToRun = `"use strict"; function runFn(input,data,state){ const copyFn=${code}; return copyFn(input,data,state)}; runFn(input,data,state);`
    try {
      return vm.run(codeToRun)
    } catch (err) {
      throw new Error('Error in rungraph: processCode.')
    }
  },
}
