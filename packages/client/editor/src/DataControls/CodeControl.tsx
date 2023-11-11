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
 * CodeControl component.
 * Renders a button that when clicked will open a code editor.
 */
const CodeControl: React.FC = ({ tab }: Props): JSX.Element => {
  const { publish, events } = usePubSub()

  /**
   * Event handlers
   */

  /**
   * Triggers the creation of a new window or the focus on an existing one.
   */
  const onClick = (): void => {
    publish(events.$CREATE_TEXT_EDITOR(tab.id))
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
