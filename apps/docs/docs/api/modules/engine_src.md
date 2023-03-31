---
id: "engine_src"
title: "Module: engine/src"
sidebar_label: "engine/src"
sidebar_position: 0
custom_edit_url: null
---

## Classes

- [BooleanControl](../classes/engine_src.BooleanControl.md)
- [ClientPlugin](../classes/engine_src.ClientPlugin.md)
- [ClientPluginManager](../classes/engine_src.ClientPluginManager.md)
- [CodeControl](../classes/engine_src.CodeControl.md)
- [DropdownControl](../classes/engine_src.DropdownControl.md)
- [InputControl](../classes/engine_src.InputControl.md)
- [MagickComponent](../classes/engine_src.MagickComponent.md)
- [MagickEditor](../classes/engine_src.MagickEditor.md)
- [MagickEngineComponent](../classes/engine_src.MagickEngineComponent.md)
- [ModuleManager](../classes/engine_src.ModuleManager.md)
- [NumberControl](../classes/engine_src.NumberControl.md)
- [PlaytestControl](../classes/engine_src.PlaytestControl.md)
- [ServerPlugin](../classes/engine_src.ServerPlugin.md)
- [ServerPluginManager](../classes/engine_src.ServerPluginManager.md)
- [SpellManager](../classes/engine_src.SpellManager.md)
- [SpellRunner](../classes/engine_src.SpellRunner.md)
- [SwitchControl](../classes/engine_src.SwitchControl.md)
- [Task](../classes/engine_src.Task.md)
- [TextInputControl](../classes/engine_src.TextInputControl.md)
- [WorldManager](../classes/engine_src.WorldManager.md)

## Interfaces

- [EditorContext](../interfaces/engine_src.EditorContext.md)
- [IRunContextEditor](../interfaces/engine_src.IRunContextEditor.md)
- [MagickEngine](../interfaces/engine_src.MagickEngine.md)
- [MagickTask](../interfaces/engine_src.MagickTask.md)
- [ModuleIRunContextEditor](../interfaces/engine_src.ModuleIRunContextEditor.md)
- [ModuleOptions](../interfaces/engine_src.ModuleOptions.md)
- [PubSubContext](../interfaces/engine_src.PubSubContext.md)

## Type Aliases

### Agent

Ƭ **Agent**: `Static`<typeof [`agentSchema`](engine_src.md#agentschema)\>

The type for an agent object that's based on the `agentSchema`.

#### Defined in

[packages/engine/src/lib/schemas.ts:69](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/schemas.ts#L69)

___

### AgentInterface

Ƭ **AgentInterface**: [`Agent`](engine_src.md#agent)

The interface for an agent object that's based on the `agentSchema`.

#### Defined in

[packages/engine/src/lib/schemas.ts:71](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/schemas.ts#L71)

___

### AppService

Ƭ **AppService**: (`app`: `FeathersApplication`) => `void`

#### Type declaration

▸ (`app`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `app` | `FeathersApplication` |

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/types.ts:610](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L610)

___

### ChatCompletionData

Ƭ **ChatCompletionData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `apiKey?` | `string` |
| `conversationMessages` | [`ChatMessage`](engine_src.md#chatmessage)[] |
| `frequency_penalty` | `number` |
| `max_tokens` | `number` |
| `model` | `string` |
| `presence_penalty` | `number` |
| `stop` | `string`[] |
| `systemMessage` | `string` |
| `temperature` | `number` |
| `top_p` | `number` |
| `userMessage` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:550](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L550)

___

### ChatMessage

Ƭ **ChatMessage**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `content` | `string` |
| `role` | ``"system"`` \| ``"user"`` \| ``"assistant"`` \| `string` |

#### Defined in

[packages/engine/src/lib/types.ts:545](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L545)

___

### ClassifierSchema

Ƭ **ClassifierSchema**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `examples` | `string`[] \| `string` |
| `type` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:481](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L481)

___

### CompletionBody

Ƭ **CompletionBody**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `apiKey?` | `string` |
| `frequencyPenalty` | `number` |
| `maxTokens` | `number` |
| `modelName` | `string` |
| `presencePenalty` | `number` |
| `prompt` | `string` |
| `stop` | `any` |
| `temperature` | `number` |
| `topP` | `number` |

#### Defined in

[packages/engine/src/lib/types.ts:110](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L110)

___

### CompletionHandlerInputData

Ƭ **CompletionHandlerInputData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `context` | { `currentSpell`: [`SpellInterface`](engine_src.md#spellinterface) ; `magick`: [`EngineContext`](engine_src.md#enginecontext) ; `module`: `any` ; `projectId`: `string` ; `secrets`: `Record`<`string`, `string`\>  } |
| `context.currentSpell` | [`SpellInterface`](engine_src.md#spellinterface) |
| `context.magick` | [`EngineContext`](engine_src.md#enginecontext) |
| `context.module` | `any` |
| `context.projectId` | `string` |
| `context.secrets` | `Record`<`string`, `string`\> |
| `inputs` | [`MagickWorkerInputs`](engine_src.md#magickworkerinputs) |
| `node` | `NodeData` |
| `outputs` | [`MagickWorkerOutputs`](engine_src.md#magickworkeroutputs) |

#### Defined in

[packages/engine/src/lib/types.ts:570](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L570)

___

### CompletionInspectorControls

Ƭ **CompletionInspectorControls**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `dataKey` | `string` |
| `defaultValue` | `string` |
| `icon` | `string` |
| `name` | `string` |
| `type` | `DataControlImplementation` |

#### Defined in

[packages/engine/src/lib/types.ts:510](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L510)

___

### CompletionProvider

Ƭ **CompletionProvider**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `handler?` | (`attrs`: { `context`: `unknown` ; `inputs`: [`MagickWorkerInputs`](engine_src.md#magickworkerinputs) ; `node`: [`WorkerData`](engine_src.md#workerdata) ; `outputs`: [`MagickWorkerOutputs`](engine_src.md#magickworkeroutputs)  }) => { `error`: `string` ; `result`: `string` ; `success`: `boolean`  } |
| `inputs` | [`CompletionSocket`](engine_src.md#completionsocket)[] |
| `inspectorControls?` | [`CompletionInspectorControls`](engine_src.md#completioninspectorcontrols)[] |
| `models` | `string`[] |
| `outputs` | [`CompletionSocket`](engine_src.md#completionsocket)[] |
| `subtype` | [`ImageCompletionSubtype`](engine_src.md#imagecompletionsubtype) \| [`TextCompletionSubtype`](engine_src.md#textcompletionsubtype) |
| `type` | [`CompletionType`](engine_src.md#completiontype) |

#### Defined in

[packages/engine/src/lib/types.ts:518](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L518)

___

### CompletionResponse

Ƭ **CompletionResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `choice` | `any` |
| `success` | `any` |

#### Defined in

[packages/engine/src/lib/types.ts:124](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L124)

___

### CompletionSocket

Ƭ **CompletionSocket**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `socket` | `string` |
| `type` | `Socket` |

#### Defined in

[packages/engine/src/lib/types.ts:499](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L499)

___

### CompletionType

Ƭ **CompletionType**: ``"image"`` \| ``"text"``

#### Defined in

[packages/engine/src/lib/types.ts:493](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L493)

___

### ComponentData

Ƭ **ComponentData**<`T`\>: `Record`<`string`, `unknown`\> & { `icon?`: `string` ; `ignored?`: [`IgnoredList`](engine_src.md#ignoredlist) ; `socketType?`: [`SocketType`](engine_src.md#sockettype) ; `taskType?`: `T`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`TaskType`](engine_src.md#tasktype) |

#### Defined in

[packages/engine/src/lib/types.ts:371](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L371)

___

### ConnectionType

Ƭ **ConnectionType**: ``"input"`` \| ``"output"``

#### Defined in

[packages/engine/src/lib/types.ts:306](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L306)

___

### CreateDocumentArgs

Ƭ **CreateDocumentArgs**: [`Document`](engine_src.md#document)

#### Defined in

[packages/engine/src/lib/types.ts:52](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L52)

___

### CreateEventArgs

Ƭ **CreateEventArgs**: [`Event`](engine_src.md#event)

#### Defined in

[packages/engine/src/lib/types.ts:87](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L87)

___

### DataSocketType

Ƭ **DataSocketType**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `connectionType` | [`ConnectionType`](engine_src.md#connectiontype) |
| `name` | [`SocketNameType`](engine_src.md#socketnametype) |
| `socketKey` | `string` |
| `socketType` | [`SocketType`](engine_src.md#sockettype) |
| `taskType` | [`TaskType`](engine_src.md#tasktype) |
| `useSocketName` | `boolean` |

#### Defined in

[packages/engine/src/lib/types.ts:308](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L308)

___

### DebuggerArgs

Ƭ **DebuggerArgs**: `Object`

Arguments passed to the `install` function

**`Property`**

Determines if the debug console is run on a local or remote server.

**`Property`**

Function that throws an error

#### Type declaration

| Name | Type |
| :------ | :------ |
| `server?` | `boolean` |
| `throwError?` | (`message`: `unknown`) => `void` |

#### Defined in

[packages/engine/src/lib/plugins/consolePlugin/index.ts:18](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/consolePlugin/index.ts#L18)

___

### Document

Ƭ **Document**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `content?` | `string` |
| `date?` | `string` |
| `embedding?` | `number`[] |
| `id?` | `number` |
| `owner?` | `string` |
| `projectId?` | `string` |
| `type?` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:42](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L42)

___

### EmbeddingData

Ƭ **EmbeddingData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `apiKey` | `string` |
| `input` | `string` |
| `model?` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:564](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L564)

___

### EngineContext

Ƭ **EngineContext**<`DataType`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `DataType` | `Record`<`string`, `unknown`\> |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `completion?` | (`body`: [`CompletionBody`](engine_src.md#completionbody)) => `Promise`<[`CompletionResponse`](engine_src.md#completionresponse)\> |
| `env` | [`Env`](engine_src.md#env) |
| `getSpell` | [`GetSpell`](engine_src.md#getspell) |
| `processCode?` | [`ProcessCode`](engine_src.md#processcode) |
| `runSpell` | [`RunSpell`](engine_src.md#runspell)<`DataType`\> |

#### Defined in

[packages/engine/src/lib/types.ts:195](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L195)

___

### Env

Ƭ **Env**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `API_ROOT_URL` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:156](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L156)

___

### Event

Ƭ **Event**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `agentId?` | `number` \| `string` |
| `channel?` | `string` |
| `channelType?` | `string` |
| `client?` | `string` |
| `content?` | `string` |
| `date?` | `string` |
| `entities?` | `string`[] |
| `id?` | `number` |
| `observer?` | `string` |
| `projectId?` | `string` |
| `sender?` | `string` |
| `type?` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:58](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L58)

___

### EventResponse

Ƭ **EventResponse**: [`Event`](engine_src.md#event)[]

#### Defined in

[packages/engine/src/lib/types.ts:108](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L108)

___

### EventsTypes

Ƭ **EventsTypes**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `connectiondrop` | `Input` \| `Output` |
| `connectionpath` | { `connection`: `Connection` ; `d`: `string` ; `points`: `number`[]  } |
| `connectionpath.connection` | `Connection` |
| `connectionpath.d` | `string` |
| `connectionpath.points` | `number`[] |
| `connectionpick` | `Input` \| `Output` |
| `resetconnection` | `void` |
| `run` | `void` |
| `save` | `void` |

#### Defined in

[packages/engine/src/lib/types.ts:285](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L285)

___

### ExFn

Ƭ **ExFn**: [``true``, `unknown`] \| [``false``, `string`]

#### Defined in

[packages/engine/src/lib/types.ts:474](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L474)

___

### GetDocumentArgs

Ƭ **GetDocumentArgs**: [`Document`](engine_src.md#document) & { `maxCount?`: `number`  }

#### Defined in

[packages/engine/src/lib/types.ts:54](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L54)

___

### GetEventArgs

Ƭ **GetEventArgs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `channel?` | `string` |
| `channelType?` | `string` |
| `client?` | `string` |
| `embedding?` | `number`[] |
| `maxCount?` | `number` |
| `observer?` | `string` |
| `projectId?` | `string` |
| `type?` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:89](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L89)

___

### GetSpell

Ƭ **GetSpell**: (`{
  spellName,
  projectId,
}`: { `projectId`: `string` ; `spellName`: `string`  }) => `Promise`<[`SpellInterface`](engine_src.md#spellinterface)\>

#### Type declaration

▸ (`{
  spellName,
  projectId,
}`): `Promise`<[`SpellInterface`](engine_src.md#spellinterface)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `{
  spellName,
  projectId,
}` | `Object` |
| `{
  spellName,
  projectId,
}.projectId` | `string` |
| `{
  spellName,
  projectId,
}.spellName` | `string` |

##### Returns

`Promise`<[`SpellInterface`](engine_src.md#spellinterface)\>

#### Defined in

[packages/engine/src/lib/types.ts:172](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L172)

___

### GetVectorEventArgs

Ƭ **GetVectorEventArgs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `entities` | `string`[] |
| `maxCount?` | `number` |
| `type` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:102](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L102)

___

### GoFn

Ƭ **GoFn**: [`boolean`, `string` \| ``null``, `unknown`]

#### Defined in

[packages/engine/src/lib/types.ts:467](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L467)

___

### GraphData

Ƭ **GraphData**: `Data`

#### Defined in

[packages/engine/src/lib/types.ts:363](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L363)

___

### Handler

Ƭ **Handler**: (`ctx`: `Koa.Context`) => `any`

#### Type declaration

▸ (`ctx`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `ctx` | `Koa.Context` |

##### Returns

`any`

#### Defined in

[packages/engine/src/lib/types.ts:644](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L644)

___

### IgnoredList

Ƭ **IgnoredList**: { `name`: `string`  }[] \| `string`[]

#### Defined in

[packages/engine/src/lib/types.ts:365](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L365)

___

### ImageCacheResponse

Ƭ **ImageCacheResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `images` | [`ImageType`](engine_src.md#imagetype)[] |

#### Defined in

[packages/engine/src/lib/types.ts:38](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L38)

___

### ImageCompletionSubtype

Ƭ **ImageCompletionSubtype**: ``"text2image"`` \| ``"image2image"`` \| ``"image2text"``

#### Defined in

[packages/engine/src/lib/types.ts:495](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L495)

___

### ImageType

Ƭ **ImageType**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `captionId` | `string` |
| `id` | `string` |
| `imageCaption` | `string` |
| `imageUrl` | `string` |
| `score` | `number` \| `string` |
| `tag` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:29](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L29)

___

### InitEngineArguments

Ƭ **InitEngineArguments**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `components` | [`MagickComponent`](../classes/engine_src.MagickComponent.md)<`unknown`\>[] |
| `name` | `string` |
| `server` | `boolean` |
| `socket?` | `io.Socket` |
| `throwError?` | (`message`: `unknown`) => `void` |

#### Defined in

[packages/engine/src/lib/engine.ts:44](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L44)

___

### InputComponentData

Ƭ **InputComponentData**: [`ComponentData`](engine_src.md#componentdata)<[`TaskType`](engine_src.md#tasktype)\>

#### Defined in

[packages/engine/src/lib/types.ts:378](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L378)

___

### InspectorData

Ƭ **InspectorData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `category?` | `string` |
| `data` | [`WorkerData`](engine_src.md#workerdata) |
| `dataControls` | [`PubSubData`](engine_src.md#pubsubdata) |
| `info` | `string` |
| `name` | `string` |
| `nodeId` | `number` |

#### Defined in

[packages/engine/src/lib/plugins/inspectorPlugin/Inspector.ts:19](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/inspectorPlugin/Inspector.ts#L19)

___

### MagicComponentCategory

Ƭ **MagicComponentCategory**: ``"Esoterica"`` \| ``"Object"`` \| ``"Number"`` \| ``"I/O"`` \| ``"Flow"`` \| ``"Embedding"`` \| ``"Document"`` \| ``"Code"`` \| ``"Boolean"`` \| ``"Array"`` \| ``"Image"`` \| ``"Generation"`` \| ``"Event"`` \| ``"Text"`` \| ``"Utility"`` \| ``" Esoterica"`` \| ``"Ethereum"`` \| ``"Pinecone"`` \| ``"Search"``

#### Defined in

[packages/engine/src/lib/engine.ts:115](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L115)

___

### MagicNodeInput

Ƭ **MagicNodeInput**: `Input` & { `socketType`: [`DataSocketType`](engine_src.md#datasockettype)  }

#### Defined in

[packages/engine/src/lib/types.ts:317](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L317)

___

### MagicNodeOutput

Ƭ **MagicNodeOutput**: `Output` & { `socketType`: [`DataSocketType`](engine_src.md#datasockettype) ; `taskType?`: [`TaskType`](engine_src.md#tasktype)  }

#### Defined in

[packages/engine/src/lib/types.ts:318](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L318)

___

### MagickComponentArray

Ƭ **MagickComponentArray**<`T`\>: `T`[]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`MagickComponent`](../classes/engine_src.MagickComponent.md)<`unknown`\> = `any` |

#### Defined in

[packages/engine/src/lib/engine.ts:184](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L184)

___

### MagickNode

Ƭ **MagickNode**: `Node` & { `category?`: `string` ; `console`: `MagickConsole` ; `data`: [`WorkerData`](engine_src.md#workerdata) ; `display`: (`content`: `string`) => `void` ; `displayName?`: `string` ; `info`: `string` ; `inspector`: `Inspector` ; `outputs`: [`MagicNodeOutput`](engine_src.md#magicnodeoutput)[] ; `subscription`: [`PubSubCallback`](engine_src.md#pubsubcallback)  }

#### Defined in

[packages/engine/src/lib/types.ts:323](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L323)

___

### MagickNodeData

Ƭ **MagickNodeData**: `Object`

#### Index signature

▪ [DataKey: `string`]: `unknown`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `defaultValue?` | `string` |
| `element?` | `number` |
| `isInput?` | `boolean` |
| `name?` | `string` |
| `socketKey?` | `string` |
| `useDefault?` | `boolean` |

#### Defined in

[packages/engine/src/lib/types.ts:398](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L398)

___

### MagickReteInput

Ƭ **MagickReteInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `outputData` | `unknown` |
| `task` | [`MagickTask`](../interfaces/engine_src.MagickTask.md) |
| `type` | [`TaskOutputTypes`](engine_src.md#taskoutputtypes) |

#### Defined in

[packages/engine/src/lib/types.ts:445](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L445)

___

### MagickSpellInput

Ƭ **MagickSpellInput**: `Record`<`string`, `unknown`\>

#### Defined in

[packages/engine/src/lib/types.ts:437](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L437)

___

### MagickSpellOutput

Ƭ **MagickSpellOutput**: `Record`<`string`, `unknown`\>

#### Defined in

[packages/engine/src/lib/types.ts:438](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L438)

___

### MagickWorkerInput

Ƭ **MagickWorkerInput**: `string` \| `unknown` \| [`MagickReteInput`](engine_src.md#magickreteinput)

#### Defined in

[packages/engine/src/lib/types.ts:460](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L460)

___

### MagickWorkerInputs

Ƭ **MagickWorkerInputs**: `Object`

#### Index signature

▪ [key: `string`]: [`MagickWorkerInput`](engine_src.md#magickworkerinput)[]

#### Defined in

[packages/engine/src/lib/types.ts:461](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L461)

___

### MagickWorkerOutputs

Ƭ **MagickWorkerOutputs**: `WorkerOutputs` & { `[key: string]`: [`TaskOutput`](engine_src.md#taskoutput);  }

#### Defined in

[packages/engine/src/lib/types.ts:462](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L462)

___

### MessagingRequest

Ƭ **MessagingRequest**: `unknown`

#### Defined in

[packages/engine/src/lib/types.ts:584](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L584)

___

### MessagingWebhookBody

Ƭ **MessagingWebhookBody**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Body` | `string` |
| `From` | `string` |
| `MessageSid` | `string` |
| `To` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:486](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L486)

___

### Method

Ƭ **Method**: ``"get"`` \| ``"head"`` \| ``"post"`` \| ``"put"`` \| ``"delete"`` \| ``"connect"`` \| ``"options"`` \| ``"trace"`` \| ``"patch"``

#### Defined in

[packages/engine/src/lib/types.ts:632](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L632)

___

### Middleware

Ƭ **Middleware**: (`ctx`: `Koa.Context`, `next`: `any`) => `any`

#### Type declaration

▸ (`ctx`, `next`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `ctx` | `Koa.Context` |
| `next` | `any` |

##### Returns

`any`

#### Defined in

[packages/engine/src/lib/types.ts:630](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L630)

___

### ModelCompletionOpts

Ƭ **ModelCompletionOpts**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bestOf?` | `number` |
| `echo?` | `boolean` |
| `frequencyPenalty?` | `number` |
| `logitBias?` | { `[token: string]`: `number`;  } |
| `logprobs?` | `number` |
| `maxTokens?` | `number` |
| `model?` | `string` |
| `n?` | `number` |
| `presencePenalty?` | `number` |
| `prompt?` | `string` |
| `stop?` | `string` \| `string`[] |
| `stream?` | `boolean` |
| `temperature?` | `number` |
| `topP?` | `number` |
| `user?` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:343](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L343)

___

### Module

Ƭ **Module**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | `Data` |
| `id` | `string` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:435](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L435)

___

### ModuleComponent

Ƭ **ModuleComponent**: [`MagickComponent`](../classes/engine_src.MagickComponent.md)<`unknown`\> & { `run`: (`node`: [`MagickNode`](engine_src.md#magicknode), `data?`: `unknown`) => `Promise`<`void`\>  }

#### Defined in

[packages/engine/src/lib/types.ts:381](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L381)

___

### ModuleContext

Ƭ **ModuleContext**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `agent?` | [`AgentInterface`](engine_src.md#agentinterface) |
| `publicVariables?` | `Record`<`string`, `string`\> |
| `secrets?` | `Record`<`string`, `string`\> |
| `socketInfo` | { `targetNode`: [`MagickNode`](engine_src.md#magicknode) ; `targetSocket`: `string`  } |
| `socketInfo.targetNode` | [`MagickNode`](engine_src.md#magicknode) |
| `socketInfo.targetSocket` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:19](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L19)

___

### ModuleGraphData

Ƭ **ModuleGraphData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `nodes` | `Record`<`string`, [`MagickNode`](engine_src.md#magicknode)\> |

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:36](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L36)

___

### ModulePluginArgs

Ƭ **ModulePluginArgs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `engine` | [`MagickEngine`](../interfaces/engine_src.MagickEngine.md) |
| `modules?` | `Record`<`string`, [`ModuleType`](engine_src.md#moduletype)\> |

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/index.ts:44](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/modulePlugin/index.ts#L44)

___

### ModuleSocketType

Ƭ **ModuleSocketType**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | [`SocketNameType`](engine_src.md#socketnametype) |
| `socket` | `SocketType` |
| `socketKey` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:29](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L29)

___

### ModuleType

Ƭ **ModuleType**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `createdAt` | `string` |
| `data` | [`GraphData`](engine_src.md#graphdata) |
| `id` | `string` |
| `name` | `string` |
| `updatedAt` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:335](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L335)

___

### ModuleWorkerOutput

Ƭ **ModuleWorkerOutput**: `WorkerOutputs`

#### Defined in

[packages/engine/src/lib/types.ts:458](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L458)

___

### NewSpellArgs

Ƭ **NewSpellArgs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `graph` | `Data` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:440](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L440)

___

### NodeConnections

Ƭ **NodeConnections**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | `Record`<`string`, `unknown`\> |
| `input?` | `string` |
| `node` | `number` |
| `output?` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:385](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L385)

___

### NodeOutputs

Ƭ **NodeOutputs**: `Object`

#### Index signature

▪ [outputKey: `string`]: { `connections`: [`NodeConnections`](engine_src.md#nodeconnections)[]  }

#### Defined in

[packages/engine/src/lib/types.ts:392](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L392)

___

### OnDebug

Ƭ **OnDebug**: (`spellname`: `string`, `callback`: [`OnEditorCallback`](engine_src.md#oneditorcallback)) => () => `void`

#### Type declaration

▸ (`spellname`, `callback`): () => `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `spellname` | `string` |
| `callback` | [`OnEditorCallback`](engine_src.md#oneditorcallback) |

##### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/types.ts:260](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L260)

___

### OnEditor

Ƭ **OnEditor**: (`callback`: [`OnEditorCallback`](engine_src.md#oneditorcallback)) => () => `void`

#### Type declaration

▸ (`callback`): () => `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`OnEditorCallback`](engine_src.md#oneditorcallback) |

##### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/types.ts:259](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L259)

___

### OnEditorCallback

Ƭ **OnEditorCallback**: (`data`: [`PubSubData`](engine_src.md#pubsubdata)) => `void`

#### Type declaration

▸ (`data`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`PubSubData`](engine_src.md#pubsubdata) |

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/types.ts:258](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L258)

___

### OnInspector

Ƭ **OnInspector**: (`node`: [`MagickNode`](engine_src.md#magicknode), `callback`: [`OnInspectorCallback`](engine_src.md#oninspectorcallback)) => () => `void`

#### Type declaration

▸ (`node`, `callback`): () => `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`MagickNode`](engine_src.md#magicknode) |
| `callback` | [`OnInspectorCallback`](engine_src.md#oninspectorcallback) |

##### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/types.ts:254](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L254)

___

### OnInspectorCallback

Ƭ **OnInspectorCallback**: (`data`: `Record`<`string`, `unknown`\>) => `void`

#### Type declaration

▸ (`data`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Record`<`string`, `unknown`\> |

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/types.ts:253](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L253)

___

### OnSubspellUpdated

Ƭ **OnSubspellUpdated**: (`spell`: [`SpellInterface`](engine_src.md#spellinterface)) => `void`

#### Type declaration

▸ (`spell`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `spell` | [`SpellInterface`](engine_src.md#spellinterface) |

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/types.ts:133](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L133)

___

### OutputComponentData

Ƭ **OutputComponentData**: [`ComponentData`](engine_src.md#componentdata)<[`TaskType`](engine_src.md#tasktype)\>

#### Defined in

[packages/engine/src/lib/types.ts:379](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L379)

___

### PageLayout

Ƭ **PageLayout**: `LazyExoticComponent`<() => `JSX.Element`\> \| ``null``

#### Defined in

[packages/engine/src/lib/plugin.ts:81](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L81)

___

### PluginClientRoute

Ƭ **PluginClientRoute**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `component` | `FC` |
| `exact?` | `boolean` |
| `path` | `string` |
| `plugin` | `string` |

#### Defined in

[packages/engine/src/lib/plugin.ts:19](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L19)

___

### PluginDrawerItem

Ƭ **PluginDrawerItem**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `icon` | `FC` |
| `path` | `string` |
| `text` | `string` |

#### Defined in

[packages/engine/src/lib/plugin.ts:13](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L13)

___

### PluginIOType

Ƭ **PluginIOType**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `defaultResponseOutput?` | `string` |
| `handler?` | (`{ output, agent, event }`: `any`) => `Promise`<`void`\> |
| `inspectorControls?` | `any`[] |
| `name` | `string` |
| `sockets?` | `any`[] |

#### Defined in

[packages/engine/src/lib/plugin.ts:41](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L41)

___

### PluginSecret

Ƭ **PluginSecret**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `getUrl?` | `string` |
| `global?` | `boolean` |
| `key` | `string` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugin.ts:6](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L6)

___

### PluginServerRoute

Ƭ **PluginServerRoute**: [`Route`](engine_src.md#route)

#### Defined in

[packages/engine/src/lib/plugin.ts:26](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L26)

___

### ProcessCode

Ƭ **ProcessCode**: (`code`: `unknown`, `inputs`: [`MagickWorkerInputs`](engine_src.md#magickworkerinputs), `data`: [`UnknownSpellData`](engine_src.md#unknownspelldata), `language?`: [`SupportedLanguages`](engine_src.md#supportedlanguages)) => `unknown` \| `void`

#### Type declaration

▸ (`code`, `inputs`, `data`, `language?`): `unknown` \| `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `unknown` |
| `inputs` | [`MagickWorkerInputs`](engine_src.md#magickworkerinputs) |
| `data` | [`UnknownSpellData`](engine_src.md#unknownspelldata) |
| `language?` | [`SupportedLanguages`](engine_src.md#supportedlanguages) |

##### Returns

`unknown` \| `void`

#### Defined in

[packages/engine/src/lib/types.ts:180](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L180)

___

### PubSubCallback

Ƭ **PubSubCallback**: (`event`: `string`, `data`: [`PubSubData`](engine_src.md#pubsubdata)) => `void`

#### Type declaration

▸ (`event`, `data`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `data` | [`PubSubData`](engine_src.md#pubsubdata) |

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/types.ts:251](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L251)

___

### PubSubData

Ƭ **PubSubData**: `Record`<`string`, `unknown`\> \| `string` \| `unknown`[]

#### Defined in

[packages/engine/src/lib/types.ts:250](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L250)

___

### PubSubEvents

Ƭ **PubSubEvents**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `$CLOSE_EDITOR` | (`tabId`: `string`) => `string` |
| `$CREATE_CONSOLE` | (`tabId`: `string`) => `string` |
| `$CREATE_DEBUG_CONSOLE` | (`tabId`: `string`) => `string` |
| `$CREATE_INSPECTOR` | (`tabId`: `string`) => `string` |
| `$CREATE_MESSAGE_REACTION_EDITOR` | (`tabId`: `string`) => `string` |
| `$CREATE_PLAYTEST` | (`tabId`: `string`) => `string` |
| `$CREATE_PROJECT_WINDOW` | (`tabId`: `string`) => `string` |
| `$CREATE_TEXT_EDITOR` | (`tabId`: `string`) => `string` |
| `$DEBUG_INPUT` | (`tabId`: `string`) => `string` |
| `$DEBUG_PRINT` | (`tabId`: `string`) => `string` |
| `$DELETE` | (`tabId`: `string`) => `string` |
| `$EXPORT` | (`tabId`: `string`) => `string` |
| `$INSPECTOR_SET` | (`tabId`: `string`) => `string` |
| `$MULTI_SELECT_COPY` | (`tabId`: `string`) => `string` |
| `$MULTI_SELECT_PASTE` | (`tabId`: `string`) => `string` |
| `$NODE_SET` | (`tabId`: `string`, `nodeId`: `number`) => `string` |
| `$PLAYTEST_INPUT` | (`tabId`: `string`) => `string` |
| `$PLAYTEST_PRINT` | (`tabId`: `string`) => `string` |
| `$PROCESS` | (`tabId`: `string`) => `string` |
| `$REDO` | (`tabId`: `string`) => `string` |
| `$REFRESH_EVENT_TABLE` | (`tabId`: `string`) => `string` |
| `$RUN_SPELL` | (`tabId`: `string`) => `string` |
| `$SAVE_SPELL` | (`tabId`: `string`) => `string` |
| `$SAVE_SPELL_DIFF` | (`tabId`: `string`) => `string` |
| `$SUBSPELL_UPDATED` | (`spellName`: `string`) => `string` |
| `$TEXT_EDITOR_CLEAR` | (`tabId`: `string`) => `string` |
| `$TEXT_EDITOR_SET` | (`tabId`: `string`) => `string` |
| `$TRIGGER` | (`tabId`: `string`, `nodeId?`: `number`) => `string` |
| `$UNDO` | (`tabId`: `string`) => `string` |
| `ADD_SUBSPELL` | `string` |
| `DELETE_SUBSPELL` | `string` |
| `OPEN_TAB` | `string` |
| `UPDATE_SUBSPELL` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:203](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L203)

___

### PublishEditorEvent

Ƭ **PublishEditorEvent**: (`data`: [`PubSubData`](engine_src.md#pubsubdata)) => `void`

#### Type declaration

▸ (`data`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`PubSubData`](engine_src.md#pubsubdata) |

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/types.ts:265](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L265)

___

### QAArgs

Ƭ **QAArgs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `agentId` | `string` |
| `question` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:82](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L82)

___

### RequestData

Ƭ **RequestData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `nodeId` | `number` |
| `projectId` | `string` |
| `spell` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:604](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L604)

___

### RequestPayload

Ƭ **RequestPayload**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `hidden?` | `boolean` |
| `model` | `string` |
| `nodeId?` | `number` |
| `parameters?` | `string` |
| `processed?` | `boolean` |
| `projectId` | `string` |
| `provider?` | `string` |
| `requestData` | `string` |
| `responseData?` | `string` |
| `spell?` | [`SpellInterface`](engine_src.md#spellinterface) |
| `startTime` | `number` |
| `status?` | `string` |
| `statusCode?` | `number` |
| `totalTokens?` | `number` |
| `type?` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:586](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L586)

___

### Route

Ƭ **Route**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `del?` | [`Handler`](engine_src.md#handler) |
| `delete?` | [`Handler`](engine_src.md#handler) |
| `get?` | [`Handler`](engine_src.md#handler) |
| `handler?` | [`Handler`](engine_src.md#handler) |
| `head?` | [`Handler`](engine_src.md#handler) |
| `method?` | [`Method`](engine_src.md#method) |
| `middleware?` | [`Middleware`](engine_src.md#middleware)[] |
| `patch?` | [`Handler`](engine_src.md#handler) |
| `path` | `string` |
| `post?` | [`Handler`](engine_src.md#handler) |
| `put?` | [`Handler`](engine_src.md#handler) |

#### Defined in

[packages/engine/src/lib/types.ts:646](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L646)

___

### RunSpell

Ƭ **RunSpell**<`DataType`\>: (`{
  inputs,
  spellId,
  projectId,
  secrets,
  publicVariables,
}`: [`runSpellType`](engine_src.md#runspelltype)<`DataType`\>) => `Promise`<`DataType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `DataType` | `Record`<`string`, `unknown`\> |

#### Type declaration

▸ (`{
  inputs,
  spellId,
  projectId,
  secrets,
  publicVariables,
}`): `Promise`<`DataType`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `{
  inputs,
  spellId,
  projectId,
  secrets,
  publicVariables,
}` | [`runSpellType`](engine_src.md#runspelltype)<`DataType`\> |

##### Returns

`Promise`<`DataType`\>

#### Defined in

[packages/engine/src/lib/types.ts:187](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L187)

___

### RunSpellConstructor

Ƭ **RunSpellConstructor**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `magickInterface` | [`EngineContext`](engine_src.md#enginecontext) |
| `socket?` | `io.Socket` |

#### Defined in

[packages/engine/src/lib/types.ts:662](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L662)

___

### SearchSchema

Ƭ **SearchSchema**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `description` | `string` |
| `title` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:476](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L476)

___

### SemanticSearch

Ƭ **SemanticSearch**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `concept?` | `string` |
| `distance?` | `number` |
| `negative?` | `string` |
| `negative_distance?` | `number` |
| `positive?` | `string` |
| `positive_distance?` | `number` |

#### Defined in

[packages/engine/src/lib/types.ts:73](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L73)

___

### ServerInit

Ƭ **ServerInit**: () => `Promise`<`void`\> \| ``null`` \| `void`

#### Type declaration

▸ (): `Promise`<`void`\> \| ``null`` \| `void`

##### Returns

`Promise`<`void`\> \| ``null`` \| `void`

#### Defined in

[packages/engine/src/lib/plugin.ts:130](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L130)

___

### ServerInits

Ƭ **ServerInits**: `Record`<`string`, [`ServerInit`](engine_src.md#serverinit)\>

#### Defined in

[packages/engine/src/lib/plugin.ts:131](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L131)

___

### SocketData

Ƭ **SocketData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `error?` | { `message`: `string` ; `stack`: `string`  } |
| `error.message` | `string` |
| `error.stack` | `string` |
| `output?` | `unknown` |

#### Defined in

[packages/engine/src/lib/plugins/socketPlugin/index.ts:15](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/socketPlugin/index.ts#L15)

___

### SocketNameType

Ƭ **SocketNameType**: ``"Any"`` \| ``"Number"`` \| ``"Boolean"`` \| ``"Array"`` \| ``"String"`` \| ``"Object"`` \| ``"Trigger"`` \| ``"Event"`` \| ``"Audio"`` \| ``"Embedding"`` \| ``"Document"``

#### Defined in

[packages/engine/src/lib/sockets.ts:8](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/sockets.ts#L8)

___

### SocketPluginArgs

Ƭ **SocketPluginArgs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `client?` | `any` |
| `server?` | `boolean` |
| `socket?` | `io.Socket` |

#### Defined in

[packages/engine/src/lib/plugins/socketPlugin/index.ts:7](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/socketPlugin/index.ts#L7)

___

### SocketType

Ƭ **SocketType**: ``"anySocket"`` \| ``"numberSocket"`` \| ``"booleanSocket"`` \| ``"arraySocket"`` \| ``"stringSocket"`` \| ``"objectSocket"`` \| ``"triggerSocket"`` \| ``"eventSocket"`` \| ``"audioSocket"`` \| ``"embeddingSocket"`` \| ``"documentSocket"``

#### Defined in

[packages/engine/src/lib/sockets.ts:21](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/sockets.ts#L21)

___

### SpellInterface

Ƭ **SpellInterface**: `Static`<typeof [`spellSchema`](engine_src.md#spellschema)\>

The interface for a spell object that's based on the `spellSchema`.

#### Defined in

[packages/engine/src/lib/schemas.ts:34](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/schemas.ts#L34)

___

### Subspell

Ƭ **Subspell**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | [`GraphData`](engine_src.md#graphdata) |
| `id` | `string` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:361](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L361)

___

### SupportedLanguages

Ƭ **SupportedLanguages**: ``"python"`` \| ``"javascript"``

#### Defined in

[packages/engine/src/lib/types.ts:170](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L170)

___

### TaskOptions

Ƭ **TaskOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `init?` | (`task`: [`Task`](../classes/engine_src.Task.md) \| `undefined`, `node`: `NodeData`) => `void` |
| `onRun?` | (`node`: `NodeData`, `task`: [`Task`](../classes/engine_src.Task.md), `data`: `unknown`, `socketInfo`: [`TaskSocketInfo`](engine_src.md#tasksocketinfo)) => `void` |
| `outputs` | `Record`<`string`, `unknown`\> |
| `runOneInput?` | `boolean` |

#### Defined in

[packages/engine/src/lib/plugins/taskPlugin/task.ts:18](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/taskPlugin/task.ts#L18)

___

### TaskOutput

Ƭ **TaskOutput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `task` | [`MagickTask`](../interfaces/engine_src.MagickTask.md) |
| `type` | [`TaskOutputTypes`](engine_src.md#taskoutputtypes) |

#### Defined in

[packages/engine/src/lib/types.ts:452](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L452)

___

### TaskOutputTypes

Ƭ **TaskOutputTypes**: ``"option"`` \| ``"output"``

#### Defined in

[packages/engine/src/lib/plugins/taskPlugin/task.ts:34](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/taskPlugin/task.ts#L34)

___

### TaskSocketInfo

Ƭ **TaskSocketInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `targetNode` | `NodeData` \| ``null`` |
| `targetSocket` | `string` \| ``null`` |

#### Defined in

[packages/engine/src/lib/plugins/taskPlugin/task.ts:13](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/taskPlugin/task.ts#L13)

___

### TaskType

Ƭ **TaskType**: ``"output"`` \| ``"option"``

#### Defined in

[packages/engine/src/lib/types.ts:305](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L305)

___

### TextCompletionData

Ƭ **TextCompletionData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `apiKey?` | `string` |
| `frequency_penalty` | `number` |
| `max_tokens` | `number` |
| `model` | `string` |
| `presence_penalty` | `number` |
| `prompt` | `string` |
| `stop` | `string`[] |
| `temperature` | `number` |
| `top_p` | `number` |

#### Defined in

[packages/engine/src/lib/types.ts:533](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L533)

___

### TextCompletionSubtype

Ƭ **TextCompletionSubtype**: ``"text"`` \| ``"embedding"`` \| ``"chat"``

#### Defined in

[packages/engine/src/lib/types.ts:497](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L497)

___

### UnknownData

Ƭ **UnknownData**: `Record`<`string`, `unknown`\>

#### Defined in

[packages/engine/src/lib/types.ts:160](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L160)

___

### UnknownSpellData

Ƭ **UnknownSpellData**: [`UnknownData`](engine_src.md#unknowndata)

#### Defined in

[packages/engine/src/lib/types.ts:161](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L161)

___

### UpdateModuleSockets

Ƭ **UpdateModuleSockets**: (`node`: [`MagickNode`](engine_src.md#magicknode), `graphData?`: [`GraphData`](engine_src.md#graphdata), `useSocketName?`: `boolean`) => () => `void`

#### Type declaration

▸ (`node`, `graphData?`, `useSocketName?`): () => `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`MagickNode`](engine_src.md#magicknode) |
| `graphData?` | [`GraphData`](engine_src.md#graphdata) |
| `useSocketName?` | `boolean` |

##### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/index.ts:33](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/modulePlugin/index.ts#L33)

___

### UserSpellManager

Ƭ **UserSpellManager**: `Map`<`string`, [`SpellManager`](../classes/engine_src.SpellManager.md)\>

#### Defined in

[packages/engine/src/lib/types.ts:660](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L660)

___

### WorkerData

Ƭ **WorkerData**: `NodeData` & { `[key: string]`: `unknown`; `console?`: `MagickConsole` ; `data?`: [`MagickNodeData`](engine_src.md#magicknodedata) ; `spell?`: `string`  }

#### Defined in

[packages/engine/src/lib/types.ts:408](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L408)

___

### runSpellType

Ƭ **runSpellType**<`DataType`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `DataType` | [`UnknownSpellData`](engine_src.md#unknownspelldata) |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `inputs` | [`MagickSpellInput`](engine_src.md#magickspellinput) |
| `projectId` | `string` |
| `publicVariables` | `DataType` |
| `secrets` | `Record`<`string`, `string`\> |
| `spellId` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:163](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L163)

## Variables

### API\_ROOT\_URL

• `Const` **API\_ROOT\_URL**: `any`

#### Defined in

[packages/engine/src/lib/config.ts:27](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/config.ts#L27)

___

### CachePlugin

• `Const` **CachePlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`MagickEditor`](../classes/engine_src.MagickEditor.md)) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/cachePlugin/index.ts:72](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/cachePlugin/index.ts#L72)

___

### ConsolePlugin

• `Const` **ConsolePlugin**: `Object`

Default export object

**`Property`**

name of the module

**`Property`**

function that installs debug mode in the app

**`Memberof`**

module:consolePlugin

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`IRunContextEditor`](../interfaces/engine_src.IRunContextEditor.md), `[{?`: [`DebuggerArgs`](engine_src.md#debuggerargs)) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/consolePlugin/index.ts:71](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/consolePlugin/index.ts#L71)

___

### DEFAULT\_PROJECT\_ID

• `Const` **DEFAULT\_PROJECT\_ID**: `any`

#### Defined in

[packages/engine/src/lib/config.ts:23](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/config.ts#L23)

___

### DEFAULT\_USER\_ID

• `Const` **DEFAULT\_USER\_ID**: `any`

#### Defined in

[packages/engine/src/lib/config.ts:25](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/config.ts#L25)

___

### ENABLE\_SPEECH\_SERVER

• `Const` **ENABLE\_SPEECH\_SERVER**: `any`

#### Defined in

[packages/engine/src/lib/config.ts:33](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/config.ts#L33)

___

### ErrorPlugin

• `Const` **ErrorPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`engine`: [`IRunContextEditor`](../interfaces/engine_src.IRunContextEditor.md), `__namedParameters`: { `server?`: `boolean` ; `throwError?`: (`error`: `unknown`) => `void`  }) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/errorPlugin/index.ts:36](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/errorPlugin/index.ts#L36)

___

### FILE\_SERVER\_PORT

• `Const` **FILE\_SERVER\_PORT**: `any`

#### Defined in

[packages/engine/src/lib/config.ts:36](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/config.ts#L36)

___

### FILE\_SERVER\_URL

• `Const` **FILE\_SERVER\_URL**: `any`

#### Defined in

[packages/engine/src/lib/config.ts:38](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/config.ts#L38)

___

### GOOGLE\_APPLICATION\_CREDENTIALS

• `Const` **GOOGLE\_APPLICATION\_CREDENTIALS**: `any`

#### Defined in

[packages/engine/src/lib/config.ts:29](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/config.ts#L29)

___

### HistoryPlugin

• `Const` **HistoryPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: `any`, `__namedParameters`: `Object`) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/historyPlugin/index.ts:64](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/historyPlugin/index.ts#L64)

___

### IGNORE\_AUTH

• `Const` **IGNORE\_AUTH**: `boolean`

#### Defined in

[packages/engine/src/lib/config.ts:20](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/config.ts#L20)

___

### InspectorPlugin

• `Const` **InspectorPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`IRunContextEditor`](../interfaces/engine_src.IRunContextEditor.md)) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/inspectorPlugin/index.ts:59](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/inspectorPlugin/index.ts#L59)

___

### KeyCodePlugin

• `Const` **KeyCodePlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`IRunContextEditor`](../interfaces/engine_src.IRunContextEditor.md)) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/keyCodePlugin/index.ts:41](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/keyCodePlugin/index.ts#L41)

___

### LifecyclePlugin

• `Const` **LifecyclePlugin**: `Object`

Lifecycle Plugin

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: `NodeEditor`<`any`\>) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/lifecyclePlugin/index.ts:92](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/lifecyclePlugin/index.ts#L92)

___

### ModulePlugin

• `Const` **ModulePlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`runContext`: [`ModuleIRunContextEditor`](../interfaces/engine_src.ModuleIRunContextEditor.md), `__namedParameters`: [`ModulePluginArgs`](engine_src.md#modulepluginargs)) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/index.ts:286](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/modulePlugin/index.ts#L286)

___

### MultiCopyPlugin

• `Const` **MultiCopyPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`IRunContextEditor`](../interfaces/engine_src.IRunContextEditor.md)) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/multiCopyPlugin/index.ts:164](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/multiCopyPlugin/index.ts#L164)

___

### MultiSocketGenerator

• `Const` **MultiSocketGenerator**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`IRunContextEditor`](../interfaces/engine_src.IRunContextEditor.md)) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/multiSocketGenerator/index.ts:70](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/multiSocketGenerator/index.ts#L70)

___

### NodeClickPlugin

• `Const` **NodeClickPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`IRunContextEditor`](../interfaces/engine_src.IRunContextEditor.md)) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/nodeClickPlugin/index.ts:38](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/nodeClickPlugin/index.ts#L38)

___

### SERVER\_PORT

• `Const` **SERVER\_PORT**: `any`

#### Defined in

[packages/engine/src/lib/config.ts:26](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/config.ts#L26)

___

### SKIP\_DB\_EXTENSIONS

• `Const` **SKIP\_DB\_EXTENSIONS**: `boolean`

#### Defined in

[packages/engine/src/lib/config.ts:21](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/config.ts#L21)

___

### SPEECH\_SERVER\_PORT

• `Const` **SPEECH\_SERVER\_PORT**: `any`

#### Defined in

[packages/engine/src/lib/config.ts:31](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/config.ts#L31)

___

### SelectionPlugin

• **SelectionPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: `NodeEditor`<`any`\>, `params`: `Cfg`) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/selectionPlugin/index.ts:292](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/selectionPlugin/index.ts#L292)

___

### SocketGeneratorPlugin

• `Const` **SocketGeneratorPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`IRunContextEditor`](../interfaces/engine_src.IRunContextEditor.md)) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/socketGenerator/index.ts:71](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/socketGenerator/index.ts#L71)

___

### SocketOverridePlugin

• `Const` **SocketOverridePlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`IRunContextEditor`](../interfaces/engine_src.IRunContextEditor.md)) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/socketOverridePlugin/index.ts:21](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/socketOverridePlugin/index.ts#L21)

___

### SocketPlugin

• `Const` **SocketPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`IRunContextEditor`](../interfaces/engine_src.IRunContextEditor.md), `__namedParameters`: [`SocketPluginArgs`](engine_src.md#socketpluginargs)) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/socketPlugin/index.ts:143](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/socketPlugin/index.ts#L143)

___

### TaskPlugin

• `Const` **TaskPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`MagickEditor`](../classes/engine_src.MagickEditor.md)) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/taskPlugin/index.ts:104](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/taskPlugin/index.ts#L104)

___

### USESSL

• `Const` **USESSL**: `any`

#### Defined in

[packages/engine/src/lib/config.ts:40](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/config.ts#L40)

___

### USSSL\_SPEECH

• `Const` **USSSL\_SPEECH**: `any`

#### Defined in

[packages/engine/src/lib/config.ts:35](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/config.ts#L35)

___

### agentSchema

• `Const` **agentSchema**: `TObject`<{ `data`: `TOptional`<`TAny`\> ; `enabled`: `TOptional`<`TBoolean`\> ; `id`: `TString`<`string`\> ; `name`: `TString`<`string`\> ; `pingedAt`: `TOptional`<`TString`<`string`\>\> ; `projectId`: `TString`<`string`\> ; `publicVariables`: `TOptional`<`TAny`\> ; `rootSpell`: `TOptional`<`TAny`\> ; `secrets`: `TOptional`<`TString`<`string`\>\> ; `spells`: `TOptional`<`TString`<`string`\>\> ; `updatedAt`: `TString`<`string`\>  }\>

Full data model schema for an agent.

**`Property`**

The agent's ID.

**`Property`**

The ID of the project that the agent belongs to.

**`Property`**

The root spell of the agent (optional).

**`Property`**

The name of the agent.

**`Property`**

Whether the agent is enabled or not (optional).

**`Property`**

The date when the agent was last updated.

**`Property`**

The date when the agent was last pinged (optional).

**`Property`**

The spells of the agent (optional).

**`Property`**

The data stored in the agent (optional).

**`Property`**

The public variables of the agent (optional).

**`Property`**

The secrets of the agent (optional).

#### Defined in

[packages/engine/src/lib/schemas.ts:51](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/schemas.ts#L51)

___

### anySocket

• `Const` **anySocket**: `Socket`

#### Defined in

[packages/engine/src/lib/sockets.ts:48](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/sockets.ts#L48)

___

### arraySocket

• `Const` **arraySocket**: `Socket`

#### Defined in

[packages/engine/src/lib/sockets.ts:51](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/sockets.ts#L51)

___

### audioSocket

• `Const` **audioSocket**: `Socket`

#### Defined in

[packages/engine/src/lib/sockets.ts:56](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/sockets.ts#L56)

___

### booleanSocket

• `Const` **booleanSocket**: `Socket`

#### Defined in

[packages/engine/src/lib/sockets.ts:50](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/sockets.ts#L50)

___

### components

• `Const` **components**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `arrayToJSON` | () => `ArrayToJSON` |
| `arrayVariable` | () => `ArrayVariable` |
| `booleanGate` | () => `BooleanGate` |
| `booleanVariable` | () => `BooleanVariable` |
| `cast` | () => `Cast` |
| `combineText` | () => `CombineText` |
| `complexStringMatcher` | () => `ComplexStringMatcher` |
| `composeObject` | () => `ComposeObject` |
| `cosineSimilarity` | () => `CosineSimilarity` |
| `createEmbedding` | () => `CreateTextEmbedding` |
| `destructure` | () => `Destructure` |
| `echo` | () => `Echo` |
| `eventDestructure` | () => `EventDestructureComponent` |
| `eventRecall` | () => `EventRecall` |
| `eventRestructure` | () => `EventRestructureComponent` |
| `eventStore` | () => `EventStore` |
| `eventdelete` | () => `EventDelete` |
| `eventsToConversation` | () => `EventsToConversation` |
| `exclusiveGate` | () => `ExclusiveGate` |
| `getCachedEmbedding` | () => `FindTextEmbedding` |
| `getDocuments` | () => `GetDocuments` |
| `getValueFromArray` | () => `GetValueFromArray` |
| `inRange` | () => `InRange` |
| `inputComponent` | () => `InputComponent` |
| `isNullOrUndefined` | () => `IsNullOrUndefined` |
| `isVariableTrue` | () => `IsVariableTrue` |
| `javascript` | () => `Javascript` |
| `joinListComponent` | () => `JoinListComponent` |
| `jupyterNotebook` | () => `JupyterNotebook` |
| `log` | () => `Log` |
| `logicalOperator` | () => `LogicalOperator` |
| `merge` | () => `Merge` |
| `moduleComponent` | () => `SpellComponent` |
| `numberVariable` | () => `NumberVariable` |
| `objectToJSON` | () => `ObjectToJSON` |
| `orGate` | () => `OrGate` |
| `output` | () => `Output` |
| `parseJSON` | () => `ParseJSON` |
| `profanityFilter` | () => `ProfanityFilter` |
| `promptTemplate` | () => `TextTemplate` |
| `python` | () => `Python` |
| `randomGate` | () => `RandomGate` |
| `remapArray` | () => `RemapArray` |
| `replaceText` | () => `ReplaceText` |
| `request` | () => `Request` |
| `storeDocument` | () => `StoreDocument` |
| `stringEvaluator` | () => `EvaluateText` |
| `stringVariable` | () => `StringVariable` |
| `switchGate` | () => `SwitchGate` |
| `textCompletion` | () => `GenerateText` |
| `textVariable` | () => `TextVariable` |
| `waitForAll` | () => `WaitForAll` |

#### Defined in

[packages/engine/src/lib/nodes/index.ts:58](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/nodes/index.ts#L58)

___

### documentSchema

• `Const` **documentSchema**: `TObject`<{ `content`: `TOptional`<`TString`<`string`\>\> ; `date`: `TOptional`<`TString`<`string`\>\> ; `embedding`: `TOptional`<`TAny`\> ; `id`: `TString`<`string`\> ; `owner`: `TOptional`<`TString`<`string`\>\> ; `projectId`: `TString`<`string`\> ; `type`: `TOptional`<`TString`<`string`\>\>  }\>

Full data model schema for a document.

**`Property`**

The document's ID.

**`Property`**

The type of the document (optional).

**`Property`**

The ID of the document's owner (optional).

**`Property`**

The content of the document (optional).

**`Property`**

The ID of the project that the document belongs to.

**`Property`**

The date when the document was created (optional).

**`Property`**

The embedding data of the document (optional).

#### Defined in

[packages/engine/src/lib/schemas.ts:84](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/schemas.ts#L84)

___

### documentSocket

• `Const` **documentSocket**: `Socket`

#### Defined in

[packages/engine/src/lib/sockets.ts:58](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/sockets.ts#L58)

___

### embeddingSocket

• `Const` **embeddingSocket**: `Socket`

#### Defined in

[packages/engine/src/lib/sockets.ts:57](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/sockets.ts#L57)

___

### eventSocket

• `Const` **eventSocket**: `Socket`

#### Defined in

[packages/engine/src/lib/sockets.ts:55](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/sockets.ts#L55)

___

### globalsManager

• `Const` **globalsManager**: `GlobalsManager`

#### Defined in

[packages/engine/src/lib/globals.ts:38](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/globals.ts#L38)

___

### numberSocket

• `Const` **numberSocket**: `Socket`

#### Defined in

[packages/engine/src/lib/sockets.ts:49](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/sockets.ts#L49)

___

### objectSocket

• `Const` **objectSocket**: `Socket`

#### Defined in

[packages/engine/src/lib/sockets.ts:53](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/sockets.ts#L53)

___

### pluginManager

• `Const` **pluginManager**: [`ClientPluginManager`](../classes/engine_src.ClientPluginManager.md) \| [`ServerPluginManager`](../classes/engine_src.ServerPluginManager.md)

#### Defined in

[packages/engine/src/lib/plugin.ts:468](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L468)

___

### socketNameMap

• `Const` **socketNameMap**: `Record`<[`SocketNameType`](engine_src.md#socketnametype), [`SocketType`](engine_src.md#sockettype)\>

#### Defined in

[packages/engine/src/lib/sockets.ts:34](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/sockets.ts#L34)

___

### spellSchema

• `Const` **spellSchema**: `TObject`<{ `createdAt`: `TOptional`<`TString`<`string`\>\> ; `graph`: `TObject`<{ `id`: `TString`<`string`\> ; `nodes`: `TAny`  }\> ; `hash`: `TString`<`string`\> ; `id`: `TString`<`string`\> ; `name`: `TString`<`string`\> ; `projectId`: `TString`<`string`\> ; `updatedAt`: `TOptional`<`TString`<`string`\>\>  }\>

Full data model schema for a spell.

**`Property`**

The spell's ID.

**`Property`**

The ID of the project that the spell belongs to.

**`Property`**

The name of the spell.

**`Property`**

The hash of the spell.

**`Property`**

The spell's graph object.

**`Property`**

The ID of the spell's graph.

**`Property`**

The nodes of the spell's graph.

**`Property`**

The date when the spell was created (optional).

**`Property`**

The date when the spell was last updated (optional).

#### Defined in

[packages/engine/src/lib/schemas.ts:17](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/schemas.ts#L17)

___

### stringSocket

• `Const` **stringSocket**: `Socket`

#### Defined in

[packages/engine/src/lib/sockets.ts:52](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/sockets.ts#L52)

___

### triggerSocket

• `Const` **triggerSocket**: `Socket`

#### Defined in

[packages/engine/src/lib/sockets.ts:54](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/sockets.ts#L54)

## Functions

### AsDataSocket

▸ **AsDataSocket**(`data`): [`DataSocketType`](engine_src.md#datasockettype)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `InputsData` \| `OutputsData` |

#### Returns

[`DataSocketType`](engine_src.md#datasockettype)[]

#### Defined in

[packages/engine/src/lib/types.ts:417](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L417)

___

### AsInputsAndOutputsData

▸ **AsInputsAndOutputsData**(`data`): `InputsData` & `OutputsData`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`DataSocketType`](engine_src.md#datasockettype)[] |

#### Returns

`InputsData` & `OutputsData`

#### Defined in

[packages/engine/src/lib/types.ts:429](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L429)

___

### AsInputsData

▸ **AsInputsData**(`data`): `InputsData`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`DataSocketType`](engine_src.md#datasockettype)[] |

#### Returns

`InputsData`

#### Defined in

[packages/engine/src/lib/types.ts:421](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L421)

___

### AsOutputsData

▸ **AsOutputsData**(`data`): `OutputsData`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`DataSocketType`](engine_src.md#datasockettype)[] |

#### Returns

`OutputsData`

#### Defined in

[packages/engine/src/lib/types.ts:425](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L425)

___

### configureManager

▸ **configureManager**(): (`app`: { `userSpellManagers?`: [`UserSpellManager`](engine_src.md#userspellmanager)  }) => `void`

#### Returns

`fn`

▸ (`app`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `app` | `Object` |
| `app.userSpellManagers?` | [`UserSpellManager`](engine_src.md#userspellmanager) |

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/spellManager/configureManager.ts:3](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/spellManager/configureManager.ts#L3)

___

### extractModuleInputKeys

▸ **extractModuleInputKeys**(`data`): `string`[]

Extracts all module inputs based upon a given key.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Data` | The data object which contains the GraphData to search inputs for. |

#### Returns

`string`[]

An array containing string values of all input keys found in the GraphData.

#### Defined in

[packages/engine/src/lib/spellManager/graphHelpers.ts:9](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/spellManager/graphHelpers.ts#L9)

___

### extractNodes

▸ **extractNodes**(`nodes`, `map`): `NodeData`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `nodes` | `NodesData` |
| `map` | `Map`<`string`, `unknown`\> \| `Set`<`string`\> |

#### Returns

`NodeData`[]

#### Defined in

[packages/engine/src/lib/engine.ts:89](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L89)

___

### getNodes

▸ **getNodes**(): [`MagickComponent`](../classes/engine_src.MagickComponent.md)<`unknown`\>[]

#### Returns

[`MagickComponent`](../classes/engine_src.MagickComponent.md)<`unknown`\>[]

#### Defined in

[packages/engine/src/lib/nodes/index.ts:124](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/nodes/index.ts#L124)

___

### getTriggeredNode

▸ **getTriggeredNode**(`data`, `socketKey`, `map`): `undefined` \| `NodeData`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Data` |
| `socketKey` | `string` |
| `map` | `Map`<`string`, `unknown`\> \| `Set`<`string`\> |

#### Returns

`undefined` \| `NodeData`

#### Defined in

[packages/engine/src/lib/engine.ts:105](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L105)

___

### initSharedEngine

▸ **initSharedEngine**(`«destructured»`): [`MagickEngine`](../interfaces/engine_src.MagickEngine.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`InitEngineArguments`](engine_src.md#initenginearguments) |

#### Returns

[`MagickEngine`](../interfaces/engine_src.MagickEngine.md)

#### Defined in

[packages/engine/src/lib/engine.ts:52](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L52)

___

### processCode

▸ **processCode**(`code`, `inputs`, `data`, `language?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `code` | `unknown` | `undefined` |
| `inputs` | [`MagickWorkerInputs`](engine_src.md#magickworkerinputs) | `undefined` |
| `data` | [`UnknownData`](engine_src.md#unknowndata) | `undefined` |
| `language` | [`SupportedLanguages`](engine_src.md#supportedlanguages) | `'javascript'` |

#### Returns

`Promise`<`any`\>

#### Defined in

[packages/engine/src/lib/functions/processCode.ts:11](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/functions/processCode.ts#L11)

___

### runPython

▸ **runPython**(`code`, `entry`, `data`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `any` |
| `entry` | `any` |
| `data` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[packages/engine/src/lib/functions/ProcessPython.ts:8](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/functions/ProcessPython.ts#L8)

___

### saveRequest

▸ **saveRequest**(`«destructured»`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`RequestPayload`](engine_src.md#requestpayload) |

#### Returns

`any`

#### Defined in

[packages/engine/src/lib/functions/saveRequest.ts:7](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/functions/saveRequest.ts#L7)
