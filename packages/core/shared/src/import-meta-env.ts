// DOCUMENTED 
/**
 * Returns the `import.meta.env` object if it exists, otherwise an empty object.
 * @returns {Record<string, any>} The `import.meta.env` object if it exists, otherwise an empty object.
 */
export const importMetaEnv = typeof import.meta !== 'undefined' && typeof (import.meta as any).env !== 'undefined'
  ? (import.meta as any).env
  : {} as Record<string, any>;
