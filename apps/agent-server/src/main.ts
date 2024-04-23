import { RawData, WebSocket } from 'ws'
import express, { Request } from 'express'
import expressWsConfig from 'express-ws'
import { LLMDummyMock, RetellRequest, RetellResponse } from './RetellClient'
import { initApp } from 'server/core'
import { Agent } from 'server/agents'

const app = express()

const agentApp = await initApp()
const agentId = 'b0387ccc-f3f2-4da6-bcad-ce30c021ee26'

const expressWs = expressWsConfig(app)
const port = 3000

// Your other API endpoints
expressWs.app.get('/', (req, res) => {
  res.send('Hello World!')
})

expressWs.app.ws(
  '/llm-websocket/:call_id',
  async (ws: WebSocket, req: Request) => {
    const callId = req.params.call_id

    const agentData = await agentApp.service('agents').get(agentId)
    const agent = new Agent(agentData, agentApp.get('pubsub'), agentApp)
    const llmClient = new LLMDummyMock(agent)

    ws.on('error', (err: Error) => {
      console.error('Error received in LLM websocket client: ', err)
      agent.removeAllListeners()
    })

    ws.on('close', (code: number, reason: string) => {
      console.log(
        `LLM websocket closed with code ${code} and reason: ${reason}`
      )
      agent.removeAllListeners()
    })

    // Send Begin message
    llmClient.BeginMessage(ws)

    agent.emit(
      'message',
      agent.formatEvent<{ responseId: number }>({
        content:
          'Hello!  Please say a greeting to me to start our conversation.',
        sender: callId,
        eventName: 'message',
        data: {
          responseId: 0,
        },
      })
    )

    agent.on('messageStream', actionPayload => {
      const event = actionPayload.event
      console.log('Message stream received', event)
      console.log('Event data', event.data)
      const response: RetellResponse = {
        response_id: (event.data as any).responseId,
        content: actionPayload.data.content,
        content_complete: false,
        end_call: false,
      }

      console.log('Sending response: ', response)

      ws.send(JSON.stringify(response))
    })

    agent.on('eventComplete', event => {
      const res: RetellResponse = {
        response_id: (event.data as any).responseId,
        content: '',
        content_complete: true,
        end_call: false,
      }
      console.log('Event complete', res)
      ws.send(JSON.stringify(res))
    })

    agent.on('messageReceived', actionPayload => {
      console.log('Message received', actionPayload)
    })

    ws.on('message', async (data: RawData, isBinary: boolean) => {
      if (isBinary) {
        console.error('Got binary message instead of text in websocket.')
        ws.close(1002, 'Cannot find corresponding Retell LLM.')
      }
      try {
        const request: RetellRequest = JSON.parse(data.toString())
        // LLM will think about a response
        // llmClient.DraftResponse(request, ws)

        if (request.interaction_type === 'update_only') {
          // process live transcript update if needed
          return
        }

        console.log('LLM websocket message received: ', request)

        const transcript = request.transcript
        const content = transcript[transcript.length - 1].content

        // a buit hacky for now, but we want to refresh the event and clear any previous processing.
        await agent.spellbook.refreshSpells()

        agent.emit(
          'message',
          agent.formatEvent<{ responseId: number }>({
            content,
            sender: callId,
            eventName: 'message',
            data: {
              responseId: request.response_id,
            },
          })
        )
      } catch (err) {
        console.error('Error in parsing LLM websocket message: ', err)
        ws.close(1002, 'Cannot parse incoming message.')
      }
    })
  }
)

expressWs.app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
