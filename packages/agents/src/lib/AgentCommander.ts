import EventEmitter from "events"
import { Agent } from "packages/core/server/src/services/agents/agents.schema"
import type { AgentJob } from '@magickml/agents'
import { MagickSpellInput } from "@magickml/core"

type PubSub = any
type Reporter = any
type MessageQueue = any

type RunRootSpellArgs = {
    agent: Agent,
    inputs: MagickSpellInput
    componentName?: string
    runSubspell?: boolean
    secrets?: Record<string, string>
    publicVariables?: Record<string, unknown>
    spellId?: string
}

export class AgentCommander extends EventEmitter {
    pubSub: PubSub
    reporter: Reporter
    messageQueue: any

    constructor() {
        super()
        this.pubSub = new PubSub()
        this.reporter = new Reporter()
        this.messageQueue = new MessageQueue()
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
        await this.messageQueue(`agent:${agent.id}:run`, {
            data: {
                agentId: agent.id,
                spellId: spellId || agent.rootSpellId,
                inputs,
                componentName,
                runSubspell,
                secrets,
                publicVariables
            }
        } as AgentJob)
    }
}
