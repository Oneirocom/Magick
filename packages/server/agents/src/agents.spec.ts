import { initApp } from '@magickml/agent-server'
import { Agent } from '@magickml/agents'
import { testSpell1, testSpell2 } from './testSpells'

const AGENT_ID = 'e9005717-d02c-4399-9740-ced783c727b3'
const PROJECT_ID = 'clzd9ymf30001dvsxf9r08exv'

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

    console.log('Agent initialized')
  })

  afterAll(async () => {
    await agent.spellbook.clearSpells()
  })

  it('should have a spell in the spellbook', async () => {
    await agent.spellbook.loadSpells([testSpell1])
    const spells = await agent.spellbook.getSpells()

    expect(spells.size).toBe(1)
  })

  it('should emit and receive a message event', done => {
    ;(async () => {
      await agent.spellbook.loadSpells([testSpell1])
      const spells = await agent.spellbook.getSpells()
      expect(spells.size).toBe(1)
    })()

    const messagePromise = new Promise(resolve => {
      agent.on('messageReceived', response => {
        console.log('response', response)
        resolve(response)
      })
    })

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

  it('should be able to upload knowledge to embedder', done => {
    ;(async () => {
      await agent.spellbook.loadSpells([testSpell2])
      const spells = await agent.spellbook.getSpells()
      expect(spells.size).toBe(1)
    })()

    agent.on('messageReceived', response => {
      if (response.data.content === 'done') {
        try {
          expect(response.data).toHaveProperty('content', 'done')
          expect(response.event).toHaveProperty('agentId', AGENT_ID)
          done()
        } catch (error) {
          done(error)
        }
      }
    })

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
  }, 10000)
})
