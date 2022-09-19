export interface Client {
    id: number;
    client: string;
    name: string;
    type: string;
    default_value: string;
}
export interface ClientRes {
    message: String;
    payload: {
        data: Client[];
        pages: number;
        totalItems: number;
    };
}
export interface State {
    client: ClientRes;
    sclient: {
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
export declare const createClient: import("@reduxjs/toolkit").AsyncThunk<any, {}, {}>;
export declare const retrieveClient: import("@reduxjs/toolkit").AsyncThunk<any, {
    currentPage: number;
    page: number;
}, {}>;
export declare const searchClient: import("@reduxjs/toolkit").AsyncThunk<any, string, {}>;
export declare const singleClient: import("@reduxjs/toolkit").AsyncThunk<any, number, {}>;
export declare const updateClient: import("@reduxjs/toolkit").AsyncThunk<any, {
    id: number;
    formData: {
        client: string;
        name: string;
        type: string;
        defaultValue: string;
    };
}, {}>;
export declare const deleteClient: import("@reduxjs/toolkit").AsyncThunk<any, number, {}>;
declare const reducer: import("redux").Reducer<State, import("redux").AnyAction>;
export default reducer;
