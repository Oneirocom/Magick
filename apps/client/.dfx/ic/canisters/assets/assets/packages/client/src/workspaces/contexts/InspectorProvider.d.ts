import { InspectorData } from '@thothai/thoth-core/types';
export declare type TextEditorData = {
    options?: Record<string, any> | undefined;
    data?: string;
    control?: Record<string, any> | undefined;
    name?: string;
};
declare type InspectorContext = {
    inspectorData: InspectorData | null;
    textEditorData: TextEditorData | null;
    saveTextEditor: Function;
    saveInspector: Function;
};
export declare const useInspector: () => InspectorContext;
declare const InspectorProvider: ({ children, tab }: {
    children: any;
    tab: any;
}) => JSX.Element;
export default InspectorProvider;
