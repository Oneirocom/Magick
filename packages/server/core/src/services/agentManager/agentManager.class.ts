import type { Params } from '@feathersjs/feathers'
import type { Application } from '../../declarations'
import { ToggleRunAllData } from './agentManager.schema'
import { MANAGER_TOGGLE_RUN_ALL } from 'communication'

export type AgentManagerParams = Params<ToggleRunAllData>

export class AgentManagerService {
  app: Application

  constructor(app: Application) {
    this.app = app
  }

  async toggleRunAll(data: ToggleRunAllData) {
    try {
      this.app.get('pubsub').publish(MANAGER_TOGGLE_RUN_ALL, data)

      return {
        success: true,
        message: `Toggle run all for agent ${data.agentId} set to ${data.start}`,
      }
    } catch (error: any) {
      console.error('Error toggling run all:', error)
      throw error
    }
  }
}
