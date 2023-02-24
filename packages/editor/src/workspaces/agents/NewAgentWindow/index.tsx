import { Button, Grid, Typography } from '@mui/material'
import AgentItem from './AgentItem'
import styles from './index.module.scss'
import AgentDetails from './AgentDetails'
import CustomizedAccordion from './Accordion'
import Accordion from '../../../components/Accordion'

const AgentWindow = () => {
  return (
    <Grid container className={styles.container}>
      <Grid item xs={3.9} className={styles.item}>
        <Typography
          variant="h6"
          className={`${styles.heading} ${styles['mg-btm-small']}`}
        >
          Agents
        </Typography>
        <Button
          variant="contained"
          className={`${styles.btn} ${styles['mg-btm-medium']}`}
        >
          Add Agent
        </Button>
        <AgentItem />
      </Grid>
      <Grid item xs={8} className={styles.item}>
        <AgentDetails />
        <Accordion title="Connectors">
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada
            lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </Accordion>
        <Accordion title="Variables">
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada
            lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </Accordion>
      </Grid>
    </Grid>
  )
}

export default AgentWindow
