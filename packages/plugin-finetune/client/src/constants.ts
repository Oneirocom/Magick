export const OPENAI_ENDPOINT =
  import.meta.env['VITE_OPENAI_ENDPOINT'] ||
  import.meta.env['NEXT_OPENAI_ENDPOINT'] ||
  import.meta.env['REACT_APP_OPENAI_ENDPOINT'] ||
  import.meta.env['OPENAI_ENDPOINT'] ||
  'https://api.openai.com/v1'