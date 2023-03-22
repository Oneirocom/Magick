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

  async create(data: CreateData): Promise<void> {
    let { agents, documents, spells, projectId } = data

    // remove the 'id' field from each agent, document, spell
    agents = agents
    documents = documents


    console.log('create data', data)
    const agentPromise = agents.length > 0 ? app
      .service('agents')
      .create(agents.map(agent => {
        delete agent.id
        return agent
      }).map(agent => ({ ...agent, projectId }))) : Promise.resolve()
    const documentPromise = documents.length > 0 ? app
      .service('documents')
      .create(documents.map(doc => {
        delete doc.id
        return doc
      }).map(doc => ({ ...doc, projectId }))) : Promise.resolve()
    const spellPromise = spells.length > 0 ? app
      .service('spells')
      .create(spells.map(spell => {
        delete spell.id
        delete spell.updatedAt
        return spell
      }).map(spell => ({ ...spell, projectId }))) : Promise.resolve()
    await Promise.all([
      agentPromise,
      documentPromise,
      spellPromise,
    ])

    return
  }
}
