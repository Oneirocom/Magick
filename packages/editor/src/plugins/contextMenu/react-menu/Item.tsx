import Context from './context'
import styles from './style.module.scss'
import React, { Component } from 'react'

type ItemProps = {
  item: {
    title: string
    subitems?: any[]
    onClick?: (args: any) => void
  }
  search?: string
}

type ItemState = {
  visibleSubitems: boolean
}

// todo convert to functional component
class Item extends Component<ItemProps, ItemState> {
  static contextType = Context

  constructor(props) {
    super(props)
    this.state = {
      visibleSubitems: false,
    }
  }

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

  render() {
    const {
      item: { title, subitems },
      search
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
            (search !== '' &&
              !subitem.title
                .toLowerCase()
                .includes(search.toLowerCase())) ? null : (
                <Item item={subitem} key={subitem.title} />
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
