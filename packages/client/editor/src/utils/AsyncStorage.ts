// DOCUMENTED
/**
 * Gets the value stored in local storage for a given key, parsing it from JSON if needed
 *
 * @param {string} key - The key under which the value is stored
 * @returns {any} - The value stored under the key, parsed from JSON, or null if the value is undefined or empty
 */
export const getItem = (key: string): any => {
  const value = window.localStorage.getItem(key)
  try {
    if (value === 'undefined' || !value) {
      return null
    }
    return JSON.parse(value)
  } catch {
    return value
  }
}

/**
 * Sets a value in local storage under a given key
 *
 * @param {string} key - The key under which to store the value
 * @param {string} value - The value to store in local storage
 * @returns void
 */
export const setItem = (key: string, value: string): void => {
  window.localStorage.setItem(key, value)
}

/**
 * Removes a given item from local storage
 *
 * @param {string} item - The key of the item to remove
 * @returns void
 */
export const removeItem = (item: string): void => {
  window.localStorage.removeItem(item)
}

/**
 * Clears all items from local storage
 *
 * @returns void
 */
export const clearStorage = (): void => {
  window.localStorage.clear()
}
