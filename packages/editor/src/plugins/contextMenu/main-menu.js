import { createNode, traverse } from './utils'

export default function (Menu) {
  return class MainMenu extends Menu {
    constructor(editor, props, { items, allocate, rename }) {
      super(editor, props)

      const mouse = { x: 0, y: 0 }
      let mousePos = false

      const initialPosition = {
        x: editor.view.area.mouse.x,
        y: editor.view.area.mouse.y,
      }

      editor.on('contextmenu', ({ e, node }) => {
        mousePos = false
        editor.on('mousemove', ({ x, y }) => {
          if (!mousePos) {
            mousePos = true
            mouse.x = x
            mouse.y = y
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
              editor.addNode(await createNode(component, mouse))
            },
            path
          )
      })

      traverse(items, (name, func, path) => this.addItem(name, func, path))
    }
  }
}
