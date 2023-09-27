// DOCUMENTED
// Required import
import React from 'react'

/**
 * Interface for ControlProps type
 */
interface ControlProps {
  innerRef: (el: any, control: any) => void
  className: string
  control: any
}

/**
 * Definition of Control class component
 *
 * @component
 * @extends React.Component<ControlProps>
 */
export class Control extends React.Component<ControlProps> {
  /**
   * Creates a ref for the `div` element and calls the `innerRef` prop
   *
   * @function
   * @param {any} el - The `div` element
   */
  createRef = (el: any): void => {
    const { innerRef, control } = this.props

    el && innerRef(el, control)
  }

  /**
   * Renders the Control component
   *
   * @function
   * @returns {React.ReactNode}
   */
  render(): React.ReactNode {
    const { className, control } = this.props

    return (
      <div className={className} title={control.key} ref={this.createRef} />
    )
  }
}
