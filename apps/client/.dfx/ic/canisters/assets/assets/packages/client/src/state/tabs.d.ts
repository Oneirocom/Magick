import { RootState } from './store';
export interface Tab {
    id: string;
    name: string;
    active: boolean;
    layoutJson: Record<string, unknown>;
    type?: 'spell' | 'module';
    spell?: string;
    spellId: string;
    module: string;
}
export declare const tabSlice: import("@reduxjs/toolkit").Slice<import("@reduxjs/toolkit").EntityState<Tab>, {
    openTab: (state: import("immer/dist/internal").WritableDraft<import("@reduxjs/toolkit").EntityState<Tab>>, action: {
        payload: any;
        type: string;
    }) => void;
    closeTab: {
        <S extends import("@reduxjs/toolkit").EntityState<Tab>>(state: import("@reduxjs/toolkit/dist/tsHelpers").IsAny<S, import("@reduxjs/toolkit").EntityState<Tab>, S>, key: import("@reduxjs/toolkit").EntityId): S;
        <S_1 extends import("@reduxjs/toolkit").EntityState<Tab>>(state: import("@reduxjs/toolkit/dist/tsHelpers").IsAny<S_1, import("@reduxjs/toolkit").EntityState<Tab>, S_1>, key: {
            payload: import("@reduxjs/toolkit").EntityId;
            type: string;
        }): S_1;
    };
    switchTab: {
        <S_2 extends import("@reduxjs/toolkit").EntityState<Tab>>(state: import("@reduxjs/toolkit/dist/tsHelpers").IsAny<S_2, import("@reduxjs/toolkit").EntityState<Tab>, S_2>, update: import("@reduxjs/toolkit").Update<Tab>): S_2;
        <S_3 extends import("@reduxjs/toolkit").EntityState<Tab>>(state: import("@reduxjs/toolkit/dist/tsHelpers").IsAny<S_3, import("@reduxjs/toolkit").EntityState<Tab>, S_3>, update: {
            payload: import("@reduxjs/toolkit").Update<Tab>;
            type: string;
        }): S_3;
    };
    clearTabs: <S_4 extends import("@reduxjs/toolkit").EntityState<Tab>>(state: import("@reduxjs/toolkit/dist/tsHelpers").IsAny<S_4, import("@reduxjs/toolkit").EntityState<Tab>, S_4>) => S_4;
    saveTabLayout: (state: import("immer/dist/internal").WritableDraft<import("@reduxjs/toolkit").EntityState<Tab>>, action: {
        payload: any;
        type: string;
    }) => void;
}, "tabs">;
export declare const openTab: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, string>, closeTab: import("@reduxjs/toolkit").ActionCreatorWithPayload<import("@reduxjs/toolkit").EntityId, string>, switchTab: import("@reduxjs/toolkit").ActionCreatorWithPayload<import("@reduxjs/toolkit").Update<Tab>, string>, clearTabs: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<string>, saveTabLayout: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, string>;
export declare const activeTabSelector: (state: RootState) => Tab | undefined;
export declare const selectAllTabs: (state: import("@reduxjs/toolkit").EntityState<Tab>) => Tab[];
declare const _default: import("redux").Reducer<import("@reduxjs/toolkit").EntityState<Tab>, import("redux").AnyAction>;
export default _default;
