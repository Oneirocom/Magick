import React from 'react'
import styles from '../../App.module.css'
import { useZustand } from '../../store/useZustand'

export const Sxp = () => {

    const {
        avatarVrm,
      } = useZustand()

    return(
        <div className={styles.sxpContainer}>
            <div className={styles.sxpContainerTitle}>
                Personality:
            </div>

            <div className={styles.sxpItems}>
                <span className={styles.sxpItemTitle}>Name: </span>{avatarVrm ? 'Eliza' : ''}
            </div>
            <div className={styles.sxpItems}>
                <span className={styles.sxpItemTitle}>Agent: </span>{avatarVrm ? "b00583bc-23c3-4a10-b284-9cb525f1dc37" : ''}
            </div>
            <div className={styles.sxpItems}>
                <span className={styles.sxpItemTitle}>SpellName: </span>{avatarVrm ? 'Project' : ''}
            </div>
            <div className={styles.sxpItems}>
                <span className={styles.sxpItemTitle}>EndPoint: </span>{avatarVrm ? 'MagickML V1' : ''}
            </div>
            <div className={styles.sxpItems}>
                <span className={styles.sxpItemTitle}>DefaultMessage: </span>{avatarVrm ? 'Hello' : ''}
            </div>
        </div>
    )
}