// IMiddleware.ts
import { ZodType } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { XMLBuilder, XMLParser } from 'fast-xml-parser'

export interface IMiddleware {
  name: string
  input?: (input: string, conversationId: string) => Promise<void>
  run?(response: string, conversationId: string): Promise<void>
  getPrompt?(): Promise<string>
  schema: ZodType<any>
  preProcess?(response: string, conversationId: string): Promise<string>
  postProcess?(response: string, conversationId: string): Promise<void>
}

export class MiddlewareManager {
  private middlewares: IMiddleware[] = []

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

    const xmlTags = this.extractXmlTags(response)
    for (const xmlTag of xmlTags) {
      const { middlewareName, xml } = this.parseXmlTag(xmlTag)
      const middleware = this.middlewares.find(m => m.name === middlewareName)
      if (middleware) {
        const schema = middleware.schema
        const parsedResponse = schema.parse(this.xmlToJson(xml))
        await middleware.run?.(JSON.stringify(parsedResponse), conversationId)
      }
    }

    // Post-processing
    for (const middleware of this.middlewares) {
      await middleware.postProcess?.(response, conversationId)
    }
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

  private xmlToJson(xml: string): any {
    const parser = new XMLParser()
    const json = parser.parse(xml)
    return json
  }

  private extractXmlTags(response: string): string[] {
    const xmlRegex = /<([^>]+)>[\s\S]*?<\/\1>/g
    const matches = response.match(xmlRegex)
    return matches || []
  }

  private parseXmlTag(xmlTag: string): { middlewareName: string; xml: string } {
    const matches = xmlTag.match(/<(\w+)>([\s\S]*)<\/\1>/)
    if (matches && matches.length === 3) {
      return { middlewareName: matches[1], xml: matches[2] }
    }
    throw new Error('Invalid XML tag format')
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
