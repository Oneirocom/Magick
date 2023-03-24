export default abstract class Action {
  abstract undo(): void
  abstract redo(): void
}
