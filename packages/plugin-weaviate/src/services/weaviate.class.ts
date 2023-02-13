import { weaviate_connection, initWeaviateClientEvent } from "../utils/weaviateInit"

export class WeaviateService {
    constructor(){
        initWeaviateClientEvent()
    }
    async create(body, params){
        console.log('createEventWeaviate', body)
        try {
            await weaviate_connection.createEvent(body)
            return ("ok")
        } catch(e) {
            console.log('********** WEAVIATE ERROR **********')
            console.log(e)
            return ('internal error')
        }
    }
    async find(body, params){
        console.log("getEventsWeaviate")
        try{
            console.log("Inside in TRY")
            console.log(body)
            const events = await weaviate_connection.getEvents(body['query'])
            return ({ events })
        } catch (e) {
            console.log(e)
            return ("Error")
        }
    }
    

    async remove(body, params){
        try {
            const ret_val = await weaviate_connection.getAndDeleteEvents(params["query"]);
            if (ret_val === 0){
                return("No events Present")
            } else{
                return ("Deleted " + ret_val.toString()+" Events")
            }
            
        } catch(e) {
            console.log(e)
            return ('internal error')
        }
    }
}