import { AutoArrange } from './auto-arrange'

function install(
  editor,
  {
    margin = { x: 50, y: 50 },
    depth = null,
    vertical = false,
    offset = { x: 0, y: 0 },
    arrangeHotkey = { key: '/', ctrl: true },
    centerHotkey = { key: '.', ctrl: true },
  }
) {
  editor.bind('arrange')

  const ar = new AutoArrange(editor, margin, depth, vertical, offset)

  editor.on('arrange', ({ node, ...options }) => ar.arrange(node, options))

  editor.arrange = (node, options) => {
    console.log(`Deprecated: use editor.trigger('arrange', { node }) instead`)
    ar.arrange(node, options)
  }

  if (arrangeHotkey) {
    const { key, ctrl } = arrangeHotkey

    window.addEventListener('keydown', event => {
      if (ctrl && event.ctrlKey && event.key === key) {
        // Find all unvisited nodes and arrange them separately
        const visited = new Set()
        let currentOffset = { ...offset } // Initialize currentOffset with the provided offset

        for (const node of editor.nodes) {
          if (!visited.has(node)) {
            const options = {
              depth,
              margin,
              vertical,
              skip: undefined,
              substitution: undefined,
              offset: currentOffset,
            }
            ar.arrange(node, options) // Pass the currentOffset
            ar.markVisitedNodes(node, visited)

            // Update currentOffset with the maxY value from the last arranged group
            const maxY = Math.max(
              ...Array.from(visited).map(
                n => n.position[1] + ar.getNodeSize(n).height + 400
              )
            )
            currentOffset = { x: offset.x, y: maxY + margin.y }
          }
        }
      }
    })
  }

  if (centerHotkey) {
    const { key, ctrl } = centerHotkey

    window.addEventListener('keydown', event => {
      if (ctrl && event.ctrlKey && event.key === key) {
        ar.centerProject()
      }
    })
  }
}

export default {
  name: 'auto-arrange',
  install,
}
