import EventEmitter from "events"
import type { Agent } from "packages/core/server/src/services/agents/agents.schema"
import { type PubSub } from '@magickml/server-core'
import { AGENT_RUN_JOB, AGENT_RUN_RESULT, AGENT_DELETE, getLogger } from '@magickml/core'
import type { MagickSpellInput } from "@magickml/core"
import { v4 as uuidv4 } from 'uuid'
import type pino from "pino"
import { AgentResult } from "./Agent"

export type RunRootSpellArgs = {
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
}

export class AgentCommander extends EventEmitter {
    pubSub: PubSub
    logger: pino.Logger = getLogger()

    constructor({
        pubSub,
    }: AgentCommanderArgs) {
        super()
        this.pubSub = pubSub
    }

    async runSpellWithResponse(args: RunRootSpellArgs) {
        const { agent } = args
        const jobId = await this.runSpell(args);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('Timeout'))
            }, 1200000)

            this.pubSub.subscribe(AGENT_RUN_RESULT(agent.id), (data: AgentResult) => {
                if (data.result.error) {
                    this.logger.error(data.result.error)
                    throw new Error(`Error running spell on agent: ${data.result.error}`)
                }

                if (data.jobId === jobId) {
                    this.pubSub.unsubscribe(AGENT_RUN_RESULT(agent.id))
                    resolve(data.result)
                }
            })
        })
    }

    async runSpell({
        agent,
        inputs,
        componentName,
        runSubspell,
        secrets,
        publicVariables,
        spellId
    }: RunRootSpellArgs) {
        this.logger.debug(`Running Spell on Agent: ${agent.id}`)
        this.logger.debug(AGENT_RUN_JOB(agent.id))
        const jobId = uuidv4()
        await this.pubSub.publish(AGENT_RUN_JOB(agent.id), JSON.stringify({
            jobId,
            agentId: agent.id,
            spellId: spellId || agent.rootSpellId,
            inputs,
            componentName,
            runSubspell,
            secrets,
            publicVariables
        }))
        return jobId
    }

    async removeAgent(agentId: string) {
        this.pubSub.emit(AGENT_DELETE, agentId)
    }
}
