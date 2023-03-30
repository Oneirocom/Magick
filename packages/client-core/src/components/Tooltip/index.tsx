// GENERATED 
/**
 * A tooltip component that uses MUI's Tooltip.
 * @param title - Title of the tooltip.
 * @param placement - Placement of the tooltip. Default is 'top'.
 * @param children - The element that the tooltip is triggered on.
 * @returns A Tooltip component.
 */
import * as React from 'react'
import { Tooltip as MUITooltip, TooltipProps } from '@mui/material'

interface Props {
  title: string
  placement?: TooltipProps['placement']
  children: React.ReactElement
}

export const Tooltip: React.FC<Props> = ({ title, placement = 'top', children }: Props) => (
  <MUITooltip title={title} placement={placement}>
    {children}
  </MUITooltip>
);
