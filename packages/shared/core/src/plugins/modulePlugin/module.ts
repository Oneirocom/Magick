type ReadArgs = {
  inputs: Record<string, unknown>
  secrets?: Record<string, string>
  publicVariables?: Record<string, unknown>
  app?: any
  sessionId?: string
}

export class Module {
  secrets?: Record<string, string>
  publicVariables?: Record<string, unknown>
  inputs: Record<string, unknown>
  outputs: Record<string, unknown>
  sessionId?: string
  isPlaytest: boolean
  app?: any // set to App, but move App to engine first
  constructor() {
    this.inputs = {}
    this.outputs = {}
    this.secrets = {}
    this.publicVariables = {}
    this.app = null
    this.isPlaytest = false
  }

  read({
    inputs,
    secrets,
    publicVariables,
    app,
    sessionId,
    isPlaytest = false,
  }) {
    this.inputs = inputs
    this.secrets = secrets || ({} as Record<string, string>)
    this.publicVariables = publicVariables || ({} as Record<string, unknown>)
    this.app = app
    this.sessionId = sessionId
    this.isPlaytest = isPlaytest
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

  getApp() {
    return this.app
  }
}
