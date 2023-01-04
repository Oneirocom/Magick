/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_ROOT_URL: string
  readonly VITE_API_URL: string
  readonly EXTEND_ESLINT: string
  readonly VITE_CUSTOM_ENV_VARIABLE: string
  NODE_TLS_REJECT_UNAUTHORIZED: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
