import { FastifyInstance } from 'fastify'
import { Agent } from 'server/agents'
import { initApp } from 'server/core'
import { z } from 'zod'
import { fastifyCors } from '@fastify/cors'
import { fastifyWebsocket } from '@fastify/websocket'
import { v4 } from 'uuid'
import WebSocket from 'ws'
import axios from 'axios'

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
  const voiceId = '09mMp1DS2qzVMMRC8S2P'
  const model = 'eleven_turbo_v2'

  fastify.get('/ws/:agentId', { websocket: true }, async (socket, req) => {
    // const agentId = '0644d18a-401c-4777-85fa-c600801ac685'
    const agentId = req.url.split('/')[2]
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

      // Open WebSocket connection to ElevenLabs API
      const elevenLabsSocket = new WebSocket(
        `wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream-input?model_id=${model}`
      )

      elevenLabsSocket.onopen = () => {
        // Send the initial message with the API key and voice settings
        const initialMessage = JSON.stringify({
          text: ' ',
          voice_settings: { stability: 0.5, similarity_boost: 0.8 },
          xi_api_key: apiKey,
        })
        elevenLabsSocket.send(initialMessage)

        // Send the text message
        const textMessage = JSON.stringify({
          text: actionPayload.data.content + ' ',
          try_trigger_generation: true,
        })
        elevenLabsSocket.send(textMessage)

        // Send the EOS message
        const eosMessage = JSON.stringify({ text: '' })
        elevenLabsSocket.send(eosMessage)
      }

      elevenLabsSocket.onmessage = async event => {
        const response = JSON.parse(event.data as any)
        if (response.audio) {
          const audioData = Buffer.from(response.audio, 'base64')
          // const audioBase64 = audioData.toString('base64')

          // Store the audio data in a buffer
          const audioBuffer = Buffer.from(audioData)

          // Send the audio data to the client in smaller chunks
          const chunkSize = 1024 * 10 // 10KB chunks
          for (let i = 0; i < audioBuffer.length; i += chunkSize) {
            const chunk = audioBuffer.slice(i, i + chunkSize)
            const chunkBase64 = chunk.toString('base64')
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(
                JSON.stringify({
                  type: 'audio',
                  data: chunkBase64,
                  responseId: responseId,
                  isComplete: i + chunkSize >= audioBuffer.length,
                })
              )
              await new Promise(resolve => setTimeout(resolve, 100)) // Delay between chunks to avoid overwhelming the client
            }
          }
        }
        if (response.isFinal) {
          elevenLabsSocket.close()
        }
      }

      elevenLabsSocket.onerror = error => {
        console.error('WebSocket error:', error)
        elevenLabsSocket.close()
      }

      elevenLabsSocket.onclose = event => {
        if (event.wasClean) {
          console.log(
            `WebSocket connection closed cleanly, code=${event.code} reason=${event.reason}`
          )
        } else {
          console.log('WebSocket connection died')
        }
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
    try {
      const response = await axios.post<TokenResponse>(
        'https://api.assemblyai.com/v2/realtime/token',
        { expires_in: 3600 },
        { headers: { authorization: `${process.env.AAI_KEY}` } }
      )

      if (!response?.data?.token) {
        throw new Error('No data')
      }

      return response.data
    } catch (error) {
      console.error('Error generating AAI token:', error)
      throw error
    }
  })
}
