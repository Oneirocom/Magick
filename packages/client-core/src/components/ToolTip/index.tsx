import * as React from 'react'
import { Tooltip as MUITooltip, TooltipProps } from '@mui/material'

interface Props {
  title: string
  placement?: TooltipProps['placement']
  children: React.ReactElement
}

export const Tooltip = ({ title, placement = 'top', children }: Props) => (
  <MUITooltip title={title} placement={placement}>
    {children}
  </MUITooltip>
)