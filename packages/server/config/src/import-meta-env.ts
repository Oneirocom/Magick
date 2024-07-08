// DOCUMENTED
// @ts-nocheck
/**
 * Returns the `import.meta.env` object if it exists, otherwise an empty object.
 * @returns {Record<string, any>} The `import.meta.env` object if it exists, otherwise an empty object.
 */
export const importMetaEnv =
  // @ts-ignore
  typeof import.meta !== 'undefined' && typeof import.meta.env !== 'undefined'
    ? (import.meta as any).env
    : ({} as Record<string, any>)
