import { FC } from "react";
import { Button } from '@magickml/client-core'

interface Props {
  text: string;
  icon: JSX.Element;
  onClick: () => void;
}

export const SidebarButton: FC<Props> = ({ text, icon, onClick }) => {
  return (
    <Button
      className="small"
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      <div>{icon}</div>
      <div>{text}</div>
    </Button>
  );
};
