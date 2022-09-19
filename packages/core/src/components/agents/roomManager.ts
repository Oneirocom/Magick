// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import room3d from './room3d'

export class roomManager {
    static instance

    rooms = {}

    constructor() {
        roomManager.instance = this
    }

    addUser(user, client) {
        if (this.rooms[client] !== undefined) {
            for (let i = 0; i < this.rooms[client].length; i++) {
                if (this.rooms[client][i].isFull()) {
                    continue
                }
                this.rooms[client][i].addUser(user)
                return
            }
            rooms[clients].push(new room3d([user]))
        } else {
            this.rooms[client] = []
            this.rooms[client].push(new room3d([user]))
        }
    }
    removeUser(user, client) {
        if (this.rooms[client] !== undefined) {
            for (let i = 0; i < this.rooms[client].length; i++) {
                if (this.rooms[client][i].userExists(user)) {
                    this.rooms[client][i].removeUser(user)
                    if (this.rooms[client][i].isEmpty()) {
                        this.rooms[client].splice(i, 1)
                        if (this.rooms[client].length === 0) {
                            delete this.rooms[client]
                        }
                    }
                    return
                }
            }
        }
    }

    getUsersDistance(user, client) {
        if (this.rooms[client] !== undefined) {
            for (let i = 0; i < this.rooms[client].length; i++) {
                if (this.rooms[client][i].userExists(user)) {
                    return this.rooms[client][i].getUsersDistance(user)
                }
            }
        }

        this.addUser(user, client)
        return this.getUsersDistance(user, client)
    }

    userTalkedSameTopic(user, client) {
        if (this.rooms[client] !== undefined) {
            for (let i = 0; i < this.rooms[client].length; i++) {
                if (this.rooms[client][i].userExists(user)) {
                    this.rooms[client][i].userTalkedSameTopic(user)
                    return this.rooms[client][i].getUsersDistance(user)
                }
            }
        }

        this.addUser(user, client)
        return this.userTalkedSameTopic(user, client)
    }
    userGotInConversationFromAgent(user, client) {
        if (this.rooms[client] !== undefined) {
            for (let i = 0; i < this.rooms[client].length; i++) {
                if (this.rooms[client][i].userExists(user)) {
                    this.rooms[client][i].userGotInConversationFromAgent(user)
                    return this.rooms[client][i].getUsersDistance(user)
                }
            }
        }

        this.addUser(user, client)
        return this.userGotInConversationFromAgent(user, client)
    }
    userPingedSomeoneElse(user, client) {
        if (this.rooms[client] !== undefined) {
            for (let i = 0; i < this.rooms[client].length; i++) {
                if (this.rooms[client][i].userExists(user)) {
                    this.rooms[client][i].userPingedSomeoneElse(user)
                    return this.rooms[client][i].getUsersDistance(user)
                }
            }
        }

        this.addUser(user, client)
        return this.userPingedSomeoneElse(user, client)
    }
    agentCanResponse(user, client) {
        if (this.rooms[client] !== undefined) {
            for (let i = 0; i < this.rooms[client].length; i++) {
                if (this.rooms[client][i].userExists(user)) {
                    return this.rooms[client][i].agentCanResponse(user)
                }
            }
        }

        this.addUser(user, client)
        return false
    }

    print() {
        for (const client in this.rooms) {
            console.log(client + ' rooms:')
            if (this.rooms[client] && this.rooms[client] !== undefined) {
                for (let i = 0; i < this.rooms[client].length; i++) {
                    this.rooms[client][i].print()
                }
            } else {
                console.log('no rooms')
            }
            console.log('----------------')
        }
    }
}

export default roomManager
