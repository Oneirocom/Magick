import { MoreHoriz } from '@mui/icons-material'
import styles from './styles.module.css';

import { FC } from "react";

interface Props { }

export const ChatLoader: FC<Props> = () => {
  return (
    <div className={styles.group}>
      <div className={styles.innerDiv}>
        <div className={styles.fontBold}>AI:</div>
        <MoreHoriz className={styles.animatePulse} />
      </div>
    </div>
  );
};
