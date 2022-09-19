export interface GameState {
    id: string;
    state: Record<string, unknown>;
    spellId: string;
}
export declare const selectGameStateBySpellId: ((state: {
    ids: import("@reduxjs/toolkit").EntityId[];
    entities: import("@reduxjs/toolkit").Dictionary<GameState>;
}, params_0: {}) => GameState | undefined) & import("reselect").OutputSelectorFields<(args_0: GameState[], args_1: any) => GameState & {
    clearCache: () => void;
}> & {
    clearCache: () => void;
};
export declare const selectById: (state: import("@reduxjs/toolkit").EntityState<GameState>, id: import("@reduxjs/toolkit").EntityId) => GameState | undefined;
export declare const updateGameState: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, string>, createGameState: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, string>, setGameState: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, string>;
declare const _default: import("redux").Reducer<import("@reduxjs/toolkit").EntityState<GameState>, import("redux").AnyAction>;
export default _default;
