import errors from '@feathersjs/errors'
import { HookContext } from '@feathersjs/feathers'

export const authenticateApiKey = apiKeys => {
  return function (context: HookContext, next: any): Promise<any> {
    // Check if API key is present in headers or query parameters
    const apiKey =
      context.params.headers?.['x-api-key'] || context.params.query?.apiKey

    if (!apiKey) {
      return next() // If no API key, continue with other authentication methods
    }

    if (apiKeys.includes(apiKey)) {
      context.params.authenticated = true // Mark the request as authenticated
      context.params.apiKey = true // Mark the request as authenticated via API key
      return next()
    } else {
      throw new errors.NotAuthenticated('Invalid API key')
    }
  }
}
