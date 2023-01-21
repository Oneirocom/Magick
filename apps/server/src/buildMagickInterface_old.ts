import {
  CompletionBody,
  CreateEventArgs,
  EngineContext,
  GetEventArgs,
  MagickWorkerInputs,
  QAArgs
} from '@magickml/engine'
import { database } from '@magickml/database'
import vm2 from 'vm2'
import axios from 'axios'

import { runPython } from '@magickml/engine'
import { CustomError } from '../utils/CustomError'
import { makeCompletion } from './utils/MakeCompletionRequest'
import { queryGoogleSearch } from '../utils/queryGoogle'
import { runSpell } from './utils/runSpell'
import { searchWikipedia } from './wikipedia/helpers'
import {
  API_ROOT_URL,
  API_URL,
  APP_SEARCH_SERVER_URL,
  OPENAI_API_KEY,
} from '@magickml/server-config'
import { weaviate_connection } from '@magickml/systems'

const getEvents = async (params: GetEventArgs) => {
  return await database.getEvents(params)
}

const createEvent = async (args: CreateEventArgs) => {
  return await database.createEvent(args)
}

    const storeEventWeaviate = async ({
    type,
    observer,
    sender,
    entities,
    content,
    client,
    channel,
  }: CreateEventArgs) => {
    const response = await axios.post(
      `${
        process.env.VITE_APP_API_URL ??
        process.env.API_ROOT_URL
      }/eventWeaviate`,
      {
        type,
        sender,
        observer,
        entities,
        content,
        client,
        channel,
      }
    )
    console.log('Created event', response.data)
    return response.data
  }

export const buildMagickInterface = (): EngineContext => {
  // eslint-disable-next-line functional/no-let
  const env = {
    API_ROOT_URL,
    API_URL,
    APP_SEARCH_SERVER_URL,
  }

  return {
    env,
    runSpell: async (flattenedInputs, spellId, state) => {
      const { outputs } = await runSpell({
        state,
        spellName: spellId,
        inputs: flattenedInputs,
      })

      console.log('*************************RUNSPELL OUTPUTS', outputs)

      return outputs
    },
    completion: async (body: CompletionBody) => {
      const apiKey = body.apiKey ?? OPENAI_API_KEY

      if (!apiKey) throw new Error('No API key provided')

      const {prompt, modelName, temperature, maxTokens, topP, frequencyPenalty, presencePenalty, stop} = body

      const { success, choice } = await makeCompletion(modelName, {
        prompt,
        temperature,
        max_tokens: maxTokens,
        top_p: topP,
        frequency_penalty: frequencyPenalty,
        presence_penalty: presencePenalty,
        stop,
        apiKey,
      })

      return { success, choice }
    },
    getSpell: async spellId => {
      const spell = await prisma.spells.findUnique({ where: { name: spellId } })

      return spell
    },
    queryGoogle: async query => {
      return await queryGoogleSearch(query)
    },
    processCode: async (
      code: unknown,
      inputs: MagickWorkerInputs,
      data: Record<string, any>,
      state: Record<string, any>,
      language: string='javascript'
    ) => {
      // Inputs are flattened before we inject them for a better code experience
      const flattenInputs = Object.entries(inputs).reduce(
        (acc, [key, value]: [string, any]) => {
          acc[key] = value[0]
          return acc
        },
        {} as Record<string, any>
      )

      if (language === 'javascript'){
        const { VM } = vm2
        const vm = new VM()

        // Freeze the variables we are injecting into the VM
        vm.freeze(data, 'data')
        vm.freeze(flattenInputs, 'input')
        vm.protect(state, 'state')

        // run the code
        const codeToRun = `"use strict"; function runFn(input,data,state){ return (${code})(input,data,state)}; runFn(input,data,state);`

        try {
          const codeResult = vm.run(codeToRun)
          console.log('CODE RESULT', codeResult)
          return codeResult
        } catch (err) {
          console.log({ err })
          throw new CustomError(
            'server-error',
            'Error in spell runner: processCode component: ' + code
          )
        }
      } else {
        try {

          const codeResult = await runPython(code, flattenInputs, data, state);
          return codeResult;
        } catch (err) {
          console.log({ err })
        }
      }
    },
    getEvents: async (args: GetEventArgs) => {
      return await getEvents(args)
    },
    storeEvent: async (args: CreateEventArgs) => {
      return await createEvent(args)
    },
    eventQAWeaviate: async (args: QAArgs) => {
      const data = {...args}
      return await weaviate_connection.searchEvents(data["question"], parseInt(data['agentId'].toString()))
    },
    storeEventWeaviate: async (args: CreateEventArgs) => {
      return await storeEventWeaviate(args)
    },
    deleteEvent: async (args: CreateEventArgs) => {
      return await weaviate_connection.getAndDeleteEvents(args)
    },
    getWikipediaSummary: async (keyword: string) => {
      let out = null
      try {
        out = (await searchWikipedia(keyword as string)) as any
      } catch (err) {
        throw new Error('Error getting wikipedia summary')
      }

      console.log('WIKIPEDIA SEARCH', out)

      return out
    },
  }
}
