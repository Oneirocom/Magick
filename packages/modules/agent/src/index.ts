import type { Nitro } from 'nitropack'

declare module 'nitropack' {
  interface NitroOptions {}
}

export async function nitroModule(nitro: Nitro) {}
