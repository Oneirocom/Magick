import type { Paginated } from '@feathersjs/feathers'

export const checkPaginated = <T>(thing: Paginated<T> | T[]) => {
  if (!Array.isArray(thing)) {
    return thing
  }

  const page = {
    total: thing.length,
    limit: 0,
    skip: 0,
    data: thing 
  }

  return page;
}
