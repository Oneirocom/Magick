import type { Application } from 'server/core'
import pino from 'pino'
import io from 'socket.io'
import { extractNodes, initSharedEngine, MagickEngine } from '../engine'
import { getNodes } from '../nodes'
import { Module } from '../plugins/modulePlugin/module'
import {
  GraphData,
  MagickNode,
  MagickSpellInput,
  ModuleComponent,
  SpellInterface,
} from '../types'
import { extractModuleInputKeys } from './graphHelpers'
import SpellManager from './SpellManager'
import { getLogger } from '../logger'
import { NodeData } from 'shared/rete'
import { SPELLRUNNER_BUSY_TIMEOUT_MSEC } from 'shared/config'
import { AGENT_SPELL } from '../communication/agentEventTypes'

export type RunComponentArgs = {
  sessionId?: string
  isPlaytest?: boolean
  inputs: MagickSpellInput
  agent?: any
  componentName?: string
  runSubspell?: boolean
  secrets?: Record<string, string>
  publicVariables?: Record<string, unknown>
  app?: Application
}

type SpellRunnerConstructor = {
  app: Application
  socket?: io.Socket
  agent?: any
  spellManager: SpellManager
}

class SpellRunner {
  logger: pino.Logger = getLogger()
  engine: MagickEngine
  currentSpell!: SpellInterface
  module: Module
  ranSpells: string[] = []
  socket?: io.Socket | null = null
  app: Application
  agent?: any
  spellManager: SpellManager
  busy = false

  log(message, data) {
    this.logger.info(`${message} %o`, data)
    if (!this.agent) return

    this.agent.log(message, {
      spellId: this.currentSpell.id,
      projectId: this.currentSpell.projectId,
      ...data,
    })
  }

  warn(message, data) {
    this.logger.warn(`${message} %o`, data)
    if (!this.agent) return

    this.agent.warn(message, {
      spellId: this.currentSpell.id,
      projectId: this.currentSpell.projectId,
      ...data,
    })
  }

  emit(_message) {
    // same message emitted from server or agent
    const message = {
      ..._message,
      // make sure the message contains the spellId in case it is needed.
      spellId: this.currentSpell.id,
      projectId: this.currentSpell.projectId,
    }

    if (!this.agent) {
      // if we aren't in an agent, we are on the server.
      // Emit the event directly via the agent service
      this.logger.trace(
        'SPELLRUNNER: Emitting spell event from sandbox %o',
        message
      )
      this.app.service('agents').emit('spell', message)
    } else {
      // handle the case of the emit being run on an agent not the server
      // to do we probably want these events to be constants somewhere
      this.agent.publishEvent(AGENT_SPELL(this.agent.id), message)
    }
  }

  constructor({ app, socket, agent, spellManager }: SpellRunnerConstructor) {
    this.agent = agent
    this.spellManager = spellManager
    // Initialize the engine

    this.engine = initSharedEngine({
      name: 'demo@0.1.0',
      components: getNodes(),
      server: true,
      socket: socket || undefined,
      emit: this.emit.bind(this),
    }) as MagickEngine
    this.app = app

    // Set up the module to interface with the runtime processes
    this.module = new Module()

    if (socket) this.socket = socket

    // We should probably load up here all the "modules" the spell needds to run
    // This would basicallyt be an array of spells pulled from the DB
  }

  /**
   * Getter method for the triggers ins for the loaded spell
   */
  get triggerIns() {
    return this.engine.moduleManager.triggerIns
  }

  /**
   * Getter method for the inputs for the loaded spell
   */
  get inputs() {
    return this.engine.moduleManager.inputs
  }

  /**
   * Getter method which returns the run context for the current spell.
   */
  get context() {
    return {
      module: this.module,
      currentSpell: this.currentSpell,
      projectId: this.currentSpell.projectId,
      app: this.app,
      spellManager: this.spellManager,
      agent: this.agent,
      // TODO: add the secrets and publicVariables through the spellrunner for context
    }
  }

  get inputKeys() {
    return extractModuleInputKeys(this.currentSpell.graph)
  }

  /**
   * Getter method to return a formatted set of outputs of the most recent spell run.
   */
  get outputData() {
    const rawOutputs = {}
    this.module.write(rawOutputs)
    return this._formatOutputs(rawOutputs)
  }

  /**
   * Clears the cache of spells which the runner has ran.
   */
  private _clearRanSpellCache() {
    this.ranSpells = []
  }

  /**
   * Used to format inputs into the format the moduel runner expects.
   * Takes a normal object of type { key: value } and returns an object
   * of shape { key: [value] }.  This shape isa required when running the spell
   * since that is the shape that rete inputs take when processing the graph.
   */
  private _formatInputs(inputs) {
    return this.inputKeys.reduce((inputList, inputKey) => {
      inputList[inputKey] = [inputs[inputKey]]
      return inputList
    }, {} as Record<string, unknown[]>)
  }

  /**
   * Gewts a single component from the engine by name.
   */
  private _getComponent(componentName: string) {
    return this.engine.components.get(componentName)
  }

  /**
   * Takes the set of raw outputs, which makes use of the socket key,
   * and swaps the socket key for the socket name for human readable outputs.
   */
  private _formatOutputs(
    rawOutputs: Record<string, unknown>
  ): Record<string, unknown> {
    const outputs = {} as Record<string, unknown>
    const graph = this.currentSpell.graph

    Object.values(graph.nodes as MagickNode[])
      .filter(node => {
        return node.name.includes('Output')
      })
      .forEach(node => {
        outputs[node.data.name as string] =
          rawOutputs[node.data.socketKey as string]
      })

    return outputs
  }

