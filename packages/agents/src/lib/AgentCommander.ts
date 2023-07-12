import EventEmitter from "events"
import { Agent } from "packages/core/server/src/services/agents/agents.schema"
import type { AgentJob } from '@magickml/agents'
import { type PubSub, type MessageQueue, RUN_JOB } from '@magickml/server-core'
import { MagickSpellInput } from "@magickml/core"

type RunRootSpellArgs = {
    agent: Agent,
    inputs: MagickSpellInput
    componentName?: string
    runSubspell?: boolean
    secrets?: Record<string, string>
    publicVariables?: Record<string, unknown>
    spellId?: string
}

interface AgentCommanderArgs {
    pubSub: PubSub
    messageQueue: MessageQueue
}


export class AgentCommander extends EventEmitter {
    pubSub: PubSub
    messageQueue: MessageQueue

    constructor({
        pubSub,
        messageQueue
    }: AgentCommanderArgs) {
        super()
        this.pubSub = pubSub
        this.messageQueue = messageQueue
    }

    async runRootSpellWithResponse(args: RunRootSpellArgs) {
        const { agent } = args
        await this.runRootSpell(args);


        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('Timeout'))
            }, 1200000)

            this.pubSub.subscribe(`agent:${agent.id}:run:result`, (result) => {
                if (result.error) {
                    reject(result.error)
                } else {
                    resolve(result)
                }
            })
        })
    }

    async runRootSpell({
        agent,
        inputs,
        componentName,
        runSubspell,
        secrets,
        publicVariables,
        spellId
    }: RunRootSpellArgs) {
        await this.messageQueue.addJob(RUN_JOB({ agentId: agent.id }), {
            data: {
                agentId: agent.id,
                spellId: spellId || agent.rootSpellId,
                inputs,
                componentName,
                runSubspell,
                secrets,
                publicVariables
            }
        })
    }
}
