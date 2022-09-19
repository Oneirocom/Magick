import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { GraphData, Spell } from '@thothai/thoth-core/types';
export interface Diff {
    name: string;
    diff: Record<string, unknown>;
}
export interface DeployedSpellVersion {
    spellId: string;
    version: string;
    message?: string;
    versionName?: string;
    url?: string;
    graph?: GraphData;
}
export interface DeployArgs {
    spellId: string;
    userId: string;
    message: string;
}
export interface GetDeployArgs {
    spellId: string;
    version: string;
}
export interface PatchArgs {
    spellId: string;
    userId: string;
    update: Partial<Spell>;
}
export interface RunSpell {
    spellId: string;
    version?: string;
    inputs: Record<string, any>;
    state?: Record<string, any>;
}
export interface UserSpellArgs {
    spellId: string;
    userId: string;
}
export declare const spellApi: import("@reduxjs/toolkit/query/react").Api<import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, {
    getSpells: import("@reduxjs/toolkit/query/react").QueryDefinition<string, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", Spell[], "api">;
    getSpell: import("@reduxjs/toolkit/query/react").QueryDefinition<UserSpellArgs, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", Spell, "api">;
    runSpell: import("@reduxjs/toolkit/query/react").MutationDefinition<RunSpell, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", Record<string, any>, "api">;
    saveDiff: import("@reduxjs/toolkit/query/react").MutationDefinition<Diff, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", void, "api">;
    spellExists: import("@reduxjs/toolkit/query/react").MutationDefinition<string, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", boolean, "api">;
    saveSpell: import("@reduxjs/toolkit/query/react").MutationDefinition<Spell | Partial<Spell>, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", Partial<Spell>, "api">;
    newSpell: import("@reduxjs/toolkit/query/react").MutationDefinition<Partial<Spell>, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", Spell, "api">;
    patchSpell: import("@reduxjs/toolkit/query/react").MutationDefinition<PatchArgs, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", Spell, "api">;
    deleteSpell: import("@reduxjs/toolkit/query/react").MutationDefinition<UserSpellArgs, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", string[], "api">;
    deploySpell: import("@reduxjs/toolkit/query/react").MutationDefinition<DeployArgs, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", DeployedSpellVersion, "api">;
    getDeployments: import("@reduxjs/toolkit/query/react").QueryDefinition<string, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", DeployedSpellVersion[], "api">;
    getDeployment: import("@reduxjs/toolkit/query/react").QueryDefinition<GetDeployArgs, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", DeployedSpellVersion, "api">;
}, "api", "Spell" | "Spells" | "Version", typeof import("@reduxjs/toolkit/dist/query/core/module").coreModuleName | typeof import("@reduxjs/toolkit/dist/query/react/module").reactHooksModuleName>;
export declare const selectAllSpells: ((state: {
    api: import("@reduxjs/toolkit/dist/query/core/apiState").CombinedState<{
        getSpells: import("@reduxjs/toolkit/query/react").QueryDefinition<string, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", Spell[], "api">;
        getSpell: import("@reduxjs/toolkit/query/react").QueryDefinition<UserSpellArgs, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", Spell, "api">;
        runSpell: import("@reduxjs/toolkit/query/react").MutationDefinition<RunSpell, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", Record<string, any>, "api">;
        saveDiff: import("@reduxjs/toolkit/query/react").MutationDefinition<Diff, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", void, "api">;
        spellExists: import("@reduxjs/toolkit/query/react").MutationDefinition<string, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", boolean, "api">;
        saveSpell: import("@reduxjs/toolkit/query/react").MutationDefinition<Spell | Partial<Spell>, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", Partial<Spell>, "api">;
        newSpell: import("@reduxjs/toolkit/query/react").MutationDefinition<Partial<Spell>, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", Spell, "api">;
        patchSpell: import("@reduxjs/toolkit/query/react").MutationDefinition<PatchArgs, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", Spell, "api">;
        deleteSpell: import("@reduxjs/toolkit/query/react").MutationDefinition<UserSpellArgs, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", string[], "api">;
        deploySpell: import("@reduxjs/toolkit/query/react").MutationDefinition<DeployArgs, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", DeployedSpellVersion, "api">;
        getDeployments: import("@reduxjs/toolkit/query/react").QueryDefinition<string, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", DeployedSpellVersion[], "api">;
        getDeployment: import("@reduxjs/toolkit/query/react").QueryDefinition<GetDeployArgs, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", DeployedSpellVersion, "api">;
    }, "Spell" | "Spells" | "Version", "api">;
}) => Spell[]) & import("reselect").OutputSelectorFields<(args_0: ({
    status: import("@reduxjs/toolkit/query/react").QueryStatus.uninitialized;
    originalArgs?: undefined;
    data?: undefined;
    error?: undefined;
    requestId?: undefined;
    endpointName?: string | undefined;
    startedTimeStamp?: undefined;
    fulfilledTimeStamp?: undefined;
} & {
    status: import("@reduxjs/toolkit/query/react").QueryStatus.uninitialized;
    isUninitialized: true;
    isLoading: false;
    isSuccess: false;
    isError: false;
}) | ({
    status: import("@reduxjs/toolkit/query/react").QueryStatus.fulfilled;
    error: undefined;
    originalArgs: string;
    requestId: string;
    endpointName: string;
    startedTimeStamp: number;
    data: Spell[];
    fulfilledTimeStamp: number;
} & {
    status: import("@reduxjs/toolkit/query/react").QueryStatus.fulfilled;
    isUninitialized: false;
    isLoading: false;
    isSuccess: true;
    isError: false;
}) | ({
    status: import("@reduxjs/toolkit/query/react").QueryStatus.pending;
    originalArgs: string;
    requestId: string;
    data?: Spell[] | undefined;
    error?: FetchBaseQueryError | import("@reduxjs/toolkit").SerializedError | undefined;
    endpointName: string;
    startedTimeStamp: number;
    fulfilledTimeStamp?: number | undefined;
} & {
    status: import("@reduxjs/toolkit/query/react").QueryStatus.pending;
    isUninitialized: false;
    isLoading: true;
    isSuccess: false;
    isError: false;
}) | ({
    status: import("@reduxjs/toolkit/query/react").QueryStatus.rejected;
    data?: Spell[] | undefined;
    fulfilledTimeStamp?: number | undefined;
    originalArgs: string;
    requestId: string;
    endpointName: string;
    startedTimeStamp: number;
    error: FetchBaseQueryError | import("@reduxjs/toolkit").SerializedError;
} & {
    status: import("@reduxjs/toolkit/query/react").QueryStatus.rejected;
    isUninitialized: false;
    isLoading: false;
    isSuccess: false;
    isError: true;
})) => Spell[] & {
    clearCache: () => void;
}> & {
    clearCache: () => void;
};
export declare const useGetSpellQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query/react").QueryDefinition<UserSpellArgs, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", Spell, "api">>, useGetSpellsQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query/react").QueryDefinition<string, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", Spell[], "api">>, useSpellExistsMutation: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseMutation<import("@reduxjs/toolkit/query/react").MutationDefinition<string, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", boolean, "api">>, useLazyGetSpellQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseLazyQuery<import("@reduxjs/toolkit/query/react").QueryDefinition<UserSpellArgs, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", Spell, "api">>, useNewSpellMutation: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseMutation<import("@reduxjs/toolkit/query/react").MutationDefinition<Partial<Spell>, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", Spell, "api">>, useDeleteSpellMutation: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseMutation<import("@reduxjs/toolkit/query/react").MutationDefinition<UserSpellArgs, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", string[], "api">>, useRunSpellMutation: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseMutation<import("@reduxjs/toolkit/query/react").MutationDefinition<RunSpell, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", Record<string, any>, "api">>, useSaveSpellMutation: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseMutation<import("@reduxjs/toolkit/query/react").MutationDefinition<Spell | Partial<Spell>, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", Partial<Spell>, "api">>, useSaveDiffMutation: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseMutation<import("@reduxjs/toolkit/query/react").MutationDefinition<Diff, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", void, "api">>, useDeploySpellMutation: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseMutation<import("@reduxjs/toolkit/query/react").MutationDefinition<DeployArgs, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", DeployedSpellVersion, "api">>, usePatchSpellMutation: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseMutation<import("@reduxjs/toolkit/query/react").MutationDefinition<PatchArgs, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", Spell, "api">>, useGetDeploymentsQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query/react").QueryDefinition<string, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", DeployedSpellVersion[], "api">>, useLazyGetDeploymentQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseLazyQuery<import("@reduxjs/toolkit/query/react").QueryDefinition<GetDeployArgs, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", DeployedSpellVersion, "api">>;
export declare const useGetSpellSubscription: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseLazyQuerySubscription<import("@reduxjs/toolkit/query/react").QueryDefinition<UserSpellArgs, import("@reduxjs/toolkit/query/react").BaseQueryFn<string | import("@reduxjs/toolkit/query/react").FetchArgs, unknown, FetchBaseQueryError, {}, import("@reduxjs/toolkit/query/react").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", Spell, "api">>;
