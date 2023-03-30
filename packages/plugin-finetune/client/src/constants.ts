// GENERATED 
/**
 * This constant defines the endpoint URL for OpenAI's API.
 * It looks for environment variables in the following order:
 * 1. VITE_OPENAI_ENDPOINT
 * 2. NEXT_OPENAI_ENDPOINT
 * 3. REACT_APP_OPENAI_ENDPOINT
 * 4. OPENAI_ENDPOINT
 * If none of these are found, it defaults to https://api.openai.com/v1
 */
export const OPENAI_ENDPOINT =
  import.meta.env['VITE_OPENAI_ENDPOINT'] ||
  import.meta.env['NEXT_OPENAI_ENDPOINT'] ||
  import.meta.env['REACT_APP_OPENAI_ENDPOINT'] ||
  import.meta.env['OPENAI_ENDPOINT'] ||
  'https://api.openai.com/v1'