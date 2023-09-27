import { extractNodes, initSharedEngine, MagickEngine } from '../engine'
import { getNodes } from '../nodes'
import { Module } from '../plugins/modulePlugin/module'
import {
  GraphData,
  MagickNode,
  ModuleComponent,
  SpellInterface,
  WorkerData,
} from '../types'
import { RunComponentArgs } from './SpellRunner'

class RunSpell {
  engine: MagickEngine
  currentSpell!: SpellInterface
  module: Module

  constructor() {
    // Initialize the engine
    this.engine = initSharedEngine({
      name: 'demo@0.1.0',
      components: getNodes(),
      server: true,
    }) as MagickEngine
    // Set up the module to interface with the runtime processes
    this.module = new Module()
  }

  // getter method for all triggers ins of the loaded spell
  get triggerIns() {
    return this.engine.moduleManager.triggerIns
  }

  get context() {
    return {
      module: this.module,
      projectId: this.currentSpell.projectId,
    }
  }

  private _getComponent(componentName: string) {
    return this.engine.components.get(componentName)
  }

  private _formatOutputs(rawOutputs: Record<string, unknown>) {
    const outputs = {} as Record<string, unknown>
    const graph = this.currentSpell.graph

    Object.values(graph.nodes as MagickNode)
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

  private _resetTasks() {
    Object.values(this.engine.getTasks()).forEach(t => t.reset())
  }

  getOutputs() {
    const rawOutputs = {}
    this.module.write(rawOutputs)
    return this._formatOutputs(rawOutputs)
  }

  loadSpell(spell: SpellInterface) {
    this.currentSpell = spell

    // We process the graph for the new spell which will set up all the task workers
    this.engine.process(spell.graph as GraphData, null, this.context)
  }

  /**
   * Main spell runner.  Processes inputs, gets the right component that starts the
   * running.  Would be even better iof we just took a node identifier, got its
   * component, and ran the one triggered rather than this slightly hacky hard coded
   * method.
   */
  async runComponent({
    inputs,
    componentName,
    secrets,
    agent,
    publicVariables,
    app,
  }: RunComponentArgs) {
    // ensaure we run from a clean sloate
    this._resetTasks()

    // laod the inputs into module memory
    this.module.read({ inputs, secrets, publicVariables, app })

    const component = this._getComponent(componentName as string) as
      | ModuleComponent
      | undefined

    const triggeredNode = this._getFirstNodeTrigger() as WorkerData

    if (!component) {
      throw new Error(`Component ${componentName} not found`)
    }

    // this running is where the main "work" happens.
    // I do wonder whether we could make this even more elegant by having the node
    // subscribe to a run pubsub and then we just use that.  This would treat running
    // from a trigger in node like any other data stream. Or even just pass in socket IO.
    await component.run(triggeredNode, inputs, this.engine)
  }
}

export default RunSpell
