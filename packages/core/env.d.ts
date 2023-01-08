/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_ROOT_URL: string
  readonly VITE_API_URL: string
  readonly VITE_CUSTOM_ENV_VARIABLE: string
  NODE_TLS_REJECT_UNAUTHORIZED: string
  readonly OPENAI_API_KEY: string
  readonly HF_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
