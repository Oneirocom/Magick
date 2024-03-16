export interface IMiddleware {
  name: string
  pre?(input: string, conversationId: string): Promise<void>
  post?(response: string, conversationId: string): Promise<void>
  getPrompt?(): string
}

export class MiddlewareManager {
  private middlewares: IMiddleware[] = []

  registerMiddleware(middleware: IMiddleware) {
    this.middlewares.push(middleware)
  }

  runMiddleware(input: string, conversationId: string) {
    return Promise.all(
      this.middlewares.map(
        middleware =>
          middleware.pre?.(input, conversationId) ?? Promise.resolve()
      )
    )
  }

  getMiddlewarePrompts(): string {
    return this.middlewares
      .map(middleware => middleware.getPrompt?.() ?? '')
      .filter(Boolean)
      .join('\n')
  }
}
