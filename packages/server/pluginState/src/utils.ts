export const handleError = (error: Error, message: string) => {
  console.error(message, error)
  throw error
}

export const ensureStateInitialized = async <T extends object>(
  currentState: T | undefined,
  initState: () => Promise<void>
): Promise<T> => {
  if (!currentState) {
    await initState()
  }
  return currentState as T
}
