/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import axios from 'axios'
//handles the input from a client according to a selected agent and responds
export async function handleInput(
  message: string | undefined,
  speaker: string,
  agent: string,
  client: string,
  channelId: string,
  entity: number,
  spell_handler: string,
  channel: string = 'msg'
) {
  if (spell_handler === undefined) {
    spell_handler = 'default'
  }

  const url = encodeURI(
    `https://0.0.0.0:8001/spells/${spell_handler}`
  )

  const response = await axios.post(`${url}`, {
    Input: {
      Input: message,
      Speaker: speaker,
      Agent: agent,
      Client: client,
      ChannelID: channelId,
      Entity: entity,
      Channel: channel,
    },
  })
  let index = undefined

  for (const x in response.data.outputs) {
    index = x
  }

  if (index && index !== undefined) {
    return response.data.outputs[index]
  } else {
    return undefined
  }
}