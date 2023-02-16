import IconBtn from '../../../components/IconButton'
import { GridViewRounded, ArrowForwardIosTwoTone } from '@mui/icons-material'
import Icon from '../../../components/Icon/Icon'
import styles from './datacontrols.module.css'

interface Props {
  name: string
  type: string
  delete: (name: string) => void
}

const SingleElement = (props: Props) => {
  return (
    <div className={`${styles.flexCenterBtn} ${styles.inputContainer}`}>
      <div className={styles.flexCenterBtn}>
        <span style={{ float: 'right' }}>
          <IconBtn
            Icon={<GridViewRounded color="inherit" />}
            style={{ cursor: 'auto' }}
            label={props.name}
          />
        </span>
        <p style={{ display: 'inline' }}>{props.name}</p>
      </div>
      <div className={styles.flexCenterBtn}>
        <div className={`${styles.flexCenterStart} ${styles.typeInfo}`}>
          <IconBtn
            label={props.name}
            style={{ cursor: 'auto' }}
            Icon={
              <ArrowForwardIosTwoTone
                style={{ fontSize: '8px', cursor: 'auto' }}
              />
            }
          />
          <p style={{ textTransform: 'capitalize' }}>{props.type}</p>
        </div>
        <IconBtn
          label={props.name}
          Icon={<Icon name="trash" size={20} />}
          onClick={() => props.delete(props.name)}
        />
      </div>
    </div>
  )
}

export default SingleElement
