export const OPENAI_ENDPOINT =
  process.env['VITE_OPENAI_ENDPOINT'] ||
  process.env['NEXT_OPENAI_ENDPOINT'] ||
  process.env['REACT_APP_OPENAI_ENDPOINT'] ||
  process.env['OPENAI_ENDPOINT'] ||
  'https://api.openai.com/v1'