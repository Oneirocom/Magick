import { Modal } from 'client/core'
import { useTreeData } from '@magickml/providers'
import { Typography } from '@mui/material'
import styles from './index.module.scss'

type Props = {
  contentModal: boolean
  setContentModal: (value: boolean) => void
  knowledge: string
}

function DocContentModal({ contentModal, setContentModal, knowledge }: Props) {
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
          {knowledge}
        </Typography>
      </div>
    </Modal>
  )
}

export default DocContentModal
