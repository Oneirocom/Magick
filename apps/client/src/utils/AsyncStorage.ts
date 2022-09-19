export const getItem = (key: string) => {
  const value = window.localStorage.getItem(key)

  try {
    if (value === 'undefined' || !value) {
      return null
    }
    const parsedValue = JSON.parse(value)
    return parsedValue
  } catch {
    return value
  }
}

export const setItem = (key: string, value: string) => {
  return window.localStorage.setItem(key, value)
}

export const removeItem = (item: string) => {
  return window.localStorage.removeItem(item)
}

export const clearStorage = () => {
  window.localStorage.clear()
}
