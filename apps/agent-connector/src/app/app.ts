import { FastifyInstance } from 'fastify'
import { Agent } from 'server/agents'
import { initApp } from 'server/core'
import { z } from 'zod'
import { fastifyCors } from '@fastify/cors'
import { fastifyWebsocket } from '@fastify/websocket'
import axios, { type AxiosResponse } from 'axios'
import { v4 } from 'uuid'
import WebSocket from 'ws'

const numId = () => {
  return Math.floor(Math.random() * 1000000)
}

type TokenResponse = {
  token: string
}

const messageSchema = z.object({
  id: z.string(),
  text: z.string(),
  sender: z.string(),
})

const agentInfoSchema = z.object({
  data: z.any(),
  type: z.literal('agentInfo'),
})

type AgentInfo = z.infer<typeof agentInfoSchema>

/* eslint-disable-next-line */
export interface AppOptions {}

export async function app(fastify: FastifyInstance) {
  const agentApp = await initApp()

  await fastify.register(fastifyWebsocket)

  await fastify.register(fastifyCors, {
    origin: true, // Allow requests from any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the allowed HTTP methods
  })

  const apiKey = process.env.ELEVENLABS_API_KEY
  const voiceId = '21m00Tcm4TlvDq8ikWAM'
  const model = 'eleven_turbo_v2'

  fastify.get('/ws/:agentId', { websocket: true }, async socket => {
    const agentId = '0644d18a-401c-4777-85fa-c600801ac685'
    console.log('Agent ID', agentId)
    if (!agentId) {
      socket.close()
      return
    }

    // startup agent
    const agentData = await agentApp.service('agents').get(agentId)
    const info: AgentInfo = { data: agentData, type: 'agentInfo' }
    socket.send(JSON.stringify(info))

    const agent = new Agent(agentData, agentApp.get('pubsub'), agentApp)

    /* USER INPUT STREAM */
    socket.on('message', message => {
      const data = messageSchema.parse(JSON.parse(message.toString()))
      console.log('socket.on message', data)

      socket.send(
        JSON.stringify({
          id: new Date().toISOString(),
          text: 'processing...',
          sender: agentData.name,
          type: 'status',
        })
      )

      agent.spellbook.refreshSpells().then(() => {
        console.log('Emitting message', data.text)
        agent.emit(
          'message',
          agent.formatEvent<{ responseId: number }>({
            content: data.text,
            sender: 'client',
            eventName: 'message',
            data: {
              responseId: numId(),
            },
          })
        )
      })
    })

    /* AGENT MESSAGE OUTPUT STREAM */
    agent.on('messageStream', async actionPayload => {
      const event = actionPayload.event
      const responseId = (event.data as { responseId: string }).responseId

      // Send the text chunk to the client
      socket.send(
        JSON.stringify({
          id: v4(),
          sender: agentData.name,
          text: actionPayload.data.content,
          type: 'message',
          responseId: responseId,
        })
      )

      // Generate audio using ElevenLabs API
      try {
        const response = await axios.post(
          `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
          {
            text: actionPayload.data.content,
            model_id: model,
            xi_api_key: apiKey,
          },
          {
            responseType: 'arraybuffer',
            headers: {
              'Content-Type': 'application/json',
              accept: 'audio/mpeg',
            },
          }
        )

        const audioData = response.data
        const audioBase64 = Buffer.from(audioData, 'binary').toString('base64')

        // Send the audio data to the client in smaller chunks
        const chunkSize = 1024 * 10 // 10KB chunks
        for (let i = 0; i < audioBase64.length; i += chunkSize) {
          const chunk = audioBase64.slice(i, i + chunkSize)
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(
              JSON.stringify({
                type: 'audio',
                data: chunk,
                responseId: responseId,
                isComplete: i + chunkSize >= audioBase64.length,
              })
            )
            await new Promise(resolve => setTimeout(resolve, 100)) // Delay between chunks to avoid overwhelming the client
          }
        }
      } catch (error) {
        console.error('Error generating audio:', error)
      }
    })

    /* OTHER SOCKETS */
    agent.on('message', actionPayload => {
      const { content } = actionPayload
      console.log('agent.on message', content)
    })

    agent.on('messageReceived', actionPayload => {
      console.log('agent.on messageReceived', actionPayload)
      socket.send(
        JSON.stringify({
          id: new Date().toISOString(),
          sender: agentData.name,
          text: actionPayload.data.content,
          type: 'message',
        })
      )
    })

    // on disconnect
    socket.on('close', () => {
      agent.removeAllListeners()
      agent.onDestroy()
    })

    socket.on('error', () => {
      agent.removeAllListeners()
      agent.onDestroy()
    })
  })

  fastify.get('/aai-token', async function () {
    const response: AxiosResponse<TokenResponse> = await axios.post(
      'https://api.assemblyai.com/v2/realtime/token',
      { expires_in: 3600 },
      { headers: { authorization: `${process.env.AAI_KEY}` } }
    )

    if (!response?.data?.token) {
      throw new Error('No data')
    }

    return response.data
  })
}
