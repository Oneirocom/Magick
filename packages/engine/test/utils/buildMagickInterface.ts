import { EngineContext } from '../../src/lib/types'
import { API_ROOT_URL } from '../../src/lib/config'

export const buildMagickInterface = (
  overrides: Record<string, unknown> = {}
): EngineContext => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment
    // @ts-ignore
    getSpell: async () => { /* null */ },
  }
}
