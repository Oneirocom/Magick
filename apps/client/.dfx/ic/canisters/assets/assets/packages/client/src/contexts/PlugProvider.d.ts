interface PlugContext {
    userPrincipal: string | null;
    setUserPrincipal: (principal: string) => void;
    login: (onSucces?: (arg?: any) => void, onFail?: (arg?: any) => void) => Promise<void>;
    connected: boolean;
    getUserPrincipal: () => Promise<any>;
    getAgent: () => any;
    getPlug: () => any;
}
export declare const usePlugWallet: () => PlugContext;
declare const PlugProvider: ({ children }: {
    children: any;
}) => JSX.Element;
export default PlugProvider;
