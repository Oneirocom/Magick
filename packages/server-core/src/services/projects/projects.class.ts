import { Params } from '@feathersjs/feathers'
import { app } from '../../app'

interface CreateData {
  agents
  documents
  spells
  projectId: string
}

export interface ProjectParams extends Params {
  user: any
}

// interface Data {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class ProjectsService {
  async find(
    params?: ProjectParams
  ): Promise<{ agents: any; spells: any; documents: any }> {
    const { query } = params
    const projectId = query.projectId

    // get all agents for this projectId
    const [agents, spells, documents] = await Promise.all([
      app.service('agents').find({
        query: {
          projectId,
        },
      }),
      app.service('spells').find({
        query: {
          projectId,
        },
      }),
      app.service('documents').find({
        query: {
          projectId,
        },
      }),
    ])

    return {
      agents: agents.data,
      spells: spells.data,
      documents: documents.data,
    }
  }

  async create(data: CreateData): Promise<{
    agents: any
    spells: any
    documents: any
  }> {
    const { agents, documents, spells, projectId } = data

    const mappedAgents = agents.map(agent => {
      delete agent.id
      // stringify spells
      agent.spells = '[]'
      if (!agent.data) agent.data = '{}'
      agent.enabled = false
      agent.projectId = projectId
      return agent
    })

    const mappedDocuments = documents.map(doc => {
      delete doc.id
      doc.projectId = projectId
      return doc
    })

    const mappedSpells = spells.map(spell => {
      delete spell.id
      delete spell.updatedAt
      spell.projectId = projectId
      return spell
    })

    const agentResponse = []
    if (mappedAgents.length > 0) {
      mappedAgents.forEach(async agent => {
        console.log('setting agent', agent)
        const r = await app.service('agents').create(agent)
        agentResponse.push(r)
      })
    }

    const documentResponse = []
    if (mappedDocuments.length > 0) {
      mappedDocuments.forEach(async doc => {
        console.log('setting doc', doc)
        const r = await app.service('documents').create(doc)
        documentResponse.push(r)
      })
    }

    const spellResponse = []

    if (mappedSpells.length > 0) {
      mappedSpells.forEach(async spell => {
        console.log('setting spell', spell)
        const r = await app.service('spells').create(spell)
        spellResponse.push(r)
      })
    }

    return {
      agents: agentResponse,
      spells: documentResponse,
      documents: spellResponse,
    }
  }
}
