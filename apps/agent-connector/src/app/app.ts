import { FastifyInstance } from 'fastify'
import { Agent } from 'server/agents'
import { initApp } from 'server/core'
import { z } from 'zod'
import { fastifyCors } from '@fastify/cors'
import { fastifyWebsocket } from '@fastify/websocket'
import { streamSpeech, elevenlabs, generateSpeech } from 'modelfusion'
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
  type: z.string(),
})

const agentInfoSchema = z.object({
  data: z.any(),
  type: z.literal('agentInfo'),
})

// Define an interface to extend the AsyncGenerator with additional methods
interface TextStreamGenerator extends AsyncGenerator<string, void, unknown> {
  addToken: (token: string) => void
  endStream: () => void
}

// Generate the text stream generator
function createTextStreamGenerator(): TextStreamGenerator {
  let resolve: ((value: IteratorResult<string, void>) => void) | null = null
  const queue: (string | null)[] = []

  async function* generator(): AsyncGenerator<string, void, undefined> {
    while (true) {
      if (queue.length > 0) {
        const token = queue.shift()
        // Explicitly check for null to allow empty strings to be yielded
        if (token !== null) {
          yield token
        } else {
          return // Finish the generator when a null token is encountered
        }
      } else {
        const result: IteratorYieldResult<string> | IteratorReturnResult<void> =
          await new Promise(r => (resolve = r))
        // Check explicitly that result.value is not undefined to allow yielding empty strings
        if (!result.done && result.value) {
          console.log('result.value', result.value)
          yield result.value
        } else {
          return // End the generator when done is true
        }
      }
    }
  }

  const textGenerator: TextStreamGenerator = generator() as TextStreamGenerator

  textGenerator.addToken = (token: string) => {
    if (resolve) {
      resolve({ value: token, done: false })
      resolve = null
    } else {
      queue.push(token)
    }
  }

  textGenerator.endStream = () => {
    if (resolve) {
      resolve({ value: undefined, done: true })
      resolve = null
    } else {
      queue.push(null)
    }
  }

  return textGenerator
}

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

  const model = 'eleven_turbo_v2'

  fastify.get(
    '/ws/:agentId/:channelId',
    { websocket: true },
    async (socket, req) => {
      const agentId = req.url.split('/')[2]
      const channelId = req.url.split('/')[3]

      if (!agentId) {
        socket.close()
        return
      }

      let sendAudio = false

      // startup agent
      const agentData = await agentApp.service('agents').get(agentId)
      const info: AgentInfo = { data: agentData, type: 'agentInfo' }
      socket.send(JSON.stringify(info))

      const agent = new Agent(agentData, agentApp.get('pubsub'), agentApp)

      let currentSpeechStream: AsyncIterable<Uint8Array> | null = null
      let isSpeechStreamRunning = false // Flag to track if a stream is in progress
      let voiceId = 'Z7HNXT9nFlPyYvAISoB6'

      const textGeneratorQueue = new Map<string, TextStreamGenerator>()
      const speechQueue: {
        responseId: string
      }[] = []

      async function processSpeechQueue() {
        while (speechQueue.length > 0) {
          isSpeechStreamRunning = true

          const { responseId } = speechQueue.shift()!
          const textGenerator = textGeneratorQueue.get(responseId)
          if (!textGenerator) {
            console.error('No text generator found for responseId', responseId)
            continue
          }

          try {
            console.log('Starting speech stream')
            currentSpeechStream = await streamSpeech({
              model: elevenlabs.SpeechGenerator({
                model: model,
                voice: voiceId,
                optimizeStreamingLatency: 3,
                voiceSettings: { stability: 1, similarityBoost: 0.35 },
                generationConfig: {
                  chunkLengthSchedule: [50, 90, 120, 150, 200],
                },
              }),
              text: textGenerator,
            })

            for await (const part of currentSpeechStream) {
              console.log('socket.readyState', socket.readyState)
              if (socket.readyState === WebSocket.OPEN) {
                console.log('Sending chunk')
                socket.send(part) // Send the chunk directly as binary data
                await new Promise(resolve => setTimeout(resolve, 10)) // Throttle sending
              }
            }
          } catch (err) {
            console.error('Error streaming speech', err)
          } finally {
            textGeneratorQueue.delete(responseId)
            isSpeechStreamRunning = false // Mark the stream as finished
          }
        }
      }

      /* USER INPUT STREAM */
      socket.on('message', async message => {
        const data = messageSchema.parse(JSON.parse(message.toString()))
        console.log('socket.on message', data)
        const { type } = data

        if (type === 'message') {
          socket.send(
            JSON.stringify({
              id: new Date().toISOString(),
              text: 'processing...',
              sender: agentData.name,
              type: 'status',
            })
          )

          agent.emit(
            'message',
            agent.formatEvent<{ responseId: number }>({
              content: data.text,
              sender: 'client',
              channel: channelId,
              eventName: 'message',
              data: {
                responseId: numId(),
              },
            })
          )
        }

        if (type === 'toggleAudio') {
          console.log('Toggling send audio!')
          sendAudio = !sendAudio
          console.log('sendAudio', sendAudio)
        }

        if (type === 'voiceId') {
          console.log('Changing voiceId')
          voiceId = data.text
          console.log('voiceId', voiceId)
        }
      })

      /* AGENT MESSAGE OUTPUT STREAM */
      agent.on('messageStream', async actionPayload => {
        // if (actionPayload.event.channel !== channelId) return // Ignore messages not for this channel
        try {
          const event = actionPayload.event
          const responseId = (event.data as { responseId: string }).responseId
          const content = actionPayload.data.content
          console.log('agent.on messageStream', content)

          // Send the text chunk to the client
          socket.send(
            JSON.stringify({
              id: v4(),
              sender: agentData.name,
              text: content,
              type: 'message',
              responseId: responseId,
            })
          )

          if (!sendAudio) return

          if (content === '<START>') {
            console.log('Starting text to speech')

            // Queue the speech generation request
            const newTextGenerator = createTextStreamGenerator()
            console.log('Pushing to queue with responseId', responseId)
            textGeneratorQueue.set(responseId, newTextGenerator)
            speechQueue.push({ responseId })

            // If no stream is running, start processing the queue
            if (!isSpeechStreamRunning) {
              processSpeechQueue()
            }
          } else if (content === '<END>') {
            // Find the correct text generator in the queue and end it

            const textGenerator = textGeneratorQueue.get(responseId)

            if (textGenerator) {
              textGenerator.endStream()
            }
          } else {
            const textGenerator = textGeneratorQueue.get(responseId)

            if (textGenerator) {
              console.log('Adding content to text generator')
              textGenerator.addToken(content)
            }
          }
        } catch (error) {
          console.error('Error in agent.on messageStream', error)
        }
      })

      /* OTHER SOCKETS */
      agent.on('message', actionPayload => {
        const { content } = actionPayload
        console.log('agent.on message', content)
      })

      agent.on('messageReceived', async actionPayload => {
        // if (actionPayload.event.channel !== channelId) return // Ignore messages not for this channel
        console.log('agent.on messageReceived', actionPayload)
        const text = actionPayload.data.content
        socket.send(
          JSON.stringify({
            id: new Date().toISOString(),
            sender: agentData.name,
            text,
            type: 'message',
          })
        )

        if (!sendAudio) return

        try {
          const speech = await generateSpeech({
            model: elevenlabs.SpeechGenerator({
              model: model,
              voice: voiceId,
            }),
            text,
          })
          socket.send(speech)
        } catch (err) {
          console.error('Error generating speech', err)
        }
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
    }
  )

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
