import { weaviate_connection } from "../utils/weaviateInit"

export class EventsQAService{
    constructor(){}
    async create(body, params){
        const question = body["question"] as string
        const agentId = body["agentId"] as string
        console.log("Inside EventQA", question)
        console.log(agentId)
        const answer = await weaviate_connection.searchEvents(question, parseInt(agentId))
        console.log(answer)
        return (answer)
    }
}