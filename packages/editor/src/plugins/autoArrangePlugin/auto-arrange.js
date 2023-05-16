import { Board } from './board'
import { Cache } from './cache'

export class AutoArrange {
  constructor(editor, margin, depth, vertical, offset) {
    this.editor = editor
    this.margin = margin
    this.depth = depth
    this.vertical = vertical
    this.offset = offset
  }

  getNodes(node, type = 'output') {
    const nodes = []
    const key = `${type}s`

    for (let io of node[key].values())
      for (let connection of io.connections.values())
        nodes.push(connection[type === 'input' ? 'output' : 'input'].node)

    return nodes
  }

  getNodesBoard(
    node,
    options,
    cache = new Cache(),
    board = new Board(),
    depth = 0
  ) {
    if (options.depth && depth > options.depth) return board
    if (options.skip && options.skip(node)) return board
    if (cache.track(node)) return board

    board.add(depth, node)

    const outputNodes =
      (options.substitution && options.substitution.output(node)) ||
      this.getNodes(node, 'output')
    const inputNodes =
      (options.substitution && options.substitution.input(node)) ||
      this.getNodes(node, 'input')

    outputNodes.map(n =>
      this.getNodesBoard(n, options, cache, board, depth + 1)
    )
    inputNodes.map(n => this.getNodesBoard(n, options, cache, board, depth - 1))

    return board
  }

  getNodeSize(node, vertical = this.vertical) {
    const el = this.editor.view.nodes.get(node).el

    return vertical
      ? {
          height: el.clientWidth,
          width: el.clientHeight,
        }
      : {
          width: el.clientWidth,
          height: el.clientHeight,
        }
  }

  translateNode(node, { x, y, vertical = this.vertical }) {
    const position = vertical ? [y, x] : [x, y]

    this.editor.view.nodes.get(node).translate(...position)
    this.editor.view.updateConnections({ node })
  }

  arrange(node = this.editor.nodes[0], options = {}) {
    const {
      margin = this.margin,
      vertical = this.vertical,
      depth = this.depth,
      offset = this.offset,
      skip,
      substitution,
    } = options
    const board = this.getNodesBoard(node, {
      depth,
      skip,
      substitution,
    }).toArray()
    const currentMargin = vertical ? { x: margin.y, y: margin.x } : margin
    const currentOffset = vertical ? { x: offset.y, y: offset.x } : offset

    let x = currentOffset.x

    for (let column of board) {
      const sizes = column.map(node => this.getNodeSize(node, vertical))
      const columnWidth = Math.max(...sizes.map(size => size.width))
      const fullHeight = sizes.reduce(
        (sum, node) => sum + node.height + currentMargin.y,
        0
      )

      let y = currentOffset.y

      for (let node of column) {
        const position = { x, y: y - fullHeight / 2, vertical }
        const { height } = this.getNodeSize(node, vertical)

        this.translateNode(node, position, vertical)

        y += height + currentMargin.y
      }

      x += columnWidth + currentMargin.x
    }
  }

  markVisitedNodes(node, visited) {
    if (visited.has(node)) return

    visited.add(node)
    const connectedNodes = [
      ...this.getNodes(node, 'output'),
      ...this.getNodes(node, 'input'),
    ]

    connectedNodes.forEach(connectedNode =>
      this.markVisitedNodes(connectedNode, visited)
    )
  }

  centerProject() {
    const maxX = Math.max(...this.editor.nodes.map(node => node.position[0]))
    const maxY = Math.max(...this.editor.nodes.map(node => node.position[1]))
    const minX = Math.min(...this.editor.nodes.map(node => node.position[0]))
    const minY = Math.min(...this.editor.nodes.map(node => node.position[1]))

    const offsetX = (maxX + minX) / 2
    const offsetY = (maxY + minY) / 2

    const adjustmentX = -offsetX
    const adjustmentY = -offsetY

    for (const node of this.editor.nodes) {
      const [x, y] = node.position
      const newPosition = [x + adjustmentX, y + adjustmentY]
      this.translateNode(node, { x: newPosition[0], y: newPosition[1] })
    }
  }
}
