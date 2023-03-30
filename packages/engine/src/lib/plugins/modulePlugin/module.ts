// GENERATED 
/**
 * Represents a generic module that can be executed by an Agent.
 */
import { Agent } from "@magickml/server-core"

export class Module {

  /**
   * Secrets configuration of the module.
   */
  secrets?: Record<string, string>

  /**
   * Public variables configuration of the module.
   */
  publicVariables?: Record<string, string>

  /**
   * Input configuration of the module.
   */
  inputs: Record<string, unknown>

  /**
   * Output configuration of the module.
   */
  outputs: Record<string, unknown>

  /**
   * The Agent associated with the module.
   */
  agent?: Agent

  /**
   * Creates a new instance of the Module class.
   */
  constructor() {
    this.inputs = {}
    this.outputs = {}
    this.secrets = {}
    this.publicVariables = {}
  }

  /**
   * Reads input, secrets, public variables and agent configuration.
   * @param param0 Object with input, secrets, publicVariables and agent.
   */
  read({ inputs, secrets, publicVariables, agent }) {
    this.inputs = inputs
    this.secrets = secrets || {} as Record<string, string>
    this.publicVariables = publicVariables || {} as Record<string, string>
    this.agent = agent
  }

  /**
   * Iterates over the Module's outputs and copies them to another object.
   * @param outputs Record to copy the Module's outputs to.
   */
  write(outputs: Record<string, unknown>) {
    Object.keys(this.outputs).forEach(key => {
      outputs[key] = this.outputs[key]
    })
  }

  /**
   * Returns the value of a specific input.
   * @param key The key of the input to retrieve.
   */
  getInput(key: string) {
    return this.inputs[key]
  }

  /**
   * Sets the value of a specific output.
   * @param key The key of the output to set.
   * @param value The value to set for the output.
   */
  setOutput(key: string, value: unknown) {
    this.outputs[key] = value
  }

  /**
   * Returns the secrets configuration of the module.
   */
  getSecrets() {
    return this.secrets
  }

  /**
   * Returns the public variables configuration of the module.
   */
  getPublicVariables() {
    return this.publicVariables
  }
}