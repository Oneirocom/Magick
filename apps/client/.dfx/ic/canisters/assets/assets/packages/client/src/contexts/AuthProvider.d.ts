import { ReactElement } from 'react';
interface SessionInfoType {
    id: number;
    email: string;
    expiresAt: number;
    username: string;
    appRootUrl: string;
}
export interface UserInfoType {
    id: string;
    email: string;
    groups: string[];
    username: string;
}
export declare const useAuth: () => {
    session: SessionInfoType | null;
    user: UserInfoType | null;
    logoutAndRedirect: () => void;
    loginRedirect: (force?: boolean, returnToPath?: string) => void;
    refreshSession: (origin: string) => void;
    done: boolean;
};
declare const AuthProvider: ({ children }: {
    children: ReactElement;
}) => JSX.Element;
export default AuthProvider;
export declare const getAuthHeader: () => Promise<{
    Authorization: string;
}>;
export declare const setSessionId: (sessionId: string) => Promise<void>;
export declare const getSessionId: () => Promise<any>;
export declare const removeSessionId: () => Promise<void>;
export declare const setOauthState: (oauthState: string) => Promise<void>;
export declare const setStateStore: (state: string, store: Record<string, string>) => Promise<void>;
export declare const getStateStore: (state: string) => Promise<any>;
export declare const getOauthState: () => Promise<any>;
export declare const removeOauthState: () => Promise<void>;
