export default class History {
  constructor() {
    this.active = false
    this.produced = []
    this.reserved = []
  }

  add(action) {
    if (this.active) return
    this.produced.push(action)
    this.reserved = []
  }

  get last() {
    return this.produced[this.produced.length - 1]
  }

  _do(from, to, type) {
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
