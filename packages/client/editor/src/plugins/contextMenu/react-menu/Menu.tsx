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

function flattenItems(items, search) {
  // Break out of recursion if there are no items
  if (!items || items.length === 0) return []

  let flatList = []
  const seenTitles = new Set() // to track seen titles

  flatList = items.reduce((acc, item) => {
    if (!item.subitems) return [...acc, item]
    if (item.subitems.length === 0) return [...acc, item]
    // Flatten subitems
    if (item.subitems) {
      return [...acc, item, ...flattenItems(item.subitems, search)]
    }
  }, [])

  // Filter the flat list if there is a search term
  if (search) {
    flatList.map(item => {
      item.title = item.title.split('/').pop()
      return item
    })

    flatList = flatList.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase())
    )

    // Remove duplicates
    flatList = flatList.filter(item => {
      const titleSegment = item.title.split('/').pop().toLowerCase()
      if (seenTitles.has(titleSegment)) {
        return false // this title is a duplicate
      }
      seenTitles.add(titleSegment)
      return true // keep this item
    })
  }

  return flatList
}

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
}): JSX.Element | null {
  const [search, setSearch] = useState<string>('')
  const searchbarRef = useRef(null)
  /**
   * This effect sets the focus on the search bar when the context menu is rendering.
   * It also clears the input value when the context menu is closed.
   */

  useEffect(() => {
    if (visible) {
      const searchbar = document?.querySelector(
        '.context-menu-search-bar'
      ) as HTMLElement
      if (searchbar) searchbar.focus()
    } else {
      setSearch('')
    }
  }, [visible])

  if (!visible) return null

  const displayedItems = search ? flattenItems(items, search) : items

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
          {displayedItems?.map((item, i) => {
            if (search === '')
              return <Item item={item} key={item.title + i} search={search} />

            const subitems =
              item?.subitems &&
              item?.subitems.map(subItem => {
                return subItem.title
              })

            if (
              item.title.toLowerCase().includes(search.toLowerCase()) ||
              (subitems &&
                subitems.some(subItem =>
                  subItem.toLowerCase().includes(search.toLowerCase())
                ))
            )
              return <Item item={item} key={item.title + i} search={search} />

            return null
          })}
        </div>
      </div>
    </Context.Provider>
  )
}
