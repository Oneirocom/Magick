// DOCUMENTED
/**
 * Imports
 */
import React from 'react'
import { Button } from '@magickml/client-core'
import { useLayout } from '../contexts/LayoutProvider'

/**
 * LongText component
 */
const LongText = (): JSX.Element => {
  /**
   * Destructuring the createOrFocus and windowTypes functions from the useLayout hook
   */
  const { createOrFocus, windowTypes } = useLayout()

  /**
   * Function that is called when the button is clicked
   */
  const onClick = (): void => {
    createOrFocus(windowTypes.TEXT_EDITOR, 'Text Editor')
  }

  /**
   * Render component
   */
  return <Button onClick={onClick}>Open in text editor</Button>
}

/**
 * Export component
 */
export default LongText
