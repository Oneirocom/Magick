// DOCUMENTED
/**
 * Represents an action that can be added to a `History` instance.
 */
import Action from './action'

/**
 * Represents the type of history action that can be performed.
 */
type HistoryAction = 'undo' | 'redo'

/**
 * Encapsulates a collection of actions that can be undone and redone.
 */
export default class History {
  /**
   * If the `History` instance is currently active.
   */
  active: boolean
  /**
   * The actions that have been produced by the instance.
   */
  produced: Action[]
  /**
   * The actions that have been reserved by the instance.
   */
  reserved: Action[]

  /**
   * Creates a new instance of the `History` class.
   */
  constructor() {
    this.active = false
    this.produced = []
    this.reserved = []
  }

  /**
   * Adds an action to this `History` instance.
   * @param action The action to be added to this instance.
   */
  add(action: Action) {
    if (this.active) return
    this.produced.push(action)
    this.reserved = []
  }

  /**
   * Gets the last action produced by this `History` instance.
   * @returns The last action produced.
   */
  get last() {
    return this.produced[this.produced.length - 1]
  }

  /**
   * Performs a history action specified by the history action type on the given collections of actions.
   * @param from The collection of actions to move the action from.
   * @param to The collection of actions to move the action to.
   * @param type The type of history action to perform.
   */
  _do(from: Action[], to: Action[], type: HistoryAction) {
    const action = from.pop()
    if (!action) return

    this.active = true
    action[type]()
    to.push(action)
    this.active = false
  }

  /**
   * Undoes the last action performed by this `History` instance.
   */
  undo() {
    this._do(this.produced, this.reserved, 'undo')
  }

  /**
   * Clears all actions from this `History` instance.
   */
  clear() {
    this.active = false
    this.produced = []
    this.reserved = []
  }

  /**
   * Redoes the last action undone by this `History` instance.
   */
  redo() {
    this._do(this.reserved, this.produced, 'redo')
  }
}
