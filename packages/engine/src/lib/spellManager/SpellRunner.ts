import io from 'socket.io'

import {
  EngineContext,
  GraphData,
  ModuleComponent,
  Spell as SpellType,
} from '../types'
import { getNodes } from '../nodes'
import { extractNodes, initSharedEngine, MagickEngine } from '../engine'
import { Module } from '../plugins/modulePlugin/module'
import { extractModuleInputKeys } from './graphHelpers'

type RunSpellConstructor = {
  magickInterface: EngineContext
  socket?: io.Socket
}

type RunComponentArgs = {
  inputs: Record<string, any>
  componentName: string
  runSubspell?: boolean
  runData?: Record<string, any>
}

class SpellRunner {
  engine: MagickEngine
  currentSpell!: SpellType
  module: Module
  magickInterface: EngineContext
  ranSpells: string[] = []
  socket?: io.Socket | null = null

  constructor({ magickInterface, socket }: RunSpellConstructor) {
    // Initialize the engine
    this.engine = initSharedEngine({
      name: 'demo@0.1.0',
      components: getNodes(),
      server: true,
      socket: socket || undefined,
    }) as MagickEngine

    // Set up the module to interface with the runtime processes
    this.module = new Module()

    if (socket) this.socket = socket

    // Set the interface that this runner will use when running workers
    this.magickInterface = magickInterface

    this.magickInterface.getCurrentSpell = () => {
      return this.currentSpell
    }

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
      magick: this.magickInterface,
      silent: true,
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
   * of shape { key: [value]}.  This shape isa required when running the spell
   * since that is the shape that rete inputs take when processing the graph.
   */
  private _formatInputs(inputs: Record<string, unknown>) {
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
   * Takes a dictionary of inputs, converts them to the module format required
   * and puts those values into the module in preparation for processing.
   */
  private _loadInputs(inputs: Record<string, unknown>): void {
    this.module.read(this._formatInputs(inputs))
  }

  /**
   * Takes the set of raw outputs, which makes use of the socket key,
   * and swaps the socket key for the socket name for human readable outputs.
   */
  private _formatOutputs(
    rawOutputs: Record<string, any>
  ): Record<string, unknown> {
    const outputs = {} as Record<string, unknown>
    const graph = this.currentSpell.graph

    Object.values(graph.nodes)
      .filter((node: any) => {
        return node.name.includes('Output')
      })
      .forEach((node: any) => {
        outputs[(node as any).data.name as string] =
          rawOutputs[(node as any).data.socketKey as string]
      })

    return outputs
  }

  /**
   * temporary method until we have a better way to target specific nodes
   * this is basically just using a "Default" trigger in
   * and does not support multipel triggers in to a spell yet
   */
  private _getFirstNodeTrigger() {
    const extractedNodes = extractNodes(
      this.currentSpell.graph.nodes,
      this.triggerIns
    )
    return extractedNodes[0]
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
    return [...triggerIns, ...inputs].find(node => node.name === componentName)
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
  async loadSpell(spell: SpellType) {
    this.currentSpell = spell

    // We process the graph for the new spell which will set up all the task workers
    await this.engine.process(spell.graph as GraphData, null, this.context)
  }

  /**
   * Main spell runner for now. Processes inputs, gets the right component that starts the
   * running.  Would be even better if we just took a node identifier, got its
   * component, and ran the one triggered rather than this slightly hacky hard coded
   * method.
   */
  async runComponent({
    inputs,
    componentName,
    runSubspell = false,
    runData = {},
  }: RunComponentArgs) {
    // This should break us out of an infinite loop if we have circular spell dependencies.
    if (runSubspell && this.ranSpells.includes(this.currentSpell.name)) {
      this._clearRanSpellCache()
      throw new Error('Infinite loop detected.  Exiting.')
    }
    // Set the current spell into the cache of spells that have run now.
    if (runSubspell) this.ranSpells.push(this.currentSpell.name)

    this._clearRanSpellCache()
    // ensure we run from a clean slate
    this._resetTasks()

    // load the inputs into module memory
    this._loadInputs(inputs)

    const component = this._getComponent(componentName) as ModuleComponent

    const triggeredNode = this._getTriggeredNodeByName(componentName)
    // const triggeredNode = this._getFirstNodeTrigger()

    if (!component.run) throw new Error('Component does not have a run method')
    if (!triggeredNode) throw new Error('No triggered node found')
    // this running is where the main "work" happens.
    // I do wonder whether we could make this even more elegant by having the node
    // subscribe to a run pubsub and then we just use that.  This would treat running
    // from a trigger in node like any other data stream. Or even just pass in socket IO.
    await component.run(triggeredNode, runData)
    return this.outputData
  }

  /**
   * temporary function to be backwards compatible with current use of run spell
   */
  async defaultRun(inputs: Record<string, any>, runSubspell = false) {
    return await this.runComponent({
      inputs,
      componentName: 'Trigger In',
      runSubspell,
    })
  }
}

export default SpellRunner
