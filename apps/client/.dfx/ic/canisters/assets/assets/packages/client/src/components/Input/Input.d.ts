declare const Input: ({ value, onChange, style, ...props }: {
    [x: string]: any;
    value: any;
    onChange?: ((e: any) => void) | undefined;
    style?: {} | undefined;
}) => JSX.Element;
export default Input;
