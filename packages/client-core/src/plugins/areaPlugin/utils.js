const min = arr => (arr.length === 0 ? 0 : Math.min(...arr))
const max = arr => (arr.length === 0 ? 0 : Math.max(...arr))

export function nodesBBox(editor, nodes) {
  const left = min(nodes.map(node => node.position[0]))
  const top = min(nodes.map(node => node.position[1]))
  const right = max(
    nodes.map(
      node => node.position[0] + editor.view.nodes.get(node).el.clientWidth
    )
  )
  const bottom = max(
    nodes.map(
      node => node.position[1] + editor.view.nodes.get(node).el.clientHeight
    )
  )

  return {
    left,
    right,
    top,
    bottom,
    width: Math.abs(left - right),
    height: Math.abs(top - bottom),
    getCenter: () => {
      return [(left + right) / 2, (top + bottom) / 2]
    },
  }
}
