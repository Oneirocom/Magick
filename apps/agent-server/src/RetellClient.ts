import { Agent } from 'server/agents'
import { WebSocket } from 'ws'

interface Utterance {
  role: 'agent' | 'user'
  content: string
}

// LLM Websocket Request Object
export interface RetellRequest {
  response_id?: number
  transcript: Utterance[]
  interaction_type: 'update_only' | 'response_required' | 'reminder_required'
}

// LLM Websocket Response Object
export interface RetellResponse {
  response_id?: number
  content: string
  content_complete: boolean
  end_call: boolean
}

export class LLMDummyMock {
  agent: Agent

  constructor(agent: Agent) {
    this.agent = agent
  }

  // First sentence requested
  BeginMessage(ws: WebSocket) {
    const res: RetellResponse = {
      response_id: 0,
      content: 'How may I help you?',
      content_complete: true,
      end_call: false,
    }
    ws.send(JSON.stringify(res))
  }

  async DraftResponse(request: RetellRequest, ws: WebSocket) {
    if (request.interaction_type === 'update_only') {
      // process live transcript update if needed
      return
    }

    try {
      const res: RetellResponse = {
        response_id: request.response_id,
        content: 'I am sorry, can you say that again?',
        content_complete: true,
        end_call: false,
      }
      ws.send(JSON.stringify(res))
    } catch (err) {
      console.error('Error in gpt stream: ', err)
    }
  }
}
