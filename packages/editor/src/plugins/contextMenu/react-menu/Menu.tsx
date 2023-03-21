import styles from './style.module.scss'
import Item from './Item'
import Context from './context'
import { useEffect, useState } from 'react'

export default ({ items, position: [x, y], visible, args, onClose, type = 'list' }) => {
  if (!visible) return null
  console.log('type', type)
  const [search, setsearch] = useState('')
  // set focus on the search bar
  useEffect(() => {
    const searchbar = document.querySelector('.context-menu-search-bar')
    if(searchbar){
      (searchbar as any).focus()
    }
  }, [])
  return (
    <Context.Provider value={{ args, onClose }}>
      <div
        className={styles['context-menu']}
        style={{ left: x + 'px', top: y + 'px' }}
      >
        {type ==='list' && (
          <input
          type="text"
          placeholder="Search"
          className={styles['search-bar'] + ' context-menu-search-bar'}
          value={search}
          onChange={e => setsearch(e.target.value)}
          />
          )}
        <div className={styles['context-menu-inner']} >
          {items.map(item => {
            console.log('item', item)
            if(search === '') return <Item item={item} key={item.title} search={search} />
            // get the title of all subitems
            const subitems = item.subitems.map(subItem => {
              return subItem.title
            })

            // if the item.title or subItems contain the search string, return the item
            if(item.title.toLowerCase().includes(search.toLowerCase()) || subitems.some(subItem => subItem.toLowerCase().includes(search.toLowerCase())))
              return <Item item={item} key={item.title} search={search} />
            // otherwise return null
            return null;
          }
          )}
        </div>
      </div>
    </Context.Provider>
  )
}
