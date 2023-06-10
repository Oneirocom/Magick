// DOCUMENTED 
import React from 'react';
import { styled } from '@mui/material/styles';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

/**
 * Extend the IconButtonProps and add a boolean `expand` property
 */
interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

/**
 * Custom styled IconButton component with transform property based on expand prop.
 */
const ExpandMore = styled(({ expand, ...other }: ExpandMoreProps) => (
  <IconButton {...other} />
))(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

/**
 * ExpansionDetails component that displays title and expandable content.
 *
 * @param {React.ReactNode} children - React component(s) to render within the expanded state.
 * @param {string} title - The title of the ExpansionDetails component.
 * @returns {JSX.Element} The ExpansionDetails component.
 */
export default function ExpansionDetails({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}): JSX.Element {
  // State to manage the expanded/collapsed state
  const [expanded, setExpanded] = React.useState(false);

  // Function to handle expand button click and toggle expanded state
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      {/* Render the ExpandMore IconButton with needed props */}
      <ExpandMore
        expand={expanded}
        onClick={handleExpandClick}
        aria-expanded={expanded}
        aria-label="show more"
      >
        <ExpandMoreIcon />
      </ExpandMore>
      {/* Render the title inline with the expand button */}
      <Typography variant={'h6'} color={'white'} display={'inline'}>
        {title}
      </Typography>
      {/* Render the Collapse container which holds the children */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </>
  );
}
