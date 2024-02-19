import styles from './client-icons.module.css'

/* eslint-disable-next-line */
export interface ClientIconsProps {}

export function ClientIcons(props: ClientIconsProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to ClientIcons!</h1>
    </div>
  )
}

export default ClientIcons
