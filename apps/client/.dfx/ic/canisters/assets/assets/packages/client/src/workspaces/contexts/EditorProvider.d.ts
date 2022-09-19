import { GraphData, EditorContext, Spell, ThothEditor } from '@thothai/thoth-core/types';
export declare type ThothTab = {
    layoutJson: string;
    name: string;
    id: string;
    spell: string;
    module: string;
    type: string;
    active: boolean;
};
export declare const useEditor: () => {
    run: () => void;
    getEditor: () => ThothEditor | null;
    editor: ThothEditor | null;
    serialize: () => GraphData | undefined;
    buildEditor: (el: HTMLDivElement, spell: Spell | undefined, tab: ThothTab, reteInterface: EditorContext) => void;
    setEditor: (editor: any) => void;
    getNodeMap: () => void;
    getNodes: () => void;
    loadGraph: (graph: any) => void;
    setContainer: () => void;
    undo: () => void;
    redo: () => void;
    del: () => void;
    centerNode: (nodeId: number) => void;
};
declare const EditorProvider: ({ children }: {
    children: any;
}) => JSX.Element;
export declare const Editor: any;
export default EditorProvider;
