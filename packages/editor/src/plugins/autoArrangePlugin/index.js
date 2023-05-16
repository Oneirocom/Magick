import { AutoArrange } from './auto-arrange'

function install(
  editor,
  {
    margin = { x: 50, y: 50 },
    depth = null,
    vertical = false,
    offset = { x: 0, y: 0 },
    hotkey = { key: '/', ctrl: true },
  }
) {
  editor.bind('arrange')

  const ar = new AutoArrange(editor, margin, depth, vertical, offset)

  editor.on('arrange', ({ node, ...options }) => ar.arrange(node, options))

  editor.arrange = (node, options) => {
    console.log(`Deprecated: use editor.trigger('arrange', { node }) instead`)
    ar.arrange(node, options)
  }

  if (hotkey) {
    const { key, ctrl } = hotkey

    window.addEventListener('keydown', event => {
      if (ctrl && event.ctrlKey && event.key === key) {
        const firstNode = editor.nodes[0]
        editor.trigger('arrange', { node: firstNode })
      }
    })
  }
}

export default {
  name: 'auto-arrange',
  install,
}
