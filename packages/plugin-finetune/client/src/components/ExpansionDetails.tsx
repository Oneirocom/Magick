// GENERATED 
import * as React from 'react'
import { styled } from '@mui/material/styles'
import { IconButton, Typography, Box } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

/** - Props that extend the IconButtonProps interface, to include a 'expand' boolean property. */
interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}

/**
 * - Extension of the IconButton React component, adding a custom style to rotate and animate the ExpandMoreIcon.
 * - Uses the 'expand' boolean property to toggle the animation.
 */
const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)', // rotate animation
  marginLeft: 'auto', // push the icon button to the right.
  transition: theme.transitions.create('transform', { // animate the transition
    duration: theme.transitions.duration.shortest,
  }),
}))

/** - Properties for the ExpansionDetails React component. */
interface ExpansionDetailsProps {
  children: React.ReactNode;
  title: string;
}

/**
 * - React component that shows/hides children content within a box.
 * - Displays a button to toggle the visibility of the children and a title for the box.
 */
export default function ExpansionDetails({ children, title }: ExpansionDetailsProps) {
  
  /** - State hook to keep track of the visibility status of the children. */
  const [expanded, setExpanded] = React.useState(false)

  /** - Function that toggles the visibility of the children. */
  const handleExpandClick = () => {
    setExpanded(!expanded)
  }
  
  return (
    <Box>
      <ExpandMore
        expand={expanded}
        onClick={handleExpandClick}
        aria-expanded={expanded}
        aria-label="show more"
      >
        <ExpandMoreIcon />
      </ExpandMore>
      <Typography variant='h6' color='white' display='inline'>
        {title}
      </Typography>
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        {children}
      </Collapse>
    </Box>
  )
}