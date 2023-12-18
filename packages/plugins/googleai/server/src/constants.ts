// DOCUMENTED
/**
 * The GoogleAI endpoint URL.
 * Attempts to retrieve from various environment variables, falls back to default endpoint if not found.
 */
export const GOOGLEAI_ENDPOINT =
  process.env['VITE_GOOGLEAI_ENDPOINT'] ||
  process.env['NEXT_GOOGLEAI_ENDPOINT'] ||
  process.env['REACT_APP_GOOGLEAI_ENDPOINT'] ||
  process.env['GOOGLEAI_ENDPOINT'] ||
  'https://generativelanguage.googleapis.com/v1beta/models'
