// DOCUMENTED 
import { GridViewRounded } from '@mui/icons-material';
import { Icon, IconBtn } from '@magickml/client-core';
import styles from './datacontrols.module.css';

/**
 * @typedef Props
 * @type {object}
 * @property {string} name - The name of the element.
 * @property {string} type - The type of the element.
 * @property {(name: string) => void} delete - Function to handle deletion of the element.
 */

/**
 * `SingleElement` is a functional component that renders a single element with actions like delete.
 * @param {Props} props - The props needed for the SingleElement component.
 * @returns {JSX.Element} The rendered SingleElement component.
 */
const SingleElement = ({ name, type, delete: handleDelete }: Props): JSX.Element => {
  return (
    <div className={`${styles.flexCenterBtn} ${styles.inputContainer}`}>
      <div className={styles.flexCenterBtn}>
        <span style={{ float: 'right' }}>
          <IconBtn
            Icon={<GridViewRounded color="inherit" />}
            style={{ cursor: 'auto' }}
            label={name}
          />
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
  );
};

export default SingleElement;