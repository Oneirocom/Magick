export const createEventName = (engineId: string, eventName: string) => {
  return `${engineId}:${eventName}`
}
