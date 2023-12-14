// DOCUMENTED
import { Params } from '@feathersjs/feathers'
import { app } from '../../app'
import { v4 as uuidv4 } from 'uuid'

/**
 * Interface for CreateData objects
 */
interface CreateData {
  agents: any // Add specific type if possible
  documents: any // Add specific type if possible
  spells: any // Add specific type if possible
  projectId: string
}

/**
 * Interface for custom params including user information
 */
export interface ProjectParams extends Params {
  user: any // Add specific type if possible
  query: any
}

/**
 * ProjectsService class provides functionality to find and create projects.
 * By default, it calls the standard Knex adapter service methods,
 * but can be customized with your own functionality.
 */
export class ProjectsService {
  /**
   * Find projects with matching projectId and return their agents, spells, and documents.
   * @param params - Project and user parameters
   * @returns - An object containing the agents, spells and documents of the project
   */
  async find(
    params: ProjectParams
  ): Promise<{ agents: any; spells: any; documents: any }> {
    const { query } = params
    const projectId = query.projectId

    // check for returnAgents, returnSpells, and returnDocuments
    const returnAgents = query?.returnAgents
    const returnSpells = query?.returnSpells
    const returnDocuments = query?.returnDocuments

    const returnAll = !returnAgents && !returnSpells && !returnDocuments

    // check for omitEmbeddings
    const omitEmbeddings = query?.omitEmbeddings

    // Prepare the promises for fetching agents, spells, and documents
    const fetchPromises = [] as any[]

    if (returnAgents || returnAll) {
      fetchPromises.push(
        app.service('agents').find({
          query: {
            projectId,
          },
        })
      )
    }

    if (returnSpells || returnAll) {
      fetchPromises.push(
        app.service('spells').find({
          query: {
            projectId,
          },
        })
      )
    }

    if (returnDocuments || returnAll) {
      const documentQuery: any = {
        projectId,
      }
      // If omitEmbeddings is true, select all columns except the 'embedding' column
      if (omitEmbeddings) {
        documentQuery.$select = ['type', 'projectId', 'content', 'date']
      }

      fetchPromises.push(
        app.service('documents').find({
          query: documentQuery,
        })
      )
    }

    const results = await Promise.all(fetchPromises)

    let agentsResult, spellsResult, documentsResult

    if (returnAgents || returnAll) {
      agentsResult = results.shift()
    }

    if (returnSpells || returnAll) {
      spellsResult = results.shift()
    }

    if (returnDocuments || returnAll) {
      documentsResult = results.shift()
    }

    return {
      agents: agentsResult ? agentsResult.data : null,
      spells: spellsResult ? spellsResult.data : null,
      documents: documentsResult ? documentsResult.data : null,
    }
  }

  /**
   * Create a new project with the given data (agents, documents, spells, projectId)
   * @param data - The data required to create a new project
   * @returns - An object containing the created agents, spells and documents
   */
  async create(data: CreateData): Promise<{
    agents: any
    spells: any
    documents: any
  }> {
    const { agents, documents, spells, projectId } = data

    // If replace is true, delete all agents, documents, and spells for this projectId
    if ((data as any).replace) {
      await Promise.all([
        //TODO: This type cooersion is hacky but the feathers service type says it expects a string. maybe need to update types?
        app.service('agents').remove(null as unknown as string, {
          query: {
            projectId,
          },
        }),
        //TODO: This type cooersion is hacky but the feathers service type says it expects a string. maybe need to update types?
        app.service('spells').remove(null as unknown as string, {
          query: {
            projectId,
          },
        }),
        //TODO: This type cooersion is hacky but the feathers service type says it expects a string. maybe need to update types?
        app.service('documents').remove(null as unknown as string, {
          query: {
            projectId,
          },
        }),
      ])
    }

    // Map agents, documents, and spells with updated information for the new project
    const mappedAgents = (agents ?? []).map(agent => {
      delete agent.id
      if (!agent.data) agent.data = '{}'
      if ('spells' in agent) delete agent.spells // <-- Updated to fix eliza import
      agent.enabled = false
      agent.projectId = projectId
      agent.secrets = JSON.stringify(agent.secrets || {})
      return agent
    })

    const mappedDocuments = (documents ?? []).map(doc => {
      delete doc.id
      doc.projectId = projectId
      return doc
    })

    // Create a key value of old IDs to new IDs for spells
    const spellKeys = {}

    const mappedSpells = (spells ?? []).map(spell => {
      delete spell.updatedAt

      // generate new uuid
      const newId = uuidv4()
      spellKeys[spell.id] = newId
      spell.id = newId

      delete spell.creatorId
      spell.projectId = projectId
      return spell
    })

    // interate through all spells and replace the UUID of any Spell Nodes with the new UUID
    mappedSpells.forEach(spell => {
      const nodes = Object.values(spell.graph.nodes) as any[]
      nodes.forEach(node => {
        if (node.name === 'Spell') {
          node.data.spellId = spellKeys[node.data.spellId]
        }
      })
    })

    // Create and store new agents, documents, and spells
    const agentResponse: any[] = []
    if (mappedAgents.length > 0) {
      mappedAgents.forEach(async agent => {
        // todo: clear this up so validation works
        delete agent.runState

        const r = await app.service('agents').create(agent)
        agentResponse.push(r)
      })
    }

    const documentResponse: any[] = []
    if (mappedDocuments.length > 0) {
      mappedDocuments.forEach(async doc => {
        const r = await app.service('documents').create(doc)
        documentResponse.push(r)
      })
    }

    const spellResponse: any[] = []
    mappedSpells?.forEach(async spell => {
      delete spell.creatorId
      const r = await app.service('spells').create(spell)
      spellResponse.push(r)
    })

    return {
      agents: agentResponse,
      spells: spellResponse,
      documents: documentResponse,
    }
  }
}
