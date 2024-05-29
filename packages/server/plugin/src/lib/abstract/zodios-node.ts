import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { z } from 'zod'

import { Zodios, ZodiosEndpointDefinition, ZodiosOptions } from '@zodios/core'
import { generateMock } from '@anatine/zod-mock'

export interface CreateZodiosNodeOptions {
  def: ZodiosEndpointDefinition
  baseUrl: string
  service: string
  options: ZodiosOptions
  getHeaders?: () => Promise<Record<string, string>> | Record<string, string>
}

export const createZodiosNode = ({
  def,
  baseUrl,
  service,
  options,
  getHeaders,
}: CreateZodiosNodeOptions) => {
  const bodySchema = def.parameters?.find(
    param => param.type === 'Body'
  )?.schema
  const paramsSchemas = def.parameters
    ?.filter(param => param.type === 'Path')
    .reduce((acc, param) => {
      acc[param.name] = z.string()
      return acc
    }, {} as Record<string, any>)

  const resultSchema = def.response

  const bodyKeys = bodySchema
    ? Object.keys(generateMock(bodySchema as any))
    : []
  const paramsKeys = paramsSchemas ? Object.keys(paramsSchemas || {}) : []
  const resultKeys = resultSchema
    ? Object.keys(generateMock(resultSchema as any))
    : []

  return makeFlowNodeDefinition({
    typeName: `zodios/api/${service}/${def.alias}`,
    category: NodeCategory.Action,
    label: `${service.toUpperCase()} ${def.alias}`,
    in: {
      flow: 'flow',
      body: {
        valueType: 'object',
        label: 'Body',
        defaultValue: bodyKeys.reduce((acc, key) => {
          acc[key] = ''
          return acc
        }, {} as Record<string, any>),
      },
      params: {
        valueType: 'object',
        label: 'Params',
        defaultValue: paramsKeys.reduce((acc, key) => {
          acc[key] = ''
          return acc
        }, {} as Record<string, any>),
      },
    },
    out: {
      ...resultKeys.reduce((acc, key) => {
        acc[key] = {
          valueType: 'string',
          label: key,
          defaultValue: '',
        }
        return acc
      }, {} as Record<string, any>),

      flow: 'flow',
    },

    initialState: undefined,
    triggered: async ({ commit, read, write }) => {
      const body = read('body') as Record<string, any>
      const params = read('params') as Record<string, any>

      const headers = getHeaders ? await getHeaders() : {}

      const fn = new Zodios(baseUrl, [def], {
        ...options,
        axiosConfig: {
          headers,
        },
      })[def.alias as typeof fn]

      try {
        const validatedBody = bodySchema ? bodySchema.parse(body) : undefined
        const validatedParams = paramsSchemas
          ? Object.keys(paramsSchemas).reduce((acc, key) => {
              acc[key] = paramsSchemas[key].parse(params[key])
              return acc
            }, {} as Record<string, any>)
          : undefined

        const result = await fn(validatedBody, validatedParams)

        resultKeys.forEach(key => {
          write(key as any, result[key])
        })
      } catch (error) {
        console.error(`API ${def.alias} Node Error:`, error)
      }

      commit('flow')
    },
  })
}

export const safeCreateZodiosNode = (nodeOptions: CreateZodiosNodeOptions) => {
  try {
    return createZodiosNode(nodeOptions)
  } catch (error) {
    console.warn(
      `Failed to create Zodios node for definition:`,
      nodeOptions.def,
      error
    )
    return null
  }
}
