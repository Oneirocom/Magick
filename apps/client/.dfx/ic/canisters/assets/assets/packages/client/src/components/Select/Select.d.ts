declare const BasicSelect: ({ options, onChange, placeholder, style, focusKey, creatable, nested, isValidNewOption, ...props }: {
    [x: string]: any;
    options: any;
    onChange: any;
    placeholder: any;
    style?: {} | undefined;
    focusKey?: string | undefined;
    creatable?: boolean | undefined;
    nested?: boolean | undefined;
    isValidNewOption?: ((inputValue: any, selectValue: any, selectOptions: any, accessors: any) => boolean) | undefined;
}) => JSX.Element;
export default BasicSelect;
