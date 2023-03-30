// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import type { Agent } from '@magickml/server-core'

export class Module {
  secrets?: Record<string, string>
  publicVariables?: Record<string, string>
  inputs: Record<string, unknown>
  outputs: Record<string, unknown>
  agent?: Agent
  constructor() {
    this.inputs = {}
    this.outputs = {}
    this.secrets = {}
    this.publicVariables = {}
  }

  read({ inputs, secrets, publicVariables, agent }) {
    this.inputs = inputs
    this.secrets = secrets || ({} as Record<string, string>)
    this.publicVariables = publicVariables || ({} as Record<string, string>)
    this.agent = agent
  }

  write(outputs: Record<string, unknown>) {
    Object.keys(this.outputs).forEach(key => {
      outputs[key] = this.outputs[key]
    })
  }

  getInput(key: string) {
    return this.inputs[key]
  }

  setOutput(key: string, value: unknown) {
    this.outputs[key] = value
  }

  getSecrets() {
    return this.secrets
  }

  getPublicVariables() {
    return this.publicVariables
  }
}
