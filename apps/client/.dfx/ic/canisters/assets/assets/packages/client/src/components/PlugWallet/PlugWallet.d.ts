/// <reference types="react" />
import './plugWallet.css';
export declare function PlugWallet({ onConnect, onFail, }: {
    onConnect?: ((arg: string) => void) | undefined;
    onFail?: ((arg: string) => void) | undefined;
}): JSX.Element;
