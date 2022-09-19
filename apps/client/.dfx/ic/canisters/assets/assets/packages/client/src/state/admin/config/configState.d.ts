export interface Config {
    id: number;
    key: string;
    value: string;
}
export interface ConfigRes {
    message: String;
    payload: {
        data: Config[];
        totalItems: number;
    };
}
export interface State {
    config: ConfigRes;
    sconfig: {
        message: string;
        payload: {};
    };
    loading: boolean;
    error: any;
    success: boolean;
    createSuccess: boolean;
    updateSuccess: boolean;
    deleteSuccess: boolean;
}
export declare const createConfig: import("@reduxjs/toolkit").AsyncThunk<import("axios").AxiosResponse<any>, {}, {}>;
export declare const retrieveConfig: import("@reduxjs/toolkit").AsyncThunk<any, {
    currentPage: number;
    page: number;
}, {}>;
export declare const SingleConfig: import("@reduxjs/toolkit").AsyncThunk<any, number, {}>;
export declare const updateConfig: import("@reduxjs/toolkit").AsyncThunk<any, {
    id: number;
    formData: {
        key: string;
        value: string;
    };
}, {}>;
export declare const deleteConfig: import("@reduxjs/toolkit").AsyncThunk<any, number, {}>;
export declare const searchConfig: import("@reduxjs/toolkit").AsyncThunk<any, string, {}>;
declare const reducer: import("redux").Reducer<State, import("redux").AnyAction>;
export default reducer;
