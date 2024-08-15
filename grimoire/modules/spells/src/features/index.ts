export const spellFeatures = {
  // spells: "spells", //
} as const

export type SpellFeatures = typeof spellFeatures

export * from './scan-json'
export * from './rollup-json'