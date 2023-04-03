import styles from './styles.module.css';
import { Button } from '@magickml/client-core'

import { FC } from "react";

interface Props {
  onRegenerate: () => void;
}

export const Regenerate: FC<Props> = ({ onRegenerate }) => {
  return (
    <div className={styles.chatContainer}>
      <div className={styles.errorMessage}>Sorry, there was an error.</div>
      <Button
        className="small"
        style={{ cursor: 'pointer' }}
        onClick={onRegenerate}
      >
        Regenerate response
      </Button>
    </div>
  );
};
