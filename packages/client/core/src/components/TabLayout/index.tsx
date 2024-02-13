// DOCUMENTED

import * as React from 'react'

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
    <div
      className={`
    p-4
    h-full
    bg-[var(--dark-1)]
    `}
    >
      {
        // Create a new div with inline styles for position and height, and
        // insert the received child components inside
      }
      <div style={{ position: 'relative', height: '100%' }}>{children}</div>
    </div>
  )
}
