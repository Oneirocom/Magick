import { Application } from '@feathersjs/koa'
import io from 'socket.io'
import Agent from '../agents/Agent'

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

export type RunComponentArgs = {
  inputs: MagickSpellInput
  agent?: Agent
  componentName?: string
  runSubspell?: boolean
  secrets?: Record<string, string>
  publicVariables?: Record<string, unknown>
  app?: any
}

type SpellRunnerConstructor = {
  app: Application
  socket?: io.Socket
  agent?: Agent
  spellManager: SpellManager
}

class SpellRunner {
  engine: MagickEngine
  currentSpell!: SpellInterface
  module: Module
  ranSpells: string[] = []
  socket?: io.Socket | null = null
  app: Application
  agent?: Agent
  spellManager: SpellManager

  log(message, data) {
    console.log(message, data)
    if (!this.agent) return

    this.agent.log(message, {
      spellId: this.currentSpell.id,
      projectId: this.currentSpell.projectId,
      ...data,
    })
  }

  warn(message, data) {
    console.warn(message, data)
    if (!this.agent) return

    this.agent.warn(message, {
      spellId: this.currentSpell.id,
      projectId: this.currentSpell.projectId,
      ...data,
    })
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

    return [...triggerIns, ...inputs].find(node => {
      return node.data.name === componentName
    })
  }

  /**
   * Resets all tasks.  This clears the cached data output of the task and prepares
   * it for the next run.
   */
  private _resetTasks(): void {
    this.engine.tasks.forEach(t => t.reset())
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
    agent,
    secrets,
    publicVariables,
    app,
  }: RunComponentArgs) {
    // This should break us out of an infinite loop if we have circular spell dependencies.
    if (runSubspell && this.ranSpells.includes(this.currentSpell.name)) {
      this._clearRanSpellCache()
      return console.error('Infinite loop detected.  Exiting.')
    }
    // Set the current spell into the cache of spells that have run now.
    if (runSubspell) this.ranSpells.push(this.currentSpell.name)

    this._clearRanSpellCache()
    // ensure we run from a clean slate
    this._resetTasks()
    console.log('*** SPELLRUNNER: publicVariables are', publicVariables)

    // load the inputs into module memory
    this.module.read({
      inputs: this._formatInputs(inputs),
      secrets,
      agent,
      publicVariables,
      app,
    })

    const component = this._getComponent(
      componentName
    ) as unknown as ModuleComponent

    if (!component.run)
      return console.error('Component does not have a run method')

    const firstInput = Object.keys(inputs)[0]

    console.log('firstInput', firstInput)

    // Checking for the triggered node for the connection type
    let triggeredNode = this._getTriggeredNodeByName(firstInput)

    // If there isn't one, we should
    if (!triggeredNode) {
      console.warn(
        `No trigger found for ${firstInput}.  Using default trigger.`
      )
      triggeredNode = this._getTriggeredNodeByName('Input - Default')
    }

    // If we still don't have a triggered node, we should throw an error.
    if (!triggeredNode) return console.error('No triggered node found')

    // this running is where the main "work" happens.
    // I do wonder whether we could make this even more elegant by having the node
    // subscribe to a run pubsub and then we just use that.  This would treat running
    // from a trigger in node like any other data stream. Or even just pass in socket IO.
    //

    try {
      await component.run(triggeredNode as unknown as MagickNode, inputs)
      return this.outputData
    } catch (err) {
      console.error('ERROR RUNNING SPELL', err)
      return {
        Output: `Error running spell- ${err}`,
      }
    }
  }
}

export default SpellRunner
