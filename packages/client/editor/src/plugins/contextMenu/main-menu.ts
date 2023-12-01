// DOCUMENTED
/**
 * @description Creates a main menu class as a subclass of ReactMenu
 * @returns {MainMenu} A class representing the main menu
 */
import { createNode, traverse } from './utils'
import ReactMenu from './react-menu'

export default function () {
  /**
   * @class
   * @description A menu class that adds menu items on initialization and allows for new components to be registered
   * @extends ReactMenu
   */
  return class MainMenu extends ReactMenu {
    /**
     * @constructor
     * @param {Object} editor - The editor instance being used with the menu
     * @param {Object} props - Additional props for the menu
     * @param {Object} tree - The tree object representing the components in the editor
     * @param {Array} tree.items - The array of components registered in the editor
     * @param {Function} tree.allocate - A function for allocating space for new components in the tree
     * @param {Function} tree.rename - A function for renaming components in the tree
     */
    constructor(editor, props, { items, allocate, rename }) {
      super(editor, props)

      // Assigns the initial position of the menu to the current mouse position
      const initialPosition = {
        x: editor.view.area.mouse.x,
        y: editor.view.area.mouse.y,
      }

      let nodePositionAvailable = false

      // Event listener for click and contextmenu, changes the initial position to the current mouse position when the next mouse move event is fired
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

      // Event listener for when a new component is registered, adds a menu item for the new component
      editor.on('componentregister', component => {
        const path = allocate(component)

        if (component.common) {
          // add the component to a menu with the category of common
          this.addItem(
            rename(component),
            async () => {
              editor.addNode(await createNode(component, initialPosition))
            },
            ['Common']
          )
        }

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

      // Adds all menu items from the items array to the menu
      traverse(items, (name, func, path) => this.addItem(name, func, path))
    }
  }
}
