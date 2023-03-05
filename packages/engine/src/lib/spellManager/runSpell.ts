import { EngineContext, GraphData, ModuleComponent, Spell } from '../types'
import { getNodes } from '../nodes'
import { initSharedEngine, extractNodes, MagickEngine } from '../engine'
import { Module } from '../plugins/modulePlugin/module'
import { RunComponentArgs } from './SpellRunner'

type RunSpellConstructor = {
  magickInterface: EngineContext
}

class RunSpell {
  engine: MagickEngine
  currentSpell!: Spell
  module: Module
  magickInterface: EngineContext

  constructor({ magickInterface }: RunSpellConstructor) {
    // Initialize the engine
    this.engine = initSharedEngine({
      name: 'demo@0.1.0',
      components: getNodes(),
      server: true,
    }) as MagickEngine
    console.log("Engine Created from spell runner")
    // Set up the module to interface with the runtime processes
    this.module = new Module()

    // Set the interface that this runner will use when running workers
    this.magickInterface = magickInterface

    // We should probably load up here all the "modules" the spell needds to run
    // This would basicallyt be an array of spells pulled from the DB
  }

  // getter method for all triggers ins of the loaded spell
  get triggerIns() {
    return this.engine.moduleManager.triggerIns
  }

  get context() {
    return {
      module: this.module,
      magick: this.magickInterface,
      silent: true,
      projectId: this.currentSpell.projectId,
    }
  }

  private _getComponent(componentName: string) {
    return this.engine.components.get(componentName)
  }

  private _formatOutputs(rawOutputs: Record<string, any>) {
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

  private _resetTasks() {
    this.engine.tasks.forEach(t => t.reset())
  }

  getOutputs() {
    const rawOutputs = {}
    this.module.write(rawOutputs)
    return this._formatOutputs(rawOutputs)
  }

  loadSpell(spell: Spell) {
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
  async runComponent({inputs, componentName, secrets, publicVariables}: RunComponentArgs) {
    // ensaure we run from a clean sloate
    this._resetTasks()

    console.log('reading module - runSpell.ts')
    // laod the inputs into module memory
    this.module.read({inputs, secrets, publicVariables})

    const component = this._getComponent(componentName as string) as ModuleComponent
    
    const triggeredNode = this._getFirstNodeTrigger()

    // this running is where the main "work" happens.
    // I do wonder whether we could make this even more elegant by having the node
    // subscribe to a run pubsub and then we just use that.  This would treat running
    // from a trigger in node like any other data stream. Or even just pass in socket IO.
    await component.run(triggeredNode)
  }
}

export default RunSpell
