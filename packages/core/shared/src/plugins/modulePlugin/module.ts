export class Module {
  secrets?: Record<string, string>
  publicVariables?: Record<string, string>
  inputs: Record<string, unknown>
  outputs: Record<string, unknown>
  agent?: any // set to Agent, but move Agent to engine first
  app?: any // set to App, but move App to engine first
  constructor() {
    this.inputs = {}
    this.outputs = {}
    this.secrets = {}
    this.publicVariables = {}
    this.app = null
  }

  read({ inputs, secrets, publicVariables, agent, app }) {
    this.inputs = inputs
    this.secrets = secrets || ({} as Record<string, string>)
    this.publicVariables = publicVariables || ({} as Record<string, string>)
    this.agent = agent
    this.app = app
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

  getApp(){
    return this.app
  }
}
