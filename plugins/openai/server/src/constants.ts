// DOCUMENTED 
/**
 * The OpenAI endpoint URL.
 * Attempts to retrieve from various environment variables, falls back to default endpoint if not found.
 */
export const OPENAI_ENDPOINT =
  process.env['VITE_OPENAI_ENDPOINT'] ||
  process.env['NEXT_OPENAI_ENDPOINT'] ||
  process.env['REACT_APP_OPENAI_ENDPOINT'] ||
  process.env['OPENAI_ENDPOINT'] ||
  'https://api.openai.com/v1';