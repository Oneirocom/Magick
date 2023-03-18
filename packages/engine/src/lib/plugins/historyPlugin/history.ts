import Action from "./action"

type HistoryAction = 'undo' | 'redo'
export default class History {
  active:boolean
  produced:Action[]
  reserved:Action[]
  
  constructor() {
    this.active = false
    this.produced = []
    this.reserved = []
  }

  add(action:Action) {
    if (this.active) return
    this.produced.push(action)
    this.reserved = []
  }

  get last() {
    return this.produced[this.produced.length - 1]
  }

  _do(from:Action[], to:Action[], type:HistoryAction) {
    const action = from.pop()

    if (!action) return

    this.active = true
    action[type]()
    to.push(action)
    this.active = false
  }

  undo() {
    this._do(this.produced, this.reserved, 'undo')
  }

  clear() {
    this.active = false
    this.produced = []
    this.reserved = []
  }

  redo() {
    this._do(this.reserved, this.produced, 'redo')
  }
}
