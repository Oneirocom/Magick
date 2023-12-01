// DOCUMENTED
import React from 'react'
import ReactDOM from 'react-dom'
import ReactMenu from './Menu'
import Menu from '../menu'
import { injectItem } from '../utils'

/**
 * Custom Menu class extending the base Menu class
 * provides additional methods to add items, show and hide the menu, and render the menu
 */
export default class CustomMenu extends Menu {
  items: any[]
  position: number[]
  visible: boolean
  el: HTMLDivElement
  args: any
  props: any
  type: string

  /**
   * CustomMenu constructor
   * @param {object} editor - The editor instance
   * @param {object} props - The properties for CustomMenu
   */
  constructor(editor, props) {
    super(editor, props)
    this.props = props
    this.items = []
    this.position = [0, 0]
    this.visible = false
    this.type = props.type
    this.el = document.createElement('div')
    editor.view.container.appendChild(this.el)

    this.render()
  }

  /**
   * Add an item to the CustomMenu
   * @param {string} title - The title of the menu item
   * @param {function} onClick - The onClick function for the menu item
   * @param {Array} path - The path for the menu item, default is an empty array
   */
  addItem(title: string, onClick: (args) => void, path: string[] = []) {
    injectItem(this.items, title, onClick, path)
    this.render()
  }

  /**
   * Show the CustomMenu at given x and y coordinates
   * @param {number} x - The x coordinate for the CustomMenu
   * @param {number} y - The y coordinate for the CustomMenu
   * @param {any} args - The arguments for the CustomMenu
   */
  show(x, y, args) {
    this.position = [x, y]
    this.args = args
    this.visible = true
    this.render()
  }

  /**
   * Hide the CustomMenu
   */
  hide() {
    this.visible = false
    this.render()
  }

  /**
   * Render the CustomMenu using ReactDOM and ReactMenu
   */
  render() {
    ReactDOM.render(
      <ReactMenu
        {...this.props}
        args={this.args}
        items={this.items}
        position={this.position}
        visible={this.visible}
        onClose={() => this.hide()}
        type={this.type}
      />,
      this.el
    )
  }
}

export { Menu }
