export interface Preference {
    autoSave: boolean;
    doNotShowUnlockWarning: boolean;
}
export declare const preferenceSlice: import("@reduxjs/toolkit").Slice<{
    autoSave: boolean;
    doNotShowUnlockWarning: boolean;
}, {
    toggleAutoSave: (state: import("immer/dist/internal").WritableDraft<{
        autoSave: boolean;
        doNotShowUnlockWarning: boolean;
    }>) => void;
    toggleDoNotShowUnlockWarning: (state: import("immer/dist/internal").WritableDraft<{
        autoSave: boolean;
        doNotShowUnlockWarning: boolean;
    }>) => void;
}, "preferences">;
export declare const toggleAutoSave: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<string>, toggleDoNotShowUnlockWarning: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<string>;
declare const _default: import("redux").Reducer<{
    autoSave: boolean;
    doNotShowUnlockWarning: boolean;
}, import("redux").AnyAction>;
export default _default;
