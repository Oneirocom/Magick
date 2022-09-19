/// <reference types="react" />
import { Node } from '@thothai/thoth-core';
export declare class MyNode extends Node {
    props: {
        node: any;
        bindSocket: any;
        bindControl: any;
    };
    state: {
        outputs: any;
        controls: any;
        inputs: any;
        selected: any;
    };
    render(): JSX.Element;
}
