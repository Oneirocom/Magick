// UNDOCUMENTED
/**
 * The BANANA endpoint URL.
 * Attempts to retrieve from various environment variables, falls back to default endpoint if not found.
 */
export const BANANA_ENDPOINT =
  process.env['VITE_BANANA_ENDPOINT'] ||
  process.env['NEXT_BANANA_ENDPOINT'] ||
  process.env['REACT_APP_BANANA_ENDPOINT'] ||
  process.env['BANANA_ENDPOINT'] ||
  'https://api.banana.dev/start/v4'
