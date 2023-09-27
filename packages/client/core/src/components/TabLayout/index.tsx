// DOCUMENTED

import * as React from 'react'
import css from './TabLayout.module.css'

/**
 * TabLayout component
 * @param {React.ReactNode} children - child components passed into TabLayout
 * @returns {React.ReactElement} - rendered TabLayout with child components inside
 */
export const TabLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    // Use 'view-container' CSS class for the outer div
    <div className={css['view-container']}>
      {
        // Create a new div with inline styles for position and height, and
        // insert the received child components inside
      }
      <div style={{ position: 'relative', height: '100%' }}>{children}</div>
    </div>
  )
}
