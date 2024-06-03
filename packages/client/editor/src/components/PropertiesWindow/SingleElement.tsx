// DOCUMENTED
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCodeCommit } from '@fortawesome/free-solid-svg-icons'
import { Icon, IconBtn } from 'client/core'
import styles from './datacontrols.module.css'

/**
 * @typedef Props
 * @type {object}
 * @property {string} name - The name of the element.
 * @property {string} type - The type of the element.
 * @property {(name: string) => void} delete - Function to handle deletion of the element.
 */
type Props = {
  name: string
  delete: (name: string) => void
  socketType?: string
  type?: string
}

/**
 * `SingleElement` renders a single line item of of a socket that has been added by the socket generator.
 * TODO - Add support for selecting socket types here
 *  @param {Props} props - The props needed for the SingleElement component.
 * @returns {React.JSX.Element} The rendered SingleElement component.
 */
const SingleElement = ({
  name,
  delete: handleDelete,
}: Props): React.JSX.Element => {
  return (
    <div className={`${styles.flexCenterBtn} ${styles.inputContainer}`}>
      <div className={styles.flexCenterBtn}>
        <span className="pl-2 pr-4" style={{ float: 'right' }}>
          <FontAwesomeIcon icon={faCodeCommit} />
        </span>
        <p style={{ display: 'inline' }}>{name}</p>
      </div>
      <div className={styles.flexCenterBtn}>
        <IconBtn
          label={name}
          Icon={<Icon name="trash" size={20} />}
          onClick={() => handleDelete(name)}
        />
      </div>
    </div>
  )
}

export default SingleElement
