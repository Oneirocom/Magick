// DOCUMENTED
import * as React from 'react'

// Importing the CSS styles for the toolbar
import css from './toolbar.module.css'

/**
 * A functional component Toolbar that renders a toolbar
 * with given sections for toolbar items and options.
 *
 * @param props - An object containing toolbar and options to be rendered in the toolbar sections
 * @returns - A JSX element representing the toolbar
 */
export const Toolbar: React.FC<{
  toolbar: React.ReactNode
  options: React.ReactNode
}> = ({ toolbar, options }) => {
  return (
    // Render the toolbar with its sections
    <div className={css['th-toolbar']}>
      {/* Render the toolbar items section */}
      <div className={css['toolbar-section']}>{toolbar}</div>
      {/* Render the options section */}
      <div className={css['toolbar-section']}>{options}</div>
    </div>
  )
}
