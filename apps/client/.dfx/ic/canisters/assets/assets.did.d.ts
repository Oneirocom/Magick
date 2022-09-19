import type { Principal } from '@dfinity/principal';
export type BatchId = bigint;
export type BatchOperationKind = { 'CreateAsset' : CreateAssetArguments } |
  { 'UnsetAssetContent' : UnsetAssetContentArguments } |
  { 'DeleteAsset' : DeleteAssetArguments } |
  { 'SetAssetContent' : SetAssetContentArguments } |
  { 'Clear' : ClearArguments };
export type ChunkId = bigint;
export type ClearArguments = {};
export interface CreateAssetArguments { 'key' : Key, 'content_type' : string }
export interface DeleteAssetArguments { 'key' : Key }
export type HeaderField = [string, string];
export interface HttpRequest {
  'url' : string,
  'method' : string,
  'body' : Array<number>,
  'headers' : Array<HeaderField>,
}
export interface HttpResponse {
  'body' : Array<number>,
  'headers' : Array<HeaderField>,
  'streaming_strategy' : [] | [StreamingStrategy],
  'status_code' : number,
}
export type Key = string;
export interface SetAssetContentArguments {
  'key' : Key,
  'sha256' : [] | [Array<number>],
  'chunk_ids' : Array<ChunkId>,
  'content_encoding' : string,
}
export interface StreamingCallbackHttpResponse {
  'token' : [] | [StreamingCallbackToken],
  'body' : Array<number>,
}
export interface StreamingCallbackToken {
  'key' : Key,
  'sha256' : [] | [Array<number>],
  'index' : bigint,
  'content_encoding' : string,
}
export type StreamingStrategy = {
    'Callback' : {
      'token' : StreamingCallbackToken,
      'callback' : [Principal, string],
    }
  };
export type Time = bigint;
export interface UnsetAssetContentArguments {
  'key' : Key,
  'content_encoding' : string,
}
export interface _SERVICE {
  'authorize' : (arg_0: Principal) => Promise<undefined>,
  'clear' : (arg_0: ClearArguments) => Promise<undefined>,
  'commit_batch' : (
      arg_0: { 'batch_id' : BatchId, 'operations' : Array<BatchOperationKind> },
    ) => Promise<undefined>,
  'create_asset' : (arg_0: CreateAssetArguments) => Promise<undefined>,
  'create_batch' : (arg_0: {}) => Promise<{ 'batch_id' : BatchId }>,
  'create_chunk' : (
      arg_0: { 'content' : Array<number>, 'batch_id' : BatchId },
    ) => Promise<{ 'chunk_id' : ChunkId }>,
  'delete_asset' : (arg_0: DeleteAssetArguments) => Promise<undefined>,
  'get' : (
      arg_0: { 'key' : Key, 'accept_encodings' : Array<string> },
    ) => Promise<
      {
        'content' : Array<number>,
        'sha256' : [] | [Array<number>],
        'content_type' : string,
        'content_encoding' : string,
        'total_length' : bigint,
      }
    >,
  'get_chunk' : (
      arg_0: {
        'key' : Key,
        'sha256' : [] | [Array<number>],
        'index' : bigint,
        'content_encoding' : string,
      },
    ) => Promise<{ 'content' : Array<number> }>,
  'http_request' : (arg_0: HttpRequest) => Promise<HttpResponse>,
  'http_request_streaming_callback' : (
      arg_0: StreamingCallbackToken,
    ) => Promise<[] | [StreamingCallbackHttpResponse]>,
  'list' : (arg_0: {}) => Promise<
      Array<
        {
          'key' : Key,
          'encodings' : Array<
            {
              'modified' : Time,
              'sha256' : [] | [Array<number>],
              'length' : bigint,
              'content_encoding' : string,
            }
          >,
          'content_type' : string,
        }
      >
    >,
  'set_asset_content' : (arg_0: SetAssetContentArguments) => Promise<undefined>,
  'store' : (
      arg_0: {
        'key' : Key,
        'content' : Array<number>,
        'sha256' : [] | [Array<number>],
        'content_type' : string,
        'content_encoding' : string,
      },
    ) => Promise<undefined>,
  'unset_asset_content' : (arg_0: UnsetAssetContentArguments) => Promise<
      undefined
    >,
}
