import Context from './context'
import styles from './style.module.scss'
import React, { Component } from 'react'

class Item extends Component {
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
    const { args, onClose } = this.context
    e.stopPropagation()

    if (onClick) onClick(args)
    onClose()
  }

  render() {
    const {
      item: { title, subitems },
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
            {subitems.map(subitem => (
              <Item item={subitem} key={subitem.title} />
            ))}
          </div>
        )}
      </div>
    )
  }
}

Item.contextType = Context

export default Item
