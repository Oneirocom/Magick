import { Model } from 'flexlayout-react';
declare type WindowType = 'textEditor' | 'inspector' | 'stateManager' | 'editor' | 'playtest' | 'debugConsole' | 'settings';
declare type WindowTypes = Record<string, WindowType>;
declare global {
    interface Window {
        getLayout: any;
    }
}
declare type LayoutContext = {
    currentModel: Model | null;
    createModel: Function;
    createOrFocus: Function;
    windowTypes: WindowTypes;
    currentRef: any;
    setCurrentRef: any;
};
export declare const useLayout: () => LayoutContext;
declare const LayoutProvider: ({ children, tab }: {
    children: any;
    tab: any;
}) => JSX.Element;
export declare const Layout: ({ json, factory, tab }: {
    json: any;
    factory: any;
    tab: any;
}) => JSX.Element;
export default LayoutProvider;
