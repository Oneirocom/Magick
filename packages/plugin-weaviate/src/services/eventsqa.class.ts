import { weaviate_connection } from "../utils/weaviateInit"

export class EventsQAService{
    constructor(){}
    async create(body, params){
        const question = body["question"] as string
        const entities = body["entities"] as string[]
        console.log("Inside EventQA", question)
        console.log(entities)
        const answer = await weaviate_connection.searchEvents(question, entities)
        console.log(answer)
        return (answer)
    }
}