  /**
   * Allows us to grab a specific triggered node by name
   */
  private _getTriggeredNodeByName(componentName) {
    const triggerIns = extractNodes(
      this.currentSpell.graph.nodes,
      this.triggerIns
    )

    const inputs = extractNodes(this.currentSpell.graph.nodes, this.inputs)

    return (
      [...triggerIns, ...inputs].find(node => {
        return node.data.name === componentName
      }) || null
    )
  }

  /**
   * Resets all tasks.  This clears the cached data output of the task and prepares
   * it for the next run.
   */
  private _resetTasks(): void {
    Object.values(this.engine.getTasks()).forEach(t => t.reset())
  }

  /**
   * Runs engine process to load the spell into the engine.
   */
  // private async _process() {
  //   await this.engine.abort()
  //   await this.engine.process(
  //     this.currentSpell.graph as GraphData,
  //     null,
  //     this.context
  //   )
  // }

  /**
   * Loads a spell into the spell runner.
   */
  async loadSpell(spell: SpellInterface) {
    // We need to parse the graph if it is a string
    const graph =
      typeof spell.graph === 'string' ? JSON.parse(spell.graph) : spell.graph

    spell.graph = graph

    this.currentSpell = spell

    // We process the graph for the new spell which will set up all the task workers
    await this.engine.process(graph as GraphData, null, this.context)
  }

  isBusy() {
    return this.busy
  }
  error(message: string, error: unknown | null = null) {
    this.busy = false
    this.logger.error(error, message)
    if (error) throw error
    throw new Error(message)
  }

  /**
   * Returns the first triggered node from a list of node names.
   * @param names - An array of node names to search for.
   * @returns The first triggered node found, or null if none are found.
   */
  _getFirstTriggeredNodeFromList(names) {
    for (const name of names) {
      const node = this._getTriggeredNodeByName(name)
      if (node) {
        return [node, name]
      } else {
        this.logger.warn(`Fallback '${name}' not found.`)
      }
    }
    return [null, null]
  }

  /**
   * Main spell runner for now. Processes inputs, gets the right component that starts the
   * running.  Would be even better if we just took a node identifier, got its
   * component, and ran the one triggered rather than this slightly hacky hard coded
   * method.
   */
  async runComponent({
    inputs,
    componentName = 'Input',
    runSubspell = false,
    secrets,
    publicVariables,
    sessionId,
    app,
    isPlaytest = false,
  }: RunComponentArgs) {
    this.busy = true
    // This should break us out of an infinite loop if we have circular spell dependencies.
    if (runSubspell && this.ranSpells.includes(this.currentSpell.name)) {
      this._clearRanSpellCache()
      this.error('Infinite loop detected in SpellRunner. Exiting.')
    }
    // Set the current spell into the cache of spells that have run now.
    if (runSubspell) this.ranSpells.push(this.currentSpell.name)

    try {
      this._clearRanSpellCache()
      // ensure we run from a clean slate
      this._resetTasks()

      // load the inputs into module memory
      this.module.read({
        inputs: this._formatInputs(inputs),
        secrets,
        publicVariables,
        app,
        sessionId,
        isPlaytest,
      })

      const component = this._getComponent(
        componentName
      ) as unknown as ModuleComponent

      if (!component.run) {
        this.error('Component does not have a run method')
      }

      const findFirstInputKey = inputs => {
        // Iterate over the keys of the inputs object
        for (const key of Object.keys(inputs)) {
          // Check if the key starts with 'Input -'
          if (key.startsWith('Input -')) {
            return key // Return the first matching key
          }
        }
        return inputs[0] // Return null if no matching key is found
      }

      const firstInput = findFirstInputKey(inputs)

      this.logger.info('firstInput: %o', firstInput)

      // This function returns the first triggered node found from a list of names.
      // If none are found, it returns null.

      // Now, you can simplify your previous code:
      let triggeredNode = this._getTriggeredNodeByName(firstInput)

      if (!triggeredNode) {
        this.logger.warn(
          `No trigger found for ${firstInput}. Trying fallbacks.`
        )

        // Define your array of fallbacks in order of priority
        const fallbacks = ['Input - Default', 'Input - Discord (Text)']

        const fallback = this._getFirstTriggeredNodeFromList(fallbacks)

        if (!fallback) {
          this.logger.warn(`No suitable fallback found for ${firstInput}.`)
        }

        this.logger.info('fallback: %o', fallback)

        const [node, name] = fallback
        triggeredNode = node

        // swap out input name for default input name
        inputs[name] = inputs[firstInput]
      }

      // If we still don't have a triggered node, we should throw an error.
      if (!triggeredNode) {
        this.error('No triggered node found')
      }

      // This is a failsafe to ensure that we don't have agents hanging around that are still running
      // A run shouldnt take this long.  This is a hacl but we are replacing all this soon.
      setTimeout(() => {
        this.busy = false
      }, SPELLRUNNER_BUSY_TIMEOUT_MSEC)

      // this running is where the main "work" happens.
      // I do wonder whether we could make this even more elegant by having the node
      // subscribe to a run pubsub and then we just use that.  This would treat running
      // from a trigger in node like any other data stream. Or even just pass in socket IO.
      //
      await component.run(triggeredNode as NodeData, inputs, this.engine)

      this.busy = false
      return this.outputData
    } catch (error) {
      this.error(`Error loading spell ${this.currentSpell.id}`, error)
      return
    }
  }
}

export default SpellRunner
