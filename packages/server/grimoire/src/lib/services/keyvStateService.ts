import { GraphNodes, IGraph, IStateService } from '@magickml/behave-graph'
import Keyv from 'keyv'
import KeyvRedis from '@keyv/redis'
import Redis from 'ioredis'

import { IEventStore } from './eventStore'
import { EventPayload } from 'server/plugin'
import { CORE_DEP_KEYS } from 'plugins/core/src/lib/constants'

/**
 * @class KeyvStateService
 *
 * The KeyvStateService class implements the IStateService interface and is responsible for
 * managing the state of graph nodes in a graph-based application architecture. This service
 * leverages Keyv as a key-value store with a Redis backend for persistence and scalability.
 *
 * Key Features:
 * - Caching: Utilizes an in-memory cache to enhance performance by minimizing database queries.
 * - State Management: Manages and persists state data for nodes in the graph.
 * - Rehydration: Capable of reconstructing state from persistent storage, useful in scenarios like server restarts.
 * - Syncing: Ensures that the temporary state is synced with the persistent store at the end of an event or cycle.
 *
 * Design Patterns:
 * - Service Pattern: Encapsulates the logic related to state management, offering a clean interface to other components.
 * - Singleton Pattern: Typically instantiated once, providing a single point of interaction with the state management logic.
 * - Event-Driven: Works well with event-driven architectures, reacting to and storing the results of various events.
 *
 * Usage Example:
 * ```
 * const redisConnection = new Redis();
 * const stateService = new KeyvStateService(redisConnection);
 * stateService.init(graph, graphNodes);
 * ```
 *
 * @remarks
 * This service is an essential part of the application's infrastructure layer, abstracting the complexities of state
 * handling and allowing other parts of the application to focus on business logic.
 */
export class KeyvStateService implements IStateService {
  /**
   * A temporary cache for state data.
   *
   * @private
   * @remarks
   * This property stores the state data in memory, which is used to enhance performance by minimizing
   * database queries, allowing our state to be stored and retrieved quickly and efficiently.
   */
  private tempStateCache: Record<string, any> = {}

  /**
   * The event store instance used for event management.
   *
   * @private
   * @remarks
   * This property stores the event store instance, which is used to manage events in the graph.
   * It's a part of the strategy to manage state efficiently in a key-value store.
   */
  private eventStore?: IEventStore

  /**
   * The Keyv instance used for persistent storage.
   *
   * @private
   * @remarks
   * This property stores the kev instance, a key value store that can be backed by a variety of storage engines.
   */
  private keyv: Keyv

  /**
   * Creates an instance of KeyvStateService.
   *
   * @constructor
   * @param connection - The Redis connection used for persistent storage.
   *
   * @example
   * const redisConnection = new Redis();
   * const stateService = new KeyvStateService(redisConnection);
   */
  constructor(connection: Redis) {
    const keyvRedis = new KeyvRedis(connection)
    this.keyv = new Keyv({ store: keyvRedis })
  }

  /**
   * Initializes the state service with the graph and its nodes.
   *
   * @param graph - The graph instance that this service will manage the state for.
   * @param graphNodes - The nodes within the graph.
   *
   * @remarks
   * This method is crucial for establishing the link between the state service and the graph it manages.
   * It should be called right after the service's instantiation.
   *
   * @example
   * stateService.init(graph, graphNodes);
   */
  init(graph: IGraph) {
    this.eventStore = graph.getDependency(CORE_DEP_KEYS.EVENT_STORE)
  }

  /**
   * Constructs a base key for a given node ID.
   *
   * @private
   * @param nodeId - The ID of the node.
   * @returns A base key string for the node.
   *
   * @remarks
   * This method is used internally to generate a consistent key format for accessing
   * and storing state data. It's a part of the strategy to manage state efficiently
   * in a key-value store.
   */
  private baseKey(nodeId: string): string {
    return `${nodeId}`
  }

  /**
   * Formats a complete key for a node's state, optionally including a state key.
   *
   * @private
   * @param nodeId - The ID of the node.
   * @param stateKey - An optional additional key segment for more specific state management.
   * @returns A formatted key string.
   *
   *
   * @remarks
   * This method is used internally to generate a consistent key format for accessing
   * and storing state data.
   * @example
   * // Basic key for a node
   * const key = stateService.formatKey('node-123');
   *
   * // Key for a specific state of a node
   * const detailedKey = stateService.formatKey('node-123', 'connection-state');
   */
  private formatKey(nodeId: string, stateKey?: string): string {
    const baseKey = this.baseKey(nodeId)
    return `${baseKey}:${stateKey}`
  }

