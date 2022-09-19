declare const Chip: ({ label, onClick, noEvents, }: {
    label: string;
    onClick?: (() => {}) | undefined;
    noEvents?: boolean | undefined;
}) => JSX.Element;
export default Chip;
