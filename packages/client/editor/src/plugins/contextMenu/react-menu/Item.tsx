// DOCUMENTED
import Context from './context'
import styles from './style.module.scss'
import React, { Component } from 'react'

/**
 * Represents an item with optional subitems.
 * @typedef {Object} ItemProps
 * @property {Object} item - The item data.
 * @property {string} item.title - The title of the item.
 * @property {Array<any>} [item.subitems] - The subitems of the item, if any.
 * @property {(args: any) => void} [item.onClick] - The callback function when the item is clicked.
 * @property {string} [search] - A search term used to filter subitems.
 */

/**
 * Represents the state of an Item component.
 * @typedef {Object} ItemState
 * @property {boolean} visibleSubitems - Whether the subitems are visible.
 */

type ItemType = {
  title: string
  onClick: (args) => void
  subitems: ItemType[]
}

type State = {
  visibleSubitems: boolean
}

type Props = { item: ItemType; search?: string }
/**
 * Class representing an item with optional subitems.
 * @class Item
 * @extends {Component<ItemProps, ItemState>}
 */
class Item extends Component<Props, State> {
  static contextType = Context

  /**
   * Creates a new Item instance.
   * @param {ItemProps} props - The properties of the Item component.
   */
  constructor(props) {
    super(props)
    this.state = {
      visibleSubitems: false,
    }
  }

  /**
   * Handles the click event of the item.
   * @param {React.MouseEvent<HTMLDivElement>} e - The click event.
   */
  onClick = e => {
    const {
      item: { onClick },
    } = this.props

    // Doing this for now since we will be converting to functional components
    // @ts-ignore
    const { args, onClose } = this.context

    e.stopPropagation()

    if (onClick) onClick(args)
    onClose()
  }

  /**
   * Renders the Item component.
   * @returns {React.ReactNode}
   */
  render() {
    const {
      item: { title, subitems },
      search = '',
    } = this.props
    const { visibleSubitems } = this.state

    return (
      <div
        className={
          styles['item'] + ' ' + (subitems ? styles['hasSubitems'] : '')
        }
        onClick={this.onClick}
        onMouseOver={() => this.setState({ visibleSubitems: true })}
        onMouseLeave={() => this.setState({ visibleSubitems: false })}
      >
        {title}
        {subitems && visibleSubitems && (
          <div className={styles['subitems']}>
            {subitems.map(subitem =>
              search !== '' &&
              !subitem.title
                .toLowerCase()
                .includes(search.toLowerCase()) ? null : (
                <Item key={subitem.title} item={subitem} />
              )
            )}
          </div>
        )}
      </div>
    )
  }
}

Item.contextType = Context

export default Item
