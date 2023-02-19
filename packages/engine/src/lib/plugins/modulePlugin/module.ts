export class Module {
  inputs: Record<string, unknown>
  outputs: Record<string, unknown>
  constructor() {
    this.inputs = {}
    this.outputs = {}
  }

  read(inputs: Record<string, unknown[]>) {
    this.inputs = inputs
  }

  write(outputs: Record<string, any>) {
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
}
