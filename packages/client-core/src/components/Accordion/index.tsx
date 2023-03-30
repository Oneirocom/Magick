// GENERATED 
/**
 * This file exports an implementation of an accordion component using the Material UI.
 *
 * The component:
 *  - accepts a title and children as props
 *  - is styled using scss files,
 *  - uses `@mui` components like `Accordion`, `AccordionSummary`, `AccordionDetails` and `Typography`
 */

import * as React from 'react';
import {styled} from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, {AccordionProps} from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import styles from './index.module.scss';

/**
 *  Styled `Accordion` component
 */
const StyledAccordion = styled((props: AccordionProps) => (
  <MuiAccordion
    disableGutters
    elevation={0}
    square
    {...props}
    classes={{
      root: styles.accordion
    }}
  />
))(({theme}) => ({
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

/**
 * Styled `AccordionSummary` component
 */
const AccordionSummaryIcon = () => (
  <ArrowForwardIosSharpIcon sx={{fontSize: '0.9rem'}} />
);

const AccordionSummaryStyled = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary expandIcon={<AccordionSummaryIcon />} {...props} />
))(({theme}) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

/**
 * Styled `AccordionDetails` component
 */
const AccordionDetailsStyled = styled(MuiAccordionDetails)(({theme}) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

interface Props {
  title: string;
  children: React.ReactNode;
}

/**
 * `Accordion` component implementation
 */
export function Accordion({title, children}: Props) {
  // gives the initial state of the accordion
  const [expanded, setExpanded] = React.useState<string | false>('panel1');

  /**
   * `handleChange` function to manage panel expansions
   *
   * @param panel - The string panel reference of `Accordion`
   *
   * @returns the `handleChange` function
   */
  const handleChange = (panel: string) => (
    event: React.SyntheticEvent, 
    newExpanded: boolean
  ) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div className={styles['mg-btm-small']}>
      <StyledAccordion 
        expanded={expanded === 'panel1'} 
        onChange={handleChange('panel1')}
      >
        <AccordionSummaryStyled 
          aria-controls="panel1d-content" 
          id="panel1d-header"
        >
          <Typography>{title}</Typography>
        </AccordionSummaryStyled>
        <AccordionDetailsStyled classes={{root: styles.collapse}}>
          {children}
        </AccordionDetailsStyled>
      </StyledAccordion>
    </div>
  );
}