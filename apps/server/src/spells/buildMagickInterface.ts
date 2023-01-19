import {
  CompletionBody,
  CreateEventArgs,
  EngineContext,
  GetEventArgs,
  MagickWorkerInputs,
} from '@magickml/core'
import { database } from '@magickml/database'
import { prisma } from '@magickml/prisma'
import vm2 from 'vm2'
import axios from 'axios'

import { runPython } from '@magickml/core'
import { CustomError } from '../utils/CustomError'
import { makeCompletion } from '../utils/MakeCompletionRequest'
import { queryGoogleSearch } from '../utils/queryGoogle'
import { runSpell } from '../utils/runSpell'
import { searchWikipedia } from '../wikipedia/helpers'
import {
  API_ROOT_URL,
  API_URL,
  APP_SEARCH_SERVER_URL,
  OPENAI_API_KEY,
} from '@magickml/server-config'

const getEvents = async (params: GetEventArgs) => {
  return await database.getEvents(params)
}

const createEvent = async (args: CreateEventArgs) => {
  return await database.createEvent(args)
}

const getEventWeaviate = async ({
  type = 'default',
  sender = 'system',
  observer = 'system',
  entities = [],
  client = 'system',
  channel = 'system',
  maxCount = 10,
  target_count = 'single',
  max_time_diff = -1,
}) => {
  const urlString = `${API_ROOT_URL}/eventWeaviate`

  const params = {
    type,
    sender,
    observer,
    entities,
    client,
    channel,
    maxCount,
    target_count,
    max_time_diff,
  } as Record<string, any>

  const url = new URL(urlString)
  for (let p in params) {
    url.searchParams.append(p, params[p])
  }

  const response = await fetch(url.toString())
  console.log(response)
  if (response.status !== 200) return null
  const json = await response.json()
  return json.event
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
  const response = await axios.post(`${API_ROOT_URL}/eventWeaviate`, {
    type,
    sender,
    observer,
    entities,
    content,
    client,
    channel,
  })
  console.log('Created event', response.data)
  return response.data
}

export const buildMagickInterface = (
  initialGameState: Record<string, unknown>,
  overrides: Record<string, Function> = {}
): EngineContext => {
  // eslint-disable-next-line functional/no-let
  let gameState = { ...initialGameState }
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

      const {
        prompt,
        modelName,
        temperature,
        maxTokens,
        topP,
        frequencyPenalty,
        presencePenalty,
        stop,
      } = body

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
      language: string = 'javascript'
    ) => {
      // Inputs are flattened before we inject them for a better code experience
      const flattenInputs = Object.entries(inputs).reduce(
        (acc, [key, value]: [string, any]) => {
          acc[key] = value[0]
          return acc
        },
        {} as Record<string, any>
      )

      if (language === 'javascript') {
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
          const codeResult = await runPython(code, flattenInputs, data, state)
          return codeResult
        } catch (err) {
          console.log({ err })
        }
      }
    },
    setCurrentGameState: state => {
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
    getEvents: async (args: GetEventArgs) => {
      return await getEvents(args)
    },
    getEventWeaviate: async (args: GetEventArgs) => {
      return await getEventWeaviate(args)
    },
    storeEvent: async (args: CreateEventArgs) => {
      return await createEvent(args)
    },
    storeEventWeaviate: async (args: CreateEventArgs) => {
      return await storeEventWeaviate(args)
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
