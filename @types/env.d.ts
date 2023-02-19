/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_ROOT_URL: string
  readonly VITE_API_URL: string
  readonly VITE_CUSTOM_ENV_VARIABLE: string
  readonly OPENAI_API_KEY: string
  readonly HF_API_KEY: string
  readonly VITE_APP_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
