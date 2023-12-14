import type { Paginated } from '@feathersjs/feathers'

export const checkPaginated = <T>(thing: Paginated<T> | T[]) => {
  if (!Array.isArray(thing)) {
    return thing
  }

  const page = {
    total: thing.length,
    limit: 0,
    skip: 0,
    data: thing,
  }

  return page
}

// Define a function type that matches the signature of your find method
type FindFunction<T> = (params: any) => Promise<Paginated<T>>

export const fetchAllPages = async <T>(
  findFunction: FindFunction<T>,
  params: any,
  skip = 0,
  previousData: T[] = []
): Promise<T[]> => {
  try {
    // Make the request for the current page
    const result = await findFunction({ ...params, $skip: skip })

    // Concatenate the new data with the previous data
    const allData = previousData.concat(result.data)

    // Check if there are more pages to fetch
    if (allData.length < result.total) {
      // If there are more pages, call this function recursively
      return fetchAllPages(
        findFunction,
        params,
        skip + (params.$limit || result.limit),
        allData
      )
    }

    // If there are no more pages, or all data has been fetched, return all the data
    return allData
  } catch (error) {
    console.error(error)
    throw error
  }
}
