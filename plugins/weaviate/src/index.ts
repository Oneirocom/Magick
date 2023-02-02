import { Event, GetEventArgs } from "packages/engine/src";
import type { Id, Params } from '@feathersjs/feathers'
import { weaviate_connection } from "./weaviateInit";
/* 
Creating endpoints for Weaviate
 1. Creating Events
    1. Type
    2. Sender
    3. Observer
    4. Client
    5. Channel
    6. Entities
    7. AgentID
    8. ChannelType
    9. Content
    10. Date

 2. Getting Events
    1. Observer
    2. Sender
    3. max_count
    4. max_time_diff

 3. Deleting Events
    1. Type
    2. Sender
    3. Observer
    4. Client
    5. Channel
    6. ChannelType
    8. maxCount
    9. max_time_diff
*/

export class WeaviateService {

    async create(event: Event){
        weaviate_connection.createEvent(event)
        return event
    }

    async find(event: GetEventArgs){
        return weaviate_connection.getEvents(event)
    }

    async remove(event: GetEventArgs){
        return weaviate_connection.getAndDeleteEvents(event)
    }

    
}