export declare const componentCategories: {
    'AI/ML': string;
    'I/O': string;
    Logic: string;
    State: string;
    Module: string;
    Core: string;
};
export declare const dataControlCategories: {
    'Data Inputs': string;
    'Data Outputs': string;
    Fewshot: string;
    Stop: string;
    Temperature: string;
    'Max Tokens': string;
};
declare const Icon: ({ name, size, style, onClick }: {
    name?: string | undefined;
    size?: number | undefined;
    style?: {} | undefined;
    onClick?: (() => void) | undefined;
}) => JSX.Element;
export default Icon;
