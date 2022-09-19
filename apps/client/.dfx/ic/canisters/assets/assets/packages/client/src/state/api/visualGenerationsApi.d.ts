import { ImageCacheResponse } from '@thothai/thoth-core/types';
export declare const visualGenerationsApi: import("@reduxjs/toolkit/dist/query").Api<import("@reduxjs/toolkit/dist/query").BaseQueryFn<string | import("@reduxjs/toolkit/dist/query").FetchArgs, unknown, import("@reduxjs/toolkit/dist/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/dist/query").FetchBaseQueryMeta>, {
    fetchFromImageCache: import("@reduxjs/toolkit/dist/query").MutationDefinition<{
        caption: string;
        cacheTag?: string | undefined;
        topK?: number | undefined;
    }, import("@reduxjs/toolkit/dist/query").BaseQueryFn<string | import("@reduxjs/toolkit/dist/query").FetchArgs, unknown, import("@reduxjs/toolkit/dist/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/dist/query").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", ImageCacheResponse, "api">;
}, "api", "Spell" | "Spells" | "Version", typeof import("@reduxjs/toolkit/dist/query/core/module").coreModuleName | typeof import("@reduxjs/toolkit/dist/query/react/module").reactHooksModuleName>;
export declare const useFetchFromImageCacheMutation: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseMutation<import("@reduxjs/toolkit/dist/query").MutationDefinition<{
    caption: string;
    cacheTag?: string | undefined;
    topK?: number | undefined;
}, import("@reduxjs/toolkit/dist/query").BaseQueryFn<string | import("@reduxjs/toolkit/dist/query").FetchArgs, unknown, import("@reduxjs/toolkit/dist/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/dist/query").FetchBaseQueryMeta>, "Spell" | "Spells" | "Version", ImageCacheResponse, "api">>;
