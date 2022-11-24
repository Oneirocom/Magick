import { database } from './../database';
export type GetEventArgs = {
  type: string,
  agent: string,
  speaker: string,
  client: string,
  channel: string,
  maxCount: number
}

export const getEvents = async ({
  type,
  agent,
  speaker,
  client,
  channel,
  maxCount
}: GetEventArgs) => {
  const event = await database.instance.getEvents(
    type,
    agent,
    speaker,
    client,
    channel,
    true,
    maxCount,
    null,
    -1
  )

  console.log("EVENT FOUND", event)

  if (!event) return null

  return event
}

export type CreateEventArgs = {
  agent: string,
  speaker: string,
  client: string,
  channel: string,
  text: string,
  type: string
}

export const createEvent = async (args: CreateEventArgs) => {
  return await database.instance.createEvent(
    args.type,
    args.agent,
    args.client,
    args.channel,
    args.speaker,
    args.text
  )
}