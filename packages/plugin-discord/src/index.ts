//Creating two endpoint for discord
// 1. Input for Discord Input Node
//    1. EntityID
//    2. Content
//    3. Sender
const DiscordInput = {
    create : async function (this, data) {
        const message = {
            entityID: data.entityID,
            content: data.content,
            sender: data.sender
        };
        this.arr_store.push(message)
        return message
    },
    find: async function (this,data) {
        return this.arr_store
    }

}

export const pluginsContext = {
    "name" : "discordinput",
    "route" : DiscordInput,
    "nodes" : {} 
}