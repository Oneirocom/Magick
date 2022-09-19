export interface Scope {
    id: number;
    full_table_size: string;
    table_size: string;
    tables: string;
    record_count: string;
}
export interface ScopeRes {
    message: String;
    payload: {
        data: Scope[];
        pages: number;
        totalItems: number;
    };
}
export interface State {
    scope: ScopeRes;
    siscope: {
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
export declare const createScope: import("@reduxjs/toolkit").AsyncThunk<any, {}, {}>;
export declare const retrieveScope: import("@reduxjs/toolkit").AsyncThunk<any, {
    currentPage: number;
    page: number;
}, {}>;
export declare const singleScope: import("@reduxjs/toolkit").AsyncThunk<any, number, {}>;
export declare const searchScope: import("@reduxjs/toolkit").AsyncThunk<any, string, {}>;
export declare const updateScope: import("@reduxjs/toolkit").AsyncThunk<any, {
    id: number;
    formData: {
        tables: string;
        fullTableSize: {
            label: string;
            value: string;
        };
        tableSize: {
            label: string;
            value: string;
        };
        recordCount: string;
    };
}, {}>;
export declare const deleteScope: import("@reduxjs/toolkit").AsyncThunk<any, number, {}>;
declare const reducer: import("redux").Reducer<State, import("redux").AnyAction>;
export default reducer;
