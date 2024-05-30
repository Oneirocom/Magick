import { EventPayload } from 'server/plugin'

const DEFAULT_EVENT_STATE_PROPERTY = 'channel'

export const getEventStateKey = (
  event: EventPayload,
  eventState: string[],
  defaultKey?: string
) => {
  const stateKey =
    eventState.sort().reduce((acc, key) => {
      const property = event[key as keyof EventPayload]
      if (property === undefined) return acc

      // only add the : if there is already a key
      if (acc.length > 0) {
        acc = `${acc}:${property}`
      } else {
        acc = `${property}`
      }

      return acc
    }, '') ||
    event[(defaultKey || DEFAULT_EVENT_STATE_PROPERTY) as keyof EventPayload]

  return stateKey
}

export const getEventProperties = (
  event: EventPayload,
  eventState: string[]
) => {
  return eventState.reduce((acc, key) => {
    const property = event[key as keyof EventPayload]
    if (property === undefined) return acc

    acc[key as keyof EventPayload] = property

    return acc
  }, {} as Partial<EventPayload>)
}
