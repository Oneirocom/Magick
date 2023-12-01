// DOCUMENTED
/**
 * Imports
 */
import React from 'react'
import { Button } from 'client/core'
import { Tab, usePubSub } from '@magickml/providers'

type Props = {
  tab: Tab
}

/**
 * LongText component
 */
const LongText = ({ tab }: Props): JSX.Element => {
  /**
   * Destructuring the createOrFocus and windowTypes functions from the useLayout hook
   */
  const { publish, events } = usePubSub()

  /**
   * Function that is called when the button is clicked
   */
  const onClick = (): void => {
    publish(events.$CREATE_TEXT_EDITOR(tab.id))
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
