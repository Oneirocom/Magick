//Creating two endpoint for discord
// 1. Input for Discord Input Node
//    1. EntityID
//    2. Content
//    3. Sender
import { DiscordAgentWindow } from "./components/agent.component"
import type { Id, Params } from '@feathersjs/feathers'
const DiscordInput = {
    create : async function (this, data) {
        const message = {
            entityID: data.entityID,
            content: data.content,
            sender: data.sender
        }
        return message
    },
    find: async function (this,data) {
        return this.arr_store
    }

}

export class MessageService {
    async find(params: Params) {
      return [
        {
          id: 1,
          text: 'Message 1'
        },
        {
          id: 2,
          text: 'Message 2'
        }
      ]
    }
  }

export { DiscordAgentWindow }

