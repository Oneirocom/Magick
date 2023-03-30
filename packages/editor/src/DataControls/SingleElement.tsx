// GENERATED 
/**
 * The Props for the SingleElement function component.
 * @interface
 */
interface SingleElementProps {
  /**
   * The name of the element.
   */
  name: string;
  /**
   * The type of the element.
   */
  type: string;
  /**
   * The function that deletes the element.
   * 
   * @param name - The name of the element to be deleted.
   */
  delete: (name: string) => void;
}

/**
 * A function component that renders a single element.
 * 
 * @param props - The props of the SingleElement component.
 * @returns The JSX representation of the component.
 */
const SingleElement = (props: SingleElementProps) => {
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
        <IconBtn
          label={props.name}
          Icon={<Icon name="trash" size={20} />}
          onClick={() => props.delete(props.name)}
        />
      </div>
    </div>
  );
}

export default SingleElement;