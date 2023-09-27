// DOCUMENTED
/**
 * React menu and components.
 *
 * @remarks
 * This is an import statement of ReactMenu and ReactComponents.
 * @packageDocumentation
 */
import ReactMenu, * as ReactComponents from './react-menu'
/**
 * The main menu.
 *
 * @remarks
 * This is an import of the getMainMenu function.
 * @packageDocumentation
 */
import getMainMenu from './main-menu'
/**
 * The node menu.
 *
 * @remarks
 * This is an import of the getNodeMenu function.
 * @packageDocumentation
 */
import getNodeMenu from './node-menu'
/**
 * A menu.
 *
 * @remarks
 * This is an import of the IMenu interface.
 * @packageDocumentation
 */
import IMenu from './menu'

export type ContextMenuOptions = {
  searchBar?: boolean
  searchKeep?: (item: any) => boolean
  delay?: number
  items?: Record<string, any>
  nodeItems?: Record<string, any>
  allocate?: (components: any) => any[] | null
  rename?: (component: any) => string
}

/**
 * Installs the context menu.
 *
 * @remarks
 * This function is exported as `install`.
 * @param editor - The editor.
 * @param searchBar - Show the search bar.
 * @param searchKeep - Keep the search.
 * @param delay - The delay.
 * @param items - The items.
 * @param nodeItems - The node items.
 * @param allocate - The allocation.
 * @param rename - The rename.
 */
function install(
  editor,
  {
    searchBar = true,
    searchKeep = () => false,
    delay = 1000,
    items = {},
    nodeItems = {},
    allocate = components => [],
    rename = component => component.name,
  }: ContextMenuOptions
) {
  // Bind 'hidecontextmenu' to the editor.
  editor.bind('hidecontextmenu')

  // Create a mainMenu if getMainMenu is truthy.
  const mainMenu =
    getMainMenu() &&
    new (getMainMenu())(
      editor,
      { searchBar, searchKeep, delay },
      { items, allocate, rename }
    )

  // Create a nodeMenu if getNodeMenu is truthy.
  const nodeMenu =
    getNodeMenu() &&
    new (getNodeMenu())(editor, { searchBar: false, delay }, nodeItems)

  // Hide the menus on 'hidecontextmenu'.
  editor.on('hidecontextmenu', () => {
    mainMenu && mainMenu.hide()
    nodeMenu && nodeMenu.hide()
  })

  // Hide the menus on 'click' or 'contextmenu'.
  editor.on('click contextmenu', () => {
    editor.trigger('hidecontextmenu')
  })

  // Show the menu on 'contextmenu'.
  editor.on('contextmenu', ({ e, node }) => {
    e.preventDefault()
    e.stopPropagation()

    // Sort items by title.
    mainMenu &&
      mainMenu.items.sort((a, b) =>
        a.title > b.title ? 1 : b.title > a.title ? -1 : 0
      )

    if (mainMenu && mainMenu.items.some(item => item.title === 'Common')) {
      const commonItem = mainMenu.items.find(item => item.title === 'Common')
      mainMenu.items = [
        commonItem,
        ...mainMenu.items.filter(item => item.title !== 'Common'),
      ]
    }

    // Get the x and y coordinates of the click.
    const [x, y] = [e.clientX, e.clientY]

    // Show the nodeMenu if node is truthy, else show the mainMenu.
    ;(node ? nodeMenu : mainMenu)?.show(x, y, { node })
  })
}

/**
 * The React Menu.
 *
 * @remarks
 * This is the ReactMenu class.
 * This class is exported as `ReactMenu`.
 * @public
 */
export { ReactMenu }

/**
 * The React Components.
 *
 * @remarks
 * This is an object that contains React components used by the ReactMenu.
 * This object is exported as `ReactComponents`.
 * @public
 */
export { ReactComponents }

/**
 * An interface that defines a menu.
 *
 * @remarks
 * This interface is exported as `IMenu`.
 * @public
 */
export { IMenu }

/**
 * The context menu.
 *
 * @remarks
 * This object represents the context menu.
 * This object is exported as the default.
 * @public
 */
export default {
  /**
   * The name of the context menu.
   */
  name: 'context-menu',
  /**
   * Installs the context menu.
   */
  install,
}
