import { PubSub, events } from '@magickml/providers'
import { MagickEditor } from 'shared/core'

export class SnapGrid {
  editor: MagickEditor
  size: number
  active: boolean

  constructor(editor, { size = 16, dynamic = true }) {
    this.editor = editor
    this.size = size
    this.active = dynamic

    if (dynamic) this.editor.on('nodetranslate', this.onTranslate.bind(this))
    else
      this.editor.on('rendernode', ({ node, el }) => {
        el.addEventListener('mouseup', this.onDrag.bind(this, node))
        el.addEventListener('touchend', this.onDrag.bind(this, node))
        el.addEventListener('touchcancel', this.onDrag.bind(this, node))
      })
  }

  subscribeToToggleSnap() {
    // Subscribe to TOGGLE_SNAP event
    PubSub.subscribe(events.TOGGLE_SNAP, () => {
      console.log('TOGGLE_SNAP event received in snap.js')
      this.toggleSnap()
    })
  }

  toggleSnap() {
    this.active = !this.active
  }

  onTranslate(data) {
    if (!this.active) return

    const { x, y } = data

    data.x = this.snap(x)
    data.y = this.snap(y)
  }

  onDrag(node) {
    if (!this.active) return

    const [x, y] = node.position

    node.position[0] = this.snap(x)
    node.position[1] = this.snap(y)

    this.editor.view.nodes.get(node).update()
    this.editor.view.updateConnections({ node })
  }

  snap(value) {
    return Math.round(value / this.size) * this.size
  }
}
