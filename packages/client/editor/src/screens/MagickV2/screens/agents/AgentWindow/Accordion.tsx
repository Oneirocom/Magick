// DOCUMENTED
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import React from 'react'
import styles from './index.module.scss'

// Create a styled Accordion component with custom styling
const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion
    disableGutters
    elevation={0}
    square
    {...props}
    classes={{ root: styles.accordion }}
  />
))(({ theme }) => ({
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}))

// Create a styled AccordionSummary component with custom styling
const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}))

// Create a styled AccordionDetails component with custom styling
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}))

interface Props {
  title: string
  children: React.ReactNode
}

/**
 * CustomizedAccordion component to display an accordion with custom styling.
 *
 * @param {string} title - The title of the accordion.
 * @param {React.ReactNode} children - The children to be displayed inside the accordion.
 * @returns {JSX.Element} The CustomizedAccordion component.
 */
export default function CustomizedAccordion({ title, children }: Props) {
  const [expanded, setExpanded] = React.useState<string | false>('panel1')

  // Handle the accordion state change
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false)
    }

  return (
    <div className={styles['mg-btm-medium']}>
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails classes={{ root: styles.collapse }}>
          {children}
        </AccordionDetails>
      </Accordion>
    </div>
  )
}
