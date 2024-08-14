import { initApp } from '@magickml/agent-server'
import { SpellInterface } from '@magickml/agent-server-schemas'
import { Agent } from '@magickml/agents'

const AGENT_ID = 'e9005717-d02c-4399-9740-ced783c727b3'
const PROJECT_ID = 'clzd9ymf30001dvsxf9r08exv'

const testSpell = {
  id: '1ac9b686-ea6b-463a-a221-2e5d1466406b',
  name: 'first-spell',
  projectId: 'clzd9ymf30001dvsxf9r08exv',
  createdAt: '2024-08-13T18:50:04.541Z',
  updatedAt: '1723575164458',
  type: 'behave',
  spellReleaseId: null,
  worldId: null,
  graph: {
    nodes: [
      {
        id: 'c6b8cf7a-c429-4f88-9024-56af101b8d55',
        type: 'logic/string',
        metadata: {
          positionX: '-77.20632108991845',
          positionY: '587.1242318540455',
        },
        parameters: {
          a: {
            value: "always respond with 'Hello World'",
          },
        },
        configuration: {},
      },
      {
        id: 'aba2a6b6-d7fc-416b-a10d-1f0a5f308d4e',
        type: 'magick/sendMessage',
        metadata: {
          positionX: '594.6266462433362',
          positionY: '358.9089114014927',
        },
        parameters: {
          content: {
            link: {
              nodeId: '780a68dd-aff9-4a64-bb2f-38e2e600f5d9',
              socket: 'response',
            },
          },
        },
        configuration: {},
      },
      {
        id: '780a68dd-aff9-4a64-bb2f-38e2e600f5d9',
        type: 'magick/generateText',
        flows: {
          done: {
            nodeId: 'aba2a6b6-d7fc-416b-a10d-1f0a5f308d4e',
            socket: 'flow',
          },
        },
        metadata: {
          positionX: '254.4532035359356',
          positionY: '360.2907561197659',
        },
        parameters: {
          prompt: {
            link: {
              nodeId: 'd43f20b9-14f1-4ea4-ae4d-6ce788c004df',
              socket: 'content',
            },
          },
          system: {
            link: {
              nodeId: 'c6b8cf7a-c429-4f88-9024-56af101b8d55',
              socket: 'result',
            },
          },
        },
        configuration: {
          model: 'gpt-3.5-turbo',
          models: [],
          customBaseUrl: '',
          modelProvider: 'openai',
          modelProviders: [],
          hiddenProperties: [
            'hiddenProperties',
            'modelProvider',
            'model',
            'models',
            'customBaseUrl',
            'providerApiKeyName',
          ],
          providerApiKeyName: 'OPENAI_API_KEY',
        },
      },
      {
        id: 'd43f20b9-14f1-4ea4-ae4d-6ce788c004df',
        type: 'magick/onMessage',
        flows: {
          flow: {
            nodeId: '780a68dd-aff9-4a64-bb2f-38e2e600f5d9',
            socket: 'flow',
          },
        },
        metadata: {
          positionX: '-75.44987775747575',
          positionY: '360.1453780598829',
        },
        configuration: {
          eventState: [],
          hiddenProperties: ['hiddenProperties', 'eventState'],
          eventStateProperties: [
            'connector',
            'client',
            'channel',
            'agentId',
            'sender',
          ],
        },
      },
    ],
    variables: [],
    graphInputs: [],
    customEvents: [],
    graphOutputs: [],
  },
} as SpellInterface

describe('Agent Standalone Integration', () => {
  let agent: Agent

  beforeAll(async () => {
    const app = await initApp()
    const pubsub = await app.get('pubsub')
    agent = await new Agent(
      {
        id: AGENT_ID,
        projectId: PROJECT_ID,
        name: 'test',
        version: '2.0',
      },
      pubsub,
      app
    )
    await agent.waitForInitialization()

    await agent.spellbook.loadSpells([testSpell])
    console.log('Agent initialized')
  })

  afterAll(async () => {})

  it('should have a spell in the spellbook', async () => {
    const spells = await agent.spellbook.getSpells()

    expect(spells.size).toBe(1)
  })

  it('should emit and receive a message event', done => {
    const messagePromise = new Promise(resolve => {
      agent.on('messageReceived', response => {
        resolve(response)
      })
    })

    // Ensure agent is ready before sending message
    agent.emit(
      'message',
      agent.formatEvent({
        content: 'trigger event',
        sender: 'user',
        channel: 'agent',
        eventName: 'message',
        skipPersist: true,
        rawData: 'trigger event',
      })
    )

    messagePromise
      .then((response: any) => {
        try {
          console.log('response', response)
          expect(response.data).toHaveProperty('content', 'Hello World')
          expect(response.event).toHaveProperty('agentId', AGENT_ID)
          done()
        } catch (error) {
          done(error)
        }
      })
      .catch(error => {
        done(error)
      })
  })
})
