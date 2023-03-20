import styles from './style.module.scss'
import Item from './Item'
import Context from './context'

export default ({ items, position: [x, y], visible, args, onClose }) => {
  if (!visible) return null

  return (
    <Context.Provider value={{ args, onClose }}>
      <div
        className={styles['context-menu']}
        style={{ left: x + 'px', top: y + 'px' }}
      >
        <div className={styles['context-menu-inner']} >
          {items.map(item => (
            <Item item={item} key={item.title} />
          ))}
        </div>
      </div>
    </Context.Provider>
  )
}
