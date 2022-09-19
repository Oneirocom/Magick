import { ReactElement } from 'react';
declare type Props = {
    outline?: boolean;
    dark?: boolean;
    borderless?: boolean;
    darker?: boolean;
    grid?: boolean;
    scrollToBottom?: boolean;
    toolbar?: ReactElement<any, any> | false;
    lock?: ReactElement<any, any> | false;
    children: ReactElement<any, any> | ReactElement<any, any>[];
};
declare const Window: (props: Props) => JSX.Element;
export default Window;
