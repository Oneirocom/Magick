// IMiddleware.ts
import { ZodType } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { XMLBuilder, XMLParser } from 'fast-xml-parser'
import { SeraphCore } from './seraphCore'
import { SeraphFunction } from './types'

export interface IMiddleware {
  name: string
  input?: (input: string, conversationId: string) => Promise<void>
  run?(response: string, conversationId: string): Promise<string>
  getPrompt?(): Promise<string>
  schema: ZodType<any>
  preProcess?(response: string, conversationId: string): Promise<string>
  postProcess?(response: string, conversationId: string): Promise<void>
}

export class MiddlewareManager {
  private middlewares: IMiddleware[] = []
  private seraph: SeraphCore

  constructor(seraph: SeraphCore) {
    this.seraph = seraph
  }

  registerMiddleware(middleware: IMiddleware) {
    this.middlewares.push(middleware)
  }

  async runInputMiddleware(input: string, conversationId: string) {
    await Promise.all(
      this.middlewares.map(
        middleware =>
          middleware.input?.(input, conversationId) ?? Promise.resolve()
      )
    )
  }

  async runMiddleware(response: string, conversationId: string) {
    // Pre-processing
    for (const middleware of this.middlewares) {
      response =
        (await middleware.preProcess?.(response, conversationId)) ?? response
    }

    const middlewareInstructionsRegex =
      /<middleware_instructions>([\s\S]*?)<\/middleware_instructions>/g
    const middlewareInstructions = response.match(middlewareInstructionsRegex)

    if (middlewareInstructions) {
      for (const instruction of middlewareInstructions) {
        const { middlewareName, parameters } =
          this.parseMiddlewareInstruction(instruction)
        const middleware = this.middlewares.find(m => m.name === middlewareName)

        if (middleware) {
          const middlewareStart: SeraphFunction = {
            name: middlewareName,
            messageTitle: 'Middleware Execution',
            message: `Running middleware: ${middlewareName}`,
          }
          this.seraph.emit('middlewareExecution', middlewareStart)
          const schema = middleware.schema
          const parsedParameters = schema.parse(parameters)
          const result = await middleware.run?.(
            JSON.stringify(parsedParameters),
            conversationId
          )

          const middlewareEnd: SeraphFunction = {
            name: middlewareName,
            messageTitle: 'Middleware Execution',
            message: `Middleware ${middlewareName} finished`,
            result: result || 'Done',
          }
          this.seraph.emit('middlewareResult', middlewareEnd)
        }
      }
    }

    // Post-processing
    for (const middleware of this.middlewares) {
      await middleware.postProcess?.(response, conversationId)
    }
  }

  private parseMiddlewareInstruction(instruction: string): {
    middlewareName: string
    parameters: any
  } {
    const parser = new XMLParser()
    const json = parser.parse(instruction)

    const middlewareName = json.middleware_instructions.middleware_name
    const parameters = json.middleware_instructions.parameters

    return { middlewareName, parameters }
  }

  async getMiddlewarePrompts(): Promise<string> {
    const prompts = await Promise.all(
      this.middlewares.map(async middleware => {
        const basePrompt = (await middleware.getPrompt?.()) ?? ''
        const zodSchema = middleware.schema
        const jsonSchema = zodToJsonSchema(zodSchema, {
          name: middleware.name,
          target: 'jsonSchema7',
        })
        const xmlSchema = this.jsonSchemaToXml(jsonSchema)
        const fullPrompt = `
          ${basePrompt}

          XML Schema for ${middleware.name} Middleware:
          ${xmlSchema}
        `
        return fullPrompt
      })
    )
    const fullPrompt = prompts.filter(Boolean).join('\n')

    return `<middleware_instructions>${fullPrompt}</middleware_instructions>`
  }

  private jsonSchemaToXml(jsonSchema: any): string {
    const builder = new XMLBuilder({
      ignoreAttributes: false,
      format: true,
    })
    const xmlSchema = builder.build(jsonSchema)
    return xmlSchema
  }
}
