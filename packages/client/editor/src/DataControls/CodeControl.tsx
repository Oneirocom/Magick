// DOCUMENTED
/**
 * Imports
 */
import React from 'react'
import { Button } from 'client/core'
import { useLayout } from '../contexts/LayoutProvider'

/**
 * CodeControl component.
 * Renders a button that when clicked will open a code editor.
 */
const CodeControl: React.FC = (): JSX.Element => {
  /**
   * Hooks
   */
  const { createOrFocus, windowTypes } = useLayout()

  /**
   * Event handlers
   */

  /**
   * Triggers the creation of a new window or the focus on an existing one.
   */
  const onClick = (): void => {
    createOrFocus(windowTypes.TEXT_EDITOR, 'Text Editor')
  }

  /**
   * Renders the component.
   */
  return <Button onClick={onClick}>Open in code editor</Button>
}

/**
 * Exports
 */
export default CodeControl
