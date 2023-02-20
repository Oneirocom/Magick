import { createNode, traverse } from './utils'

export default function (Menu) {
  return class MainMenu extends Menu {
    constructor(editor, props, { items, allocate, rename }) {
      super(editor, props)

      const initialPosition = {
        x: editor.view.area.mouse.x,
        y: editor.view.area.mouse.y,
      }

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
