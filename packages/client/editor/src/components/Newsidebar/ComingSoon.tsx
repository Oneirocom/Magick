import AddIcon from '@mui/icons-material/Add'
import Typography from '@mui/material/Typography'
import styles from './menu.module.css'

export const ComingSoon = () => {
  return (<div className={styles.menu} style={{ color: '#7D7D7D' }}>
    <div className={styles.menuFlex}>
      <AddIcon sx={{ mr: 1 }} />
      <Typography variant="body1" style={{ whiteSpace: 'nowrap' }}>
        Notion (coming soon)
      </Typography>
    </div>
    <div className={styles.menuFlex}>
      <AddIcon sx={{ mr: 1 }} />
      <Typography variant="body1" style={{ whiteSpace: 'nowrap' }}>
        Google Drive (coming soon)
      </Typography>
    </div>
  </div>)
}