import { Tooltip, TooltipProps } from '@mui/material'

interface Props {
  title: string
  placement?: TooltipProps['placement']
  children: React.ReactElement
}

const ToolTip = ({ title, placement = 'top', children }: Props) => (
  <Tooltip title={title} placement={placement}>
    {children}
  </Tooltip>
)

export default ToolTip
