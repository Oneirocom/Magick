export class Module {
  inputs: object;
  outputs: object;
  constructor() {
    this.inputs = {};
    this.outputs = {};
  }

  read(inputs) {
    this.inputs = inputs;
  }

  write(outputs) {
    Object.keys(this.outputs).forEach((key) => {
      outputs[key] = this.outputs[key];
    });
  }

  getInput(key) {
    return this.inputs[key];
  }

  setOutput(key, value) {
    this.outputs[key] = value;
  }
}