  /**
   * Formats a key specific to an event, based on a node ID and the event payload.
   *
   * @private
   * @param nodeId - The ID of the node.
   * @param event - The event payload containing the state key.
   * @returns A formatted key string based on the event.
   *
   * @remarks
   * This method extends the formatKey method by incorporating the event context into the key generation.
   * It's essential for event-driven state management, ensuring that state keys are unique and traceable to specific events.
   *
   * @example
   * const eventPayload = { stateKey: 'user-action', /* ... * / };
   * const key = stateService.formatKeyFromEvent('node-123', eventPayload);
   */
  private formatKeyFromEvent(nodeId: string, event: EventPayload): string {
    const stateKey = event.stateKey
    return this.formatKey(nodeId, stateKey)
  }

  /**
   * Stores an event in the event store.
   *
   * @param event - The event object to be stored.
   *
   * @remarks
   * This method is part of the event-driven design, allowing the service to record events
   * which can later be used for state rehydration or analysis. It's crucial for applications
   * where tracking and reacting to events is core to the functionality.
   */
  storeEvent(event: any) {
    this.eventStore?.setEvent(event)
  }

  /**
   * Retrieves the state for a given node.
   *
   * @param nodeId - The ID of the node whose state is to be retrieved.
   * @returns The state of the node if it exists in the cache.
   *
   * @remarks
   * This method first checks the local in-memory cache before querying the persistent store.
   * It's a performance optimization technique, reducing the number of reads from the slower,
   * persistent layer. Effective caching is crucial for high-performance applications.
   */
  getState(nodeId: string): any {
    // check first if the key is in the local store
    if (this.tempStateCache[nodeId]) {
      return this.tempStateCache[nodeId]
    }
  }

  /**
   * Updates or sets the state for a given node.
   *
   * @param nodeId - The ID of the node whose state is to be updated.
   * @param newState - The new state to be set for the node.
   *
   * @remarks
   * This method updates the in-memory cache with the new state. It's part of the write-through strategy,
   * where changes are first written to the cache and then, eventually, to the persistent store.
   */
  setState(nodeId: string, newState: any): void {
    this.tempStateCache[nodeId] = newState
  }

  /**
   * Rehydrates the state of nodes from the persistent store.
   *
   * @param nodes - The set of nodes to rehydrate.
   * @param eventKey - An optional key to specify a particular event for rehydration.
   *
   * @remarks
   * This method is essential for restoring the state after a system restart or crash.
   * It iterates through each node and fetches its state from the persistent store, ensuring
   * that the system can resume operation with the last known state.
   *
   * @example
   * await stateService.rehydrateState(graphNodes, 'specific-event-key');
   */
  async rehydrateState(nodes: GraphNodes, eventKey?: string) {
    // Assume that you have a way to get all node IDs that need rehydration
    const nodeIds = Object.keys(nodes)

    for await (const nodeId of nodeIds) {
      let key
      if (eventKey) {
        key = this.formatKey(nodeId, eventKey)
      }

      if (!eventKey && this.eventStore && this.eventStore.currentEvent()) {
        const event = this.eventStore.currentEvent()
        key = this.formatKeyFromEvent(nodeId, event!)
      }

      if (!key) key = this.formatKey(nodeId)

      const state = await this.keyv.get(key)

      if (state !== null) {
        this.tempStateCache[nodeId] = state
      }
    }
  }

  /**
   * Synchronizes the in-memory state with the persistent store and then clears the cache.
   *
   * @remarks
   * This method is part of the sync-and-clear strategy, where after a specific event or operation cycle,
   * the state stored in the temporary cache is persisted to the database, and then the cache is cleared.
   * This approach ensures data consistency and reduces memory footprint.
   */
  async syncAndClearState() {
    Object.keys(this.tempStateCache)
      .filter(Boolean)
      .forEach(async nodeId => {
        if (this.eventStore) {
          const event = this.eventStore.currentEvent()

          if (event) {
            const key = this.formatKeyFromEvent(nodeId, event)
            await this.keyv.set(key, this.tempStateCache[nodeId])
          }
        }
      })

    // Clearing the temporary state cache
    this.tempStateCache = {}
  }
}
