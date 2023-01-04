import './style.css'
import FrameComment from './frame-comment'
import InlineComment from './inline-comment'
import CommentManager from './manager'
import { nodesBBox, listenWindow } from './utils'

// eslint-disable-next-line max-statements
function install(
  editor,
  {
    margin = 30,
    disableBuiltInEdit = false,
    frameCommentKeys = {
      code: 'KeyF',
      shiftKey: true,
      ctrlKey: false,
      altKey: false,
    },
    inlineCommentKeys = {
      code: 'KeyC',
      shiftKey: true,
      ctrlKey: false,
      altKey: false,
    },
    deleteCommentKeys = {
      code: 'Delete',
      shiftKey: false,
      ctrlKey: false,
      altKey: false,
    },
  }
) {
  editor.bind('commentselected')
  editor.bind('commentcreated')
  editor.bind('commentremoved')
  editor.bind('syncframes')
  editor.bind('addcomment')
  editor.bind('removecomment')
  editor.bind('editcomment')

  const manager = new CommentManager(editor)

  if (!disableBuiltInEdit) {
    editor.on('editcomment', comment => {
      comment.text = prompt('Edit comment', comment.text)
      comment.update()
    })
  }

  const destroyKeyListener = listenWindow('keydown', function handleKey(e) {
    const keyCombosMap = [
      frameCommentKeys,
      inlineCommentKeys,
      deleteCommentKeys,
    ].map(function (x) {
      return (
        e.code === x.code &&
        e.shiftKey === x.shiftKey &&
        e.ctrlKey === x.ctrlKey &&
        e.altKey === x.altKey
      )
    })

    if (keyCombosMap[0]) {
      const ids = editor.selected.list.map(node => node.id)
      const nodes = ids.map(id => editor.nodes.find(n => n.id === id))

      editor.trigger('addcomment', { type: 'frame', nodes })
    } else if (keyCombosMap[1]) {
      const position = Object.values(editor.view.area.mouse)

      editor.trigger('addcomment', { type: 'inline', position })
    } else if (keyCombosMap[2]) {
      manager.deleteFocusedComment()
    }
  })

  editor.on('addcomment', ({ type, text, nodes, position }) => {
    if (type === 'inline') {
      manager.addInlineComment(text, position)
    } else if (type === 'frame') {
      const { left, top, width, height } = nodesBBox(editor, nodes, margin)
      const ids = nodes.map(n => n.id)

      manager.addFrameComment(text, position || [left, top], ids, width, height)
    } else {
      throw new Error(`type '${type}' not supported`)
    }
  })

  editor.on('removecomment', ({ comment, type }) => {
    if (comment) {
      manager.deleteComment(comment)
    } else if (type === 'inline') {
      manager.comments
        .filter(c => c instanceof InlineComment)
        .map(c => manager.deleteComment(c))
    } else if (type === 'frame') {
      manager.comments
        .filter(c => c instanceof FrameComment)
        .map(c => manager.deleteComment(c))
    }
  })

  editor.on('syncframes', () => {
    manager.comments
      .filter(comment => comment instanceof FrameComment)
      .map(comment => {
        const nodes = comment.links.map(id =>
          editor.nodes.find(n => n.id === id)
        )
        const { left, top, width, height } = nodesBBox(editor, nodes, margin)

        comment.x = left
        comment.y = top
        comment.width = width
        comment.height = height

        comment.update()
      })
  })

  editor.on('nodetranslated', ({ node, prev }) => {
    const dx = node.position[0] - prev[0]
    const dy = node.position[1] - prev[1]

    manager.comments
      .filter(comment => comment instanceof InlineComment)
      .filter(comment => comment.linkedTo(node))
      .map(comment => comment.offset(dx, dy))
  })

  editor.on('nodedraged', node => {
    manager.comments
      .filter(comment => comment instanceof FrameComment)
      .filter(comment => {
        const contains = comment.isContains(node)
        const links = comment.links.filter(id => id !== node.id)

        comment.links = contains ? [...links, node.id] : links
      })
  })

  editor.on('commentselected', () => {
    const list = [...editor.selected.list]

    editor.selected.clear()
    list.map(node => (node.update ? node.update() : null))
  })

  editor.on('export', data => {
    data.comments = manager.toJSON()
  })

  editor.on('import', data => {
    manager.fromJSON(data.comments || [])
  })

  if (editor.exist('clear')) {
    // compatibility with previous versions
    editor.on('clear', () => manager.deleteComments())
  }

  editor.on('destroy', () => {
    manager.destroy()
    destroyKeyListener()
  })
}

export default {
  name: 'comment',
  install,
}
