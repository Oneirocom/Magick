import { Check, DeleteOutline, Close } from '@mui/icons-material'

import { FC, useState } from "react";
import { SidebarButton } from "./SidebarButton";
import styles from './styles.module.css';

interface Props {
  onClearConversations: () => void;
}

export const ClearConversations: FC<Props> = ({ onClearConversations }) => {
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const handleClearConversations = () => {
    onClearConversations();
    setIsConfirming(false);
  };

  return isConfirming ? (
    <div className={`${styles.flex} ${styles.hoverBg} ${styles.py3} ${styles.px3} ${styles.roundedMd} ${styles.cursorPointer} ${styles.wFull} ${styles.itemsCenter}`}>
      <DeleteOutline />

      <div className={`${styles.ml3} ${styles.flex1} ${styles.textLeft} ${styles.textWhite}`}>Are you sure?</div>

      <div className={styles.flexW40}>
        <Check
          className={`${styles.mlAuto} ${styles.minW20} ${styles.textNeutral400} ${styles.hoverTextNeutral100}`}
          onClick={(e) => {
            e.stopPropagation();
            handleClearConversations();
          }}
        />

        <Close
          className={`${styles.mlAuto} ${styles.minW20} ${styles.textNeutral400} ${styles.hoverTextNeutral100}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsConfirming(false);
          }}
        />
      </div>
    </div>
  ) : (
    <SidebarButton
      text="Clear conversations"
      icon={<DeleteOutline />}
      onClick={() => setIsConfirming(true)}
    />
  );
};
