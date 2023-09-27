import Comment from './comment'
import { intersectRect } from './utils'

export default class InlineComment extends Comment {
  constructor(text, editor) {
    super(text, editor)

    this.el.className = 'inline-comment'
    this.el.addEventListener('mouseup', this.onDrag.bind(this))
  }

  onDrag() {
    const intersection = this.getIntersectNode()

    this.linkTo(intersection ? [intersection.node.id] : [])
  }

  getIntersectNode() {
    const commRect = this.el.getBoundingClientRect()

    return Array.from(this.editor.view.nodes)
      .map(([node, view]) => {
        return { node, rect: view.el.getBoundingClientRect() }
      })
      .find(({ rect }) => {
        return intersectRect(commRect, rect)
      })
  }

  offset(dx, dy) {
    this.x += dx
    this.y += dy
    this.update()
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: 'inline',
    }
  }
}
