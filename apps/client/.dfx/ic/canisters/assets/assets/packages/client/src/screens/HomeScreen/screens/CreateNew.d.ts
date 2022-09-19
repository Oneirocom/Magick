import { GraphData } from '@thothai/thoth-core/types';
export declare type Template = {
    label: string;
    bg: string;
    graph: GraphData;
};
export declare const thothTemplates: {
    label: string;
    bg: any;
    graph: {
        id: string;
        nodes: {
            '124': {
                id: number;
                data: {
                    name: string;
                    socketKey: string;
                    dataControls: {
                        name: {
                            expanded: boolean;
                        };
                    };
                };
                inputs: {};
                outputs: {
                    trigger: {
                        connections: never[];
                    };
                };
                position: number[];
                name: string;
            };
            '232': {
                id: number;
                data: {
                    playtestToggle: {
                        receivePlaytest: boolean;
                        outputs: never[];
                    };
                    socketKey: string;
                    text: string;
                    dataControls: {
                        name: {
                            expanded: boolean;
                        };
                        playtestToggle: {
                            expanded: boolean;
                        };
                    };
                    name: string;
                    outputs: never[];
                };
                inputs: {};
                outputs: {
                    output: {
                        connections: never[];
                    };
                };
                position: number[];
                name: string;
            };
            '233': {
                id: number;
                data: {};
                inputs: {
                    text: {
                        connections: never[];
                    };
                    trigger: {
                        connections: never[];
                    };
                };
                outputs: {
                    trigger: {
                        connections: never[];
                    };
                };
                position: number[];
                name: string;
            };
        };
    };
}[];
declare const CreateNew: () => JSX.Element;
export default CreateNew;
