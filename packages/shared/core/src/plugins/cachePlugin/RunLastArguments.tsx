// DOCUMENTED
import React from 'react'
import { Control } from 'shared/rete'

/**
 * React component for the run button.
 * @param {Object} props - The properties passed to the component.
 * @returns {JSX.Element} - The rendered react component.
 */
const ReactRunButton = props => {
  /**
   * Button click handler for running the function.
   */
  const onButtonClick = async () => {
    const nodeData = props.getNode().toJSON()
    const value = await props.run(nodeData)
    console.log('Run with last arguments', value)
  }

  return (
    <button
      className="small"
      onClick={onButtonClick}
      style={{ maxWidth: '65%', cursor: 'pointer' }}
    >
      Run with last arguments
    </button>
  )
}

/**
 * Class representing the RunButtonControl component.
 * @extends Control
 */
export class RunButtonControl extends Control {
  render: string
  component: (props: any) => JSX.Element
  props: any
  /**
   * Creates a new RunButtonControl instance.
   * @param {Object} param0 - The options for the control.
   * @param {string} param0.key - The key for this control's instance.
   * @param {Function} param0.run - The function to be run by the control.
   */
  constructor({ key, run }) {
    super(key)
    this.render = 'react'
    this.key = key
    this.component = ReactRunButton

    // Define the props that are passed into the rendered react component.
    this.props = {
      run,
      getNode: this.getNode.bind(this),
    }
  }

  /**
   * Returns the parent node object.
   * @returns {Node} - The parent node instance.
   */
  getNode() {
    return this.parent as any
  }
}
