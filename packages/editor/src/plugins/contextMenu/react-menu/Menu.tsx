// DOCUMENTED
/**
 * The exported function takes in a props object that includes an array of items, the position
 * of the context menu to be rendered, a boolean visibility flag, any arguments to be passed along,
 * a function to be called when the menu is closed, and a type string.
 * @param items - Array of objects that represent the items in the context menu.
 * @param position - A tuple representing the x and y coordinates where the context menu will be
 * rendered.
 * @param visible - A boolean flag indicating whether the context menu should be visible.
 * @param args - Any arguments to be passed to the context menu.
 * @param onClose - A function to be called when the context menu is closed.
 * @param type - A string indicating the type of context menu to be rendered. Defaults to "list".
 * @returns A JSX element representing the context menu.
 */
import styles from './style.module.scss'
import Item from './Item'
import Context from './context'
import { useEffect, useRef, useState } from 'react'

export default function ContextMenu({
  items,
  position: [x, y],
  visible,
  args,
  onClose,
  type = 'list',
}: {
  items: any[]
  position: [number, number]
  visible: boolean
  args: any
  onClose: () => void
  type?: string
}): JSX.Element {
  const [search, setSearch] = useState<string>('')
  const searchbarRef = useRef(null)
  /**
   * This effect sets the focus on the search bar when the context menu is rendering.
   * It also clears the input value when the context menu is closed.
   */

  useEffect(() => {
    if (visible) {
      const searchbar = document?.querySelector('.context-menu-search-bar') as HTMLElement
      if (searchbar) searchbar.focus()
    } else {
      setSearch('')
    }
  }, [visible])

  if (!visible) return null

  return (
    <Context.Provider value={{ args, onClose }}>
      <div
        className={styles['context-menu']}
        style={{ left: `${x}px`, top: `${y}px` }}
      >
        {type === 'list' && (
          <input
            ref={searchbarRef}
            type="text"
            placeholder="Search"
            className={`${styles['search-bar']} context-menu-search-bar`}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        )}
        <div className={styles['context-menu-inner']}>
          {items?.map(item => {
            if (search === '')
              return <Item item={item} key={item.title} search={search} />

            const subitems = item.subitems.map(subItem => {
              return subItem.title
            })

            if (
              item.title.toLowerCase().includes(search.toLowerCase()) ||
              subitems.some(subItem =>
                subItem.toLowerCase().includes(search.toLowerCase())
              )
            )
              return <Item item={item} key={item.title} search={search} />

            return null
          })}
        </div>
      </div>
    </Context.Provider>
  )
}
