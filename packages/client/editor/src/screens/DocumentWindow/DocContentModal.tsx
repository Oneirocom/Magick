import { Modal } from 'client/core'
import { useTreeData } from '@magickml/providers'
import { Typography } from '@mui/material'
import styles from './index.module.scss'

function DocContentModal({ contentModal, setContentModal, document }) {
  const { setOpenDoc } = useTreeData()
  return (
    <Modal
      open={contentModal}
      onClose={() => {
        setOpenDoc('')
        setContentModal(false)
      }}
    >
      <div className={styles.modalContent}>
        <Typography variant="body1" className={styles.modalTitle}>
          {document}
        </Typography>
      </div>
    </Modal>
  )
}

export default DocContentModal
