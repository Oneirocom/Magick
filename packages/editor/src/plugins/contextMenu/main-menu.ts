import { createNode, traverse } from './utils'
import ReactMenu from './react-menu'
export default function () {
  return class MainMenu extends ReactMenu {
    constructor(editor, props, { items, allocate, rename }) {
      super(editor, props)

      const initialPosition = {
        x: editor.view.area.mouse.x,
        y: editor.view.area.mouse.y,
      }

      let nodePositionAvailable = false

      editor.on('click contextmenu', () => {
        nodePositionAvailable = false
        editor.on('mousemove', ({ x, y }) => {
          if (!nodePositionAvailable) {
            initialPosition.x = x
            initialPosition.y = y
            nodePositionAvailable = true
          }
        })
      })

      editor.on('componentregister', component => {
        const path = allocate(component)

        if (Array.isArray(path))
          // add to the menu if path is array
          this.addItem(
            rename(component),
            async () => {
              editor.addNode(await createNode(component, initialPosition))
            },
            path
          )
      })

      traverse(items, (name, func, path) => this.addItem(name, func, path))
    }
  }
}
