export function createEventsEnum<T extends string>(
  types: T[]
): { [K in T]: K } {
  return types.reduce((acc, key) => {
    acc[key] = key
    return acc
  }, Object.create(null))
}
