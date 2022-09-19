interface InfoModal {
    title: string;
    content: string;
    checkbox?: {
        onClick: () => {};
        label: string;
    };
}
declare const InfoModal: ({ title, content, checkbox }: InfoModal) => JSX.Element;
export default InfoModal;
