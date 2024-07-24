import { inject, injectable } from 'inversify'
import { Engine, IGraph } from '@magickml/behave-graph'
import { ISpellCaster } from '../interfaces/ISpellcaster'
import { TYPES } from './dependency.config'
import { Agent } from '../Agent'
import { EventPayload } from '@magickml/shared-services'

@injectable()
export class SpellCaster implements ISpellCaster {
  private engine!: Engine
  private graph!: IGraph
  private isRunning: boolean = true
  private debug: boolean = true
  private isLive: boolean = false

  constructor(
    @inject(TYPES.Agent) private agent: Agent // @inject(TYPES.EventRouter) private eventRouter: IEventRouter
  ) {}

  async initialize(): Promise<void> {
    // will implement this later
    // try {
    //   this.graph = this.registry.createGraph(this.spell.graph);
    //   this.engine = new Engine(this.graph);
    //   this.initializeHandlers();
    //   await this.start();
    // } catch (error) {
    //   this.agent.logger.error(`Error initializing spell ${this.spell.id}: ${error}`);
    //   throw error;
    // }
  }

  private initializeHandlers(): void {
    this.engine.onNodeExecutionStart.addListener(
      this.executionStartHandler.bind(this)
    )
    this.engine.onNodeExecutionEnd.addListener(
      this.executionEndHandler.bind(this)
    )
    // this.engine.onNodeExecutionError.addListener(this.executionErrorHandler.bind(this));
  }

  private async start(): Promise<void> {
    while (this.isRunning) {
      await this.executeGraphOnce()
      await new Promise(resolve => setTimeout(resolve, 100)) // Adjust delay as needed
    }
  }

  private async executeGraphOnce(): Promise<void> {
    try {
      await this.engine.executeAllAsync(5, 100) // Adjust limits as needed
    } catch (error) {
      // this.agent.logger.error(`Error executing graph for spell ${this.spell.id}: ${error}`);
      this.isRunning = false
    }
  }

  private executionStartHandler(node: any): void {
    if (this.debug && this.isLive) {
      this.emitNodeWork('start', node, { inputs: node.inputs })
    }
  }

  private executionEndHandler(node: any): void {
    if (this.debug && this.isLive) {
      this.emitNodeWork('end', node, { outputs: node.outputs })
    }
  }

  private executionErrorHandler({
    node,
    error,
  }: {
    node: any
    error: Error
  }): void {
    this.emitNodeWork('error', node, { error: error.toString() })
  }

  private emitNodeWork(
    eventType: 'start' | 'end' | 'error',
    node: any,
    data: any
  ): void {
    // const event = {
    //   spellId: this.spell.id,
    //   channelId: this.channel.id,
    //   nodeId: node.id,
    //   eventType,
    //   data,
    //   timestamp: new Date().toISOString()
    // };
    // this.agent.emit('spellcaster:nodeWork', event);
  }

  async handleEvent(eventName: string, payload: EventPayload): Promise<void> {
    // Implement event handling logic here
    // This might involve triggering specific nodes in the graph based on the event
  }

  toggleDebug(debug: boolean): void {
    this.debug = debug
  }

  toggleLive(live: boolean): void {
    this.isLive = live
  }

  async dispose(): Promise<void> {
    this.isRunning = false
    if (this.engine) {
      this.engine.dispose()
    }
    // Additional cleanup if necessary
  }
}
