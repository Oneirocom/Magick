// DOCUMENTED
/**
 * Represents an abstract Action with undo and redo functionalities.
 */
export default abstract class Action {
  /**
   * Undoes the action.
   */
  abstract undo(): void

  /**
   * Redoes the action.
   */
  abstract redo(): void
}
