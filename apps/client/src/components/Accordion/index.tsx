import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import makeStyles from '@mui/styles/makeStyles'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import css from './accordion.module.css'
import Icon from '../Icon/Icon'
import './accordion-overrides.css'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: 'var(--dark-3) !important',
    boxShadow: 'none',
    padding: '0',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    margin: 0,
  },
  accordionSummary: {
    flexDirection: 'row-reverse',
    margin: 0,
  },
  expandIcon: {
    marginRight: 8,
    padding: 0,
  },
  detailsRoot: {
    backgroundColor: 'var(--dark-2)',
  },
  summaryContent: {
    margin: 0,
  },
}))

export const SimpleAccordion = ({ setExpanded = x => { }, ...props }) => {
  const classes = useStyles() as any

  const onChange = (_, expanded) => {
    setExpanded(expanded)
  }

  return (
    <div className={css['accordion']}>
      <Accordion
        square={true}
        elevation={0}
        onChange={onChange}
        expanded={props.expanded}
        defaultExpanded={props.defaultExpanded}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          className={classes.accordionSummary}
          classes={{
            root: classes.root,
            expandIconWrapper: classes.expandIcon,
            // content: classes.root,
            // accordionSummaryContent: classes.summaryContent
          }}
          id="panel1a-header"
        >
          <Icon name={props.icon} style={{ marginRight: 'var(--c1)' }} />
          <Typography className={classes.heading}>{props.heading}</Typography>
        </AccordionSummary>
        <AccordionDetails classes={{ root: classes.detailsRoot }}>
          {/* <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography> */}
          {props.children}
        </AccordionDetails>
      </Accordion>
    </div>
  )
}
