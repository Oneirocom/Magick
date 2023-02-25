import ReactMenu, * as ReactComponents from './react-menu'
import getMainMenu from './main-menu'
import getNodeMenu from './node-menu'
import IMenu from './menu'

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
    Menu = ReactMenu,
  }
) {
  if (!Menu) throw new TypeError('Menu must be defined')

  editor.bind('hidecontextmenu')
  const mainMenu = new (getMainMenu(Menu))(
    editor,
    { searchBar, searchKeep, delay },
    { items, allocate, rename }
  )

  const nodeMenu = new (getNodeMenu(Menu))(
    editor,
    { searchBar: false, delay },
    nodeItems
  )

  editor.on('hidecontextmenu', () => {
    mainMenu.hide()
    nodeMenu.hide()
  })

  editor.on('click contextmenu', () => {
    editor.trigger('hidecontextmenu')
  })

  editor.on('contextmenu', ({ e, node }) => {
    e.preventDefault()
    e.stopPropagation()

    mainMenu.items.sort((a, b) =>
      a.title > b.title ? 1 : b.title > a.title ? -1 : 0
    )

    const [x, y] = [e.clientX, e.clientY]

    ;(node ? nodeMenu : mainMenu).show(x, y, { node })
  })
}

export { ReactMenu, ReactComponents, IMenu }

export default {
  name: 'context-menu',
  install,
}
