import errors from '@feathersjs/errors'
import { HookContext } from '@feathersjs/feathers'

export async function authenticateApiKey(
  context: HookContext,
  next: any
): Promise<any> {
  // Check if API key is present in headers or query parameters
  const apiKey =
    context.params.headers?.['x-api-key'] || context.params.query?.apiKey

  if (!apiKey) {
    return next() // If no API key, continue with other authentication methods
  }

  // TODO: Validate the provided API key. This is a basic example and should be
  // expanded to check against a database, environment variable, or other source.
  const VALID_API_KEYS = ['API_KEY_1', 'YOUR_VALID_API_KEY_2'] // Dummy values

  if (VALID_API_KEYS.includes(apiKey)) {
    context.params.authenticated = true // Mark the request as authenticated
    context.params.apiKey = true // Mark the request as authenticated via API key
    return next()
  } else {
    throw new errors.NotAuthenticated('Invalid API key')
  }
}
