// DOCUMENTED
// Import required modules
import * as React from 'react'
import { Tooltip as MUITooltip, TooltipProps } from '@mui/material'

// Define the interface Props for the Tooltip component
interface Props {
  title: string // Tooltip's text
  placement?: TooltipProps['placement'] // Tooltip's placement in relation to the target element
  children: React.ReactElement // Child component/element that the tooltip wraps
}

/**
 * A custom Tooltip component wrapper around Material-UI's Tooltip component.
 *
 * @param {string} title - The text to be displayed inside the tooltip.
 * @param {TooltipProps['placement']} [placement='top'] - The placement of the tooltip relative to the child element.
 * @param {React.ReactElement} children - The child element/component that the tooltip wraps.
 * @returns {React.ReactElement} A Tooltip component with title and placement options.
 */
export const Tooltip = ({ title, placement = 'top', children }: Props): React.ReactElement => (
  <MUITooltip title={title} placement={placement} disableInteractive>
    {children}
  </MUITooltip>
)
