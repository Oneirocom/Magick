import { Modal } from '@magickml/client-core'
import {
  Typography,
} from '@mui/material'
import styles from './index.module.scss'


function DocContentModal({ contentModal, setContentModal, document }) {

  return (
    <Modal open={contentModal} onClose={() => setContentModal(false)}>
    <div className={styles.modalContent}>
      <Typography variant="body1" className={styles.modalTitle}>
        
        {document}
      </Typography>
      </div>
    </Modal>
  )
}

export default DocContentModal
