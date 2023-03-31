---
id: "index"
title: "@magickml/engine"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Classes

- [BooleanControl](classes/BooleanControl.md)
- [ClientPlugin](classes/ClientPlugin.md)
- [ClientPluginManager](classes/ClientPluginManager.md)
- [CodeControl](classes/CodeControl.md)
- [DropdownControl](classes/DropdownControl.md)
- [InputControl](classes/InputControl.md)
- [MagickComponent](classes/MagickComponent.md)
- [MagickEditor](classes/MagickEditor.md)
- [MagickEngineComponent](classes/MagickEngineComponent.md)
- [ModuleManager](classes/ModuleManager.md)
- [NumberControl](classes/NumberControl.md)
- [PlaytestControl](classes/PlaytestControl.md)
- [ServerPlugin](classes/ServerPlugin.md)
- [ServerPluginManager](classes/ServerPluginManager.md)
- [SpellManager](classes/SpellManager.md)
- [SpellRunner](classes/SpellRunner.md)
- [SwitchControl](classes/SwitchControl.md)
- [Task](classes/Task.md)
- [TextInputControl](classes/TextInputControl.md)
- [WorldManager](classes/WorldManager.md)

## Interfaces

- [EditorContext](interfaces/EditorContext.md)
- [IRunContextEditor](interfaces/IRunContextEditor.md)
- [MagickEngine](interfaces/MagickEngine.md)
- [MagickTask](interfaces/MagickTask.md)
- [ModuleIRunContextEditor](interfaces/ModuleIRunContextEditor.md)
- [ModuleOptions](interfaces/ModuleOptions.md)
- [NodeData](interfaces/NodeData.md)
- [PubSubContext](interfaces/PubSubContext.md)

## Type Aliases

### Agent

Ƭ **Agent**: `Static`<typeof [`agentSchema`](#agentschema)\>

The type for an agent object that's based on the `agentSchema`.

#### Defined in

[packages/engine/src/lib/schemas.ts:68](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/schemas.ts#L68)

___

### AgentInterface

Ƭ **AgentInterface**: [`Agent`](#agent)

The interface for an agent object that's based on the `agentSchema`.

#### Defined in

[packages/engine/src/lib/schemas.ts:70](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/schemas.ts#L70)

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

[packages/engine/src/lib/types.ts:613](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L613)

___

### ChatCompletionData

Ƭ **ChatCompletionData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `apiKey?` | `string` |
| `conversationMessages` | [`ChatMessage`](#chatmessage)[] |
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

[packages/engine/src/lib/types.ts:553](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L553)

___

### ChatMessage

Ƭ **ChatMessage**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `content` | `string` |
| `role` | ``"system"`` \| ``"user"`` \| ``"assistant"`` \| `string` |

#### Defined in

[packages/engine/src/lib/types.ts:548](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L548)

___

### ClassifierSchema

Ƭ **ClassifierSchema**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `examples` | `string`[] \| `string` |
| `type` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:484](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L484)

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

[packages/engine/src/lib/types.ts:114](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L114)

___

### CompletionHandlerInputData

Ƭ **CompletionHandlerInputData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `context` | { `currentSpell`: [`SpellInterface`](#spellinterface) ; `magick`: [`EngineContext`](#enginecontext) ; `module`: `any` ; `projectId`: `string` ; `secrets`: `Record`<`string`, `string`\>  } |
| `context.currentSpell` | [`SpellInterface`](#spellinterface) |
| `context.magick` | [`EngineContext`](#enginecontext) |
| `context.module` | `any` |
| `context.projectId` | `string` |
| `context.secrets` | `Record`<`string`, `string`\> |
| `inputs` | [`MagickWorkerInputs`](#magickworkerinputs) |
| `node` | [`NodeData`](interfaces/NodeData.md) |
| `outputs` | [`MagickWorkerOutputs`](#magickworkeroutputs) |

#### Defined in

[packages/engine/src/lib/types.ts:573](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L573)

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

[packages/engine/src/lib/types.ts:513](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L513)

___

### CompletionProvider

Ƭ **CompletionProvider**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `handler?` | (`attrs`: { `context`: `unknown` ; `inputs`: [`MagickWorkerInputs`](#magickworkerinputs) ; `node`: [`WorkerData`](#workerdata) ; `outputs`: [`MagickWorkerOutputs`](#magickworkeroutputs)  }) => { `error`: `string` ; `result`: `string` ; `success`: `boolean`  } |
| `inputs` | [`CompletionSocket`](#completionsocket)[] |
| `inspectorControls?` | [`CompletionInspectorControls`](#completioninspectorcontrols)[] |
| `models` | `string`[] |
| `outputs` | [`CompletionSocket`](#completionsocket)[] |
| `subtype` | [`ImageCompletionSubtype`](#imagecompletionsubtype) \| [`TextCompletionSubtype`](#textcompletionsubtype) |
| `type` | [`CompletionType`](#completiontype) |

#### Defined in

[packages/engine/src/lib/types.ts:521](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L521)

___

### CompletionResponse

Ƭ **CompletionResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `choice` | `any` |
| `success` | `any` |

#### Defined in

[packages/engine/src/lib/types.ts:128](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L128)

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

[packages/engine/src/lib/types.ts:502](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L502)

___

### CompletionType

Ƭ **CompletionType**: ``"image"`` \| ``"text"``

#### Defined in

[packages/engine/src/lib/types.ts:496](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L496)

___

### ComponentData

Ƭ **ComponentData**<`T`\>: `Record`<`string`, `unknown`\> & { `icon?`: `string` ; `ignored?`: [`IgnoredList`](#ignoredlist) ; `socketType?`: [`SocketType`](#sockettype) ; `taskType?`: `T`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`TaskType`](#tasktype) |

#### Defined in

[packages/engine/src/lib/types.ts:374](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L374)

___

### ConnectionType

Ƭ **ConnectionType**: ``"input"`` \| ``"output"``

#### Defined in

[packages/engine/src/lib/types.ts:309](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L309)

___

### CreateDocumentArgs

Ƭ **CreateDocumentArgs**: [`Document`](#document)

#### Defined in

[packages/engine/src/lib/types.ts:56](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L56)

___

### CreateEventArgs

Ƭ **CreateEventArgs**: [`Event`](#event)

#### Defined in

[packages/engine/src/lib/types.ts:91](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L91)

___

### DataSocketType

Ƭ **DataSocketType**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `connectionType` | [`ConnectionType`](#connectiontype) |
| `name` | [`SocketNameType`](#socketnametype) |
| `socketKey` | `string` |
| `socketType` | [`SocketType`](#sockettype) |
| `taskType` | [`TaskType`](#tasktype) |
| `useSocketName` | `boolean` |

#### Defined in

[packages/engine/src/lib/types.ts:311](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L311)

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

[packages/engine/src/lib/plugins/consolePlugin/index.ts:18](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/consolePlugin/index.ts#L18)

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

[packages/engine/src/lib/types.ts:46](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L46)

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

[packages/engine/src/lib/types.ts:567](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L567)

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
| `completion?` | (`body`: [`CompletionBody`](#completionbody)) => `Promise`<[`CompletionResponse`](#completionresponse)\> |
| `getSpell` | [`GetSpell`](#getspell) |
| `processCode?` | [`ProcessCode`](#processcode) |
| `runSpell` | [`RunSpell`](#runspell)<`DataType`\> |

#### Defined in

[packages/engine/src/lib/types.ts:199](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L199)

___

### Env

Ƭ **Env**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `API_ROOT_URL` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:160](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L160)

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

[packages/engine/src/lib/types.ts:62](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L62)

___

### EventResponse

Ƭ **EventResponse**: [`Event`](#event)[]

#### Defined in

[packages/engine/src/lib/types.ts:112](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L112)

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

[packages/engine/src/lib/types.ts:288](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L288)

___

### ExFn

Ƭ **ExFn**: [``true``, `unknown`] \| [``false``, `string`]

#### Defined in

[packages/engine/src/lib/types.ts:477](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L477)

___

### GetDocumentArgs

Ƭ **GetDocumentArgs**: [`Document`](#document) & { `maxCount?`: `number`  }

#### Defined in

[packages/engine/src/lib/types.ts:58](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L58)

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

[packages/engine/src/lib/types.ts:93](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L93)

___

### GetSpell

Ƭ **GetSpell**: (`{
  spellName,
  projectId,
}`: { `projectId`: `string` ; `spellName`: `string`  }) => `Promise`<[`SpellInterface`](#spellinterface)\>

#### Type declaration

▸ (`{
  spellName,
  projectId,
}`): `Promise`<[`SpellInterface`](#spellinterface)\>

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

`Promise`<[`SpellInterface`](#spellinterface)\>

#### Defined in

[packages/engine/src/lib/types.ts:176](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L176)

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

[packages/engine/src/lib/types.ts:106](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L106)

___

### GoFn

Ƭ **GoFn**: [`boolean`, `string` \| ``null``, `unknown`]

#### Defined in

[packages/engine/src/lib/types.ts:470](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L470)

___

### GraphData

Ƭ **GraphData**: `Data`

#### Defined in

[packages/engine/src/lib/types.ts:366](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L366)

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

[packages/engine/src/lib/types.ts:647](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L647)

___

### IgnoredList

Ƭ **IgnoredList**: { `name`: `string`  }[] \| `string`[]

#### Defined in

[packages/engine/src/lib/types.ts:368](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L368)

___

### ImageCacheResponse

Ƭ **ImageCacheResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `images` | [`ImageType`](#imagetype)[] |

#### Defined in

[packages/engine/src/lib/types.ts:42](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L42)

___

### ImageCompletionSubtype

Ƭ **ImageCompletionSubtype**: ``"text2image"`` \| ``"image2image"`` \| ``"image2text"``

#### Defined in

[packages/engine/src/lib/types.ts:498](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L498)

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

[packages/engine/src/lib/types.ts:33](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L33)

___

### InitEngineArguments

Ƭ **InitEngineArguments**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `components` | [`MagickComponent`](classes/MagickComponent.md)<`unknown`\>[] |
| `name` | `string` |
| `server` | `boolean` |
| `socket?` | `io.Socket` |
| `throwError?` | (`message`: `unknown`) => `void` |

#### Defined in

[packages/engine/src/lib/engine.ts:55](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/engine.ts#L55)

___

### InputComponentData

Ƭ **InputComponentData**: [`ComponentData`](#componentdata)<[`TaskType`](#tasktype)\>

#### Defined in

[packages/engine/src/lib/types.ts:381](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L381)

___

### InspectorData

Ƭ **InspectorData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `category?` | `string` |
| `data` | [`WorkerData`](#workerdata) |
| `dataControls` | [`PubSubData`](#pubsubdata) |
| `info` | `string` |
| `name` | `string` |
| `nodeId` | `number` |

#### Defined in

[packages/engine/src/lib/plugins/inspectorPlugin/Inspector.ts:19](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/inspectorPlugin/Inspector.ts#L19)

___

### MagicComponentCategory

Ƭ **MagicComponentCategory**: ``"Esoterica"`` \| ``"Object"`` \| ``"Number"`` \| ``"I/O"`` \| ``"Flow"`` \| ``"Embedding"`` \| ``"Document"`` \| ``"Code"`` \| ``"Boolean"`` \| ``"Array"`` \| ``"Image"`` \| ``"Generation"`` \| ``"Event"`` \| ``"Text"`` \| ``"Utility"`` \| ``" Esoterica"`` \| ``"Ethereum"`` \| ``"Pinecone"`` \| ``"Search"``

#### Defined in

[packages/engine/src/lib/engine.ts:123](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/engine.ts#L123)

___

### MagicNodeInput

Ƭ **MagicNodeInput**: `Input` & { `socketType`: [`DataSocketType`](#datasockettype)  }

#### Defined in

[packages/engine/src/lib/types.ts:320](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L320)

___

### MagicNodeOutput

Ƭ **MagicNodeOutput**: `Output` & { `socketType`: [`DataSocketType`](#datasockettype) ; `taskType?`: [`TaskType`](#tasktype)  }

#### Defined in

[packages/engine/src/lib/types.ts:321](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L321)

___

### MagickComponentArray

Ƭ **MagickComponentArray**<`T`\>: `T`[]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`MagickComponent`](classes/MagickComponent.md)<`unknown`\> = `any` |

#### Defined in

[packages/engine/src/lib/engine.ts:214](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/engine.ts#L214)

___

### MagickNode

Ƭ **MagickNode**: `Node` & { `category?`: `string` ; `console`: `MagickConsole` ; `data`: [`WorkerData`](#workerdata) ; `display`: (`content`: `string`) => `void` ; `displayName?`: `string` ; `info`: `string` ; `inspector`: `Inspector` ; `outputs`: [`MagicNodeOutput`](#magicnodeoutput)[] ; `subscription`: [`PubSubCallback`](#pubsubcallback)  }

#### Defined in

[packages/engine/src/lib/types.ts:326](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L326)

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

[packages/engine/src/lib/types.ts:401](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L401)

___

### MagickReteInput

Ƭ **MagickReteInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `outputData` | `unknown` |
| `task` | [`MagickTask`](interfaces/MagickTask.md) |
| `type` | [`TaskOutputTypes`](#taskoutputtypes) |

#### Defined in

[packages/engine/src/lib/types.ts:448](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L448)

___

### MagickSpellInput

Ƭ **MagickSpellInput**: `Record`<`string`, `unknown`\>

#### Defined in

[packages/engine/src/lib/types.ts:440](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L440)

___

### MagickSpellOutput

Ƭ **MagickSpellOutput**: `Record`<`string`, `unknown`\>

#### Defined in

[packages/engine/src/lib/types.ts:441](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L441)

___

### MagickWorkerInput

Ƭ **MagickWorkerInput**: `string` \| `unknown` \| [`MagickReteInput`](#magickreteinput)

#### Defined in

[packages/engine/src/lib/types.ts:463](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L463)

___

### MagickWorkerInputs

Ƭ **MagickWorkerInputs**: `Object`

#### Index signature

▪ [key: `string`]: [`MagickWorkerInput`](#magickworkerinput)[]

#### Defined in

[packages/engine/src/lib/types.ts:464](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L464)

___

### MagickWorkerOutputs

Ƭ **MagickWorkerOutputs**: `WorkerOutputs` & { `[key: string]`: [`TaskOutput`](#taskoutput);  }

#### Defined in

[packages/engine/src/lib/types.ts:465](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L465)

___

### MessagingRequest

Ƭ **MessagingRequest**: `unknown`

#### Defined in

[packages/engine/src/lib/types.ts:587](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L587)

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

[packages/engine/src/lib/types.ts:489](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L489)

___

### Method

Ƭ **Method**: ``"get"`` \| ``"head"`` \| ``"post"`` \| ``"put"`` \| ``"delete"`` \| ``"connect"`` \| ``"options"`` \| ``"trace"`` \| ``"patch"``

#### Defined in

[packages/engine/src/lib/types.ts:635](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L635)

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

[packages/engine/src/lib/types.ts:633](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L633)

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

[packages/engine/src/lib/types.ts:346](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L346)

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

[packages/engine/src/lib/types.ts:438](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L438)

___

### ModuleComponent

Ƭ **ModuleComponent**: [`MagickComponent`](classes/MagickComponent.md)<`unknown`\> & { `run`: (`node`: [`MagickNode`](#magicknode), `data?`: `unknown`) => `Promise`<`void`\>  }

#### Defined in

[packages/engine/src/lib/types.ts:384](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L384)

___

### ModuleContext

Ƭ **ModuleContext**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `agent?` | [`AgentInterface`](#agentinterface) |
| `publicVariables?` | `Record`<`string`, `string`\> |
| `secrets?` | `Record`<`string`, `string`\> |
| `socketInfo` | { `targetNode`: [`MagickNode`](#magicknode) ; `targetSocket`: `string`  } |
| `socketInfo.targetNode` | [`MagickNode`](#magicknode) |
| `socketInfo.targetSocket` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:19](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L19)

___

### ModuleGraphData

Ƭ **ModuleGraphData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `nodes` | `Record`<`string`, [`MagickNode`](#magicknode)\> |

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:36](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L36)

___

### ModulePluginArgs

Ƭ **ModulePluginArgs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `engine` | [`MagickEngine`](interfaces/MagickEngine.md) |
| `modules?` | `Record`<`string`, [`ModuleType`](#moduletype)\> |

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/index.ts:44](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/modulePlugin/index.ts#L44)

___

### ModuleSocketType

Ƭ **ModuleSocketType**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | [`SocketNameType`](#socketnametype) |
| `socket` | `SocketType` |
| `socketKey` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:29](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L29)

___

### ModuleType

Ƭ **ModuleType**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `createdAt` | `string` |
| `data` | [`GraphData`](#graphdata) |
| `id` | `string` |
| `name` | `string` |
| `updatedAt` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:338](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L338)

___

### ModuleWorkerOutput

Ƭ **ModuleWorkerOutput**: `WorkerOutputs`

#### Defined in

[packages/engine/src/lib/types.ts:461](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L461)

___

### NewSpellArgs

Ƭ **NewSpellArgs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `graph` | `Data` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:443](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L443)

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

[packages/engine/src/lib/types.ts:388](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L388)

___

### NodeOutputs

Ƭ **NodeOutputs**: `Object`

#### Index signature

▪ [outputKey: `string`]: { `connections`: [`NodeConnections`](#nodeconnections)[]  }

#### Defined in

[packages/engine/src/lib/types.ts:395](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L395)

___

### OnDebug

Ƭ **OnDebug**: (`spellname`: `string`, `callback`: [`OnEditorCallback`](#oneditorcallback)) => () => `void`

#### Type declaration

▸ (`spellname`, `callback`): () => `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `spellname` | `string` |
| `callback` | [`OnEditorCallback`](#oneditorcallback) |

##### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/types.ts:263](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L263)

___

### OnEditor

Ƭ **OnEditor**: (`callback`: [`OnEditorCallback`](#oneditorcallback)) => () => `void`

#### Type declaration

▸ (`callback`): () => `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`OnEditorCallback`](#oneditorcallback) |

##### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/types.ts:262](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L262)

___

### OnEditorCallback

Ƭ **OnEditorCallback**: (`data`: [`PubSubData`](#pubsubdata)) => `void`

#### Type declaration

▸ (`data`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`PubSubData`](#pubsubdata) |

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/types.ts:261](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L261)

___

### OnInspector

Ƭ **OnInspector**: (`node`: [`MagickNode`](#magicknode), `callback`: [`OnInspectorCallback`](#oninspectorcallback)) => () => `void`

#### Type declaration

▸ (`node`, `callback`): () => `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`MagickNode`](#magicknode) |
| `callback` | [`OnInspectorCallback`](#oninspectorcallback) |

##### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/types.ts:257](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L257)

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

[packages/engine/src/lib/types.ts:256](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L256)

___

### OnSubspellUpdated

Ƭ **OnSubspellUpdated**: (`spell`: [`SpellInterface`](#spellinterface)) => `void`

#### Type declaration

▸ (`spell`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `spell` | [`SpellInterface`](#spellinterface) |

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/types.ts:137](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L137)

___

### OutputComponentData

Ƭ **OutputComponentData**: [`ComponentData`](#componentdata)<[`TaskType`](#tasktype)\>

#### Defined in

[packages/engine/src/lib/types.ts:382](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L382)

___

### PageLayout

Ƭ **PageLayout**: `LazyExoticComponent`<() => `JSX.Element`\> \| ``null``

#### Defined in

[packages/engine/src/lib/plugin.ts:81](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugin.ts#L81)

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

[packages/engine/src/lib/plugin.ts:19](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugin.ts#L19)

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

[packages/engine/src/lib/plugin.ts:13](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugin.ts#L13)

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

[packages/engine/src/lib/plugin.ts:41](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugin.ts#L41)

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

[packages/engine/src/lib/plugin.ts:6](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugin.ts#L6)

___

### PluginServerRoute

Ƭ **PluginServerRoute**: [`Route`](#route)

#### Defined in

[packages/engine/src/lib/plugin.ts:26](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugin.ts#L26)

___

### ProcessCode

Ƭ **ProcessCode**: (`code`: `unknown`, `inputs`: [`MagickWorkerInputs`](#magickworkerinputs), `data`: [`UnknownSpellData`](#unknownspelldata), `language?`: [`SupportedLanguages`](#supportedlanguages)) => `unknown` \| `void`

#### Type declaration

▸ (`code`, `inputs`, `data`, `language?`): `unknown` \| `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `unknown` |
| `inputs` | [`MagickWorkerInputs`](#magickworkerinputs) |
| `data` | [`UnknownSpellData`](#unknownspelldata) |
| `language?` | [`SupportedLanguages`](#supportedlanguages) |

##### Returns

`unknown` \| `void`

#### Defined in

[packages/engine/src/lib/types.ts:184](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L184)

___

### PubSubCallback

Ƭ **PubSubCallback**: (`event`: `string`, `data`: [`PubSubData`](#pubsubdata)) => `void`

#### Type declaration

▸ (`event`, `data`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `data` | [`PubSubData`](#pubsubdata) |

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/types.ts:254](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L254)

___

### PubSubData

Ƭ **PubSubData**: `Record`<`string`, `unknown`\> \| `string` \| `unknown`[]

#### Defined in

[packages/engine/src/lib/types.ts:253](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L253)

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

[packages/engine/src/lib/types.ts:206](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L206)

___

### PublishEditorEvent

Ƭ **PublishEditorEvent**: (`data`: [`PubSubData`](#pubsubdata)) => `void`

#### Type declaration

▸ (`data`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`PubSubData`](#pubsubdata) |

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/types.ts:268](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L268)

___

### QAArgs

Ƭ **QAArgs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `agentId` | `string` |
| `question` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:86](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L86)

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

[packages/engine/src/lib/types.ts:607](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L607)

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
| `spell?` | [`SpellInterface`](#spellinterface) |
| `startTime` | `number` |
| `status?` | `string` |
| `statusCode?` | `number` |
| `totalTokens?` | `number` |
| `type?` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:589](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L589)

___

### Route

Ƭ **Route**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `del?` | [`Handler`](#handler) |
| `delete?` | [`Handler`](#handler) |
| `get?` | [`Handler`](#handler) |
| `handler?` | [`Handler`](#handler) |
| `head?` | [`Handler`](#handler) |
| `method?` | [`Method`](#method) |
| `middleware?` | [`Middleware`](#middleware)[] |
| `patch?` | [`Handler`](#handler) |
| `path` | `string` |
| `post?` | [`Handler`](#handler) |
| `put?` | [`Handler`](#handler) |

#### Defined in

[packages/engine/src/lib/types.ts:649](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L649)

___

### RunSpell

Ƭ **RunSpell**<`DataType`\>: (`{
  inputs,
  spellId,
  projectId,
  secrets,
  publicVariables,
}`: [`runSpellType`](#runspelltype)<`DataType`\>) => `Promise`<`DataType`\>

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
}` | [`runSpellType`](#runspelltype)<`DataType`\> |

##### Returns

`Promise`<`DataType`\>

#### Defined in

[packages/engine/src/lib/types.ts:191](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L191)

___

### RunSpellConstructor

Ƭ **RunSpellConstructor**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `magickInterface` | [`EngineContext`](#enginecontext) |
| `socket?` | `io.Socket` |

#### Defined in

[packages/engine/src/lib/types.ts:665](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L665)

___

### SearchSchema

Ƭ **SearchSchema**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `description` | `string` |
| `title` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:479](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L479)

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

[packages/engine/src/lib/types.ts:77](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L77)

___

### ServerInit

Ƭ **ServerInit**: () => `Promise`<`void`\> \| ``null`` \| `void`

#### Type declaration

▸ (): `Promise`<`void`\> \| ``null`` \| `void`

##### Returns

`Promise`<`void`\> \| ``null`` \| `void`

#### Defined in

[packages/engine/src/lib/plugin.ts:130](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugin.ts#L130)

___

### ServerInits

Ƭ **ServerInits**: `Record`<`string`, [`ServerInit`](#serverinit)\>

#### Defined in

[packages/engine/src/lib/plugin.ts:131](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugin.ts#L131)

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

[packages/engine/src/lib/plugins/socketPlugin/index.ts:15](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/socketPlugin/index.ts#L15)

___

### SocketNameType

Ƭ **SocketNameType**: ``"Any"`` \| ``"Number"`` \| ``"Boolean"`` \| ``"Array"`` \| ``"String"`` \| ``"Object"`` \| ``"Trigger"`` \| ``"Event"`` \| ``"Audio"`` \| ``"Embedding"`` \| ``"Document"``

#### Defined in

[packages/engine/src/lib/sockets.ts:8](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/sockets.ts#L8)

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

[packages/engine/src/lib/plugins/socketPlugin/index.ts:7](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/socketPlugin/index.ts#L7)

___

### SocketType

Ƭ **SocketType**: ``"anySocket"`` \| ``"numberSocket"`` \| ``"booleanSocket"`` \| ``"arraySocket"`` \| ``"stringSocket"`` \| ``"objectSocket"`` \| ``"triggerSocket"`` \| ``"eventSocket"`` \| ``"audioSocket"`` \| ``"embeddingSocket"`` \| ``"documentSocket"``

#### Defined in

[packages/engine/src/lib/sockets.ts:21](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/sockets.ts#L21)

___

### SpellInterface

Ƭ **SpellInterface**: `Static`<typeof [`spellSchema`](#spellschema)\>

The interface for a spell object that's based on the `spellSchema`.

#### Defined in

[packages/engine/src/lib/schemas.ts:34](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/schemas.ts#L34)

___

### Subspell

Ƭ **Subspell**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | [`GraphData`](#graphdata) |
| `id` | `string` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:364](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L364)

___

### SupportedLanguages

Ƭ **SupportedLanguages**: ``"python"`` \| ``"javascript"``

#### Defined in

[packages/engine/src/lib/types.ts:174](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L174)

___

### TaskOptions

Ƭ **TaskOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `init?` | (`task`: [`Task`](classes/Task.md) \| `undefined`, `node`: [`NodeData`](interfaces/NodeData.md)) => `void` |
| `onRun?` | (`node`: [`NodeData`](interfaces/NodeData.md), `task`: [`Task`](classes/Task.md), `data`: `unknown`, `socketInfo`: [`TaskSocketInfo`](#tasksocketinfo)) => `void` |
| `outputs` | `Record`<`string`, `unknown`\> |
| `runOneInput?` | `boolean` |

#### Defined in

[packages/engine/src/lib/plugins/taskPlugin/task.ts:18](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/taskPlugin/task.ts#L18)

___

### TaskOutput

Ƭ **TaskOutput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `task` | [`MagickTask`](interfaces/MagickTask.md) |
| `type` | [`TaskOutputTypes`](#taskoutputtypes) |

#### Defined in

[packages/engine/src/lib/types.ts:455](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L455)

___

### TaskOutputTypes

Ƭ **TaskOutputTypes**: ``"option"`` \| ``"output"``

#### Defined in

[packages/engine/src/lib/plugins/taskPlugin/task.ts:34](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/taskPlugin/task.ts#L34)

___

### TaskSocketInfo

Ƭ **TaskSocketInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `targetNode` | [`NodeData`](interfaces/NodeData.md) \| ``null`` |
| `targetSocket` | `string` \| ``null`` |

#### Defined in

[packages/engine/src/lib/plugins/taskPlugin/task.ts:13](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/taskPlugin/task.ts#L13)

___

### TaskType

Ƭ **TaskType**: ``"output"`` \| ``"option"``

#### Defined in

[packages/engine/src/lib/types.ts:308](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L308)

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

[packages/engine/src/lib/types.ts:536](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L536)

___

### TextCompletionSubtype

Ƭ **TextCompletionSubtype**: ``"text"`` \| ``"embedding"`` \| ``"chat"``

#### Defined in

[packages/engine/src/lib/types.ts:500](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L500)

___

### UnknownData

Ƭ **UnknownData**: `Record`<`string`, `unknown`\>

#### Defined in

[packages/engine/src/lib/types.ts:164](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L164)

___

### UnknownSpellData

Ƭ **UnknownSpellData**: [`UnknownData`](#unknowndata)

#### Defined in

[packages/engine/src/lib/types.ts:165](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L165)

___

### UpdateModuleSockets

Ƭ **UpdateModuleSockets**: (`node`: [`MagickNode`](#magicknode), `graphData?`: [`GraphData`](#graphdata), `useSocketName?`: `boolean`) => () => `void`

#### Type declaration

▸ (`node`, `graphData?`, `useSocketName?`): () => `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`MagickNode`](#magicknode) |
| `graphData?` | [`GraphData`](#graphdata) |
| `useSocketName?` | `boolean` |

##### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/index.ts:33](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/modulePlugin/index.ts#L33)

___

### UserSpellManager

Ƭ **UserSpellManager**: `Map`<`string`, [`SpellManager`](classes/SpellManager.md)\>

#### Defined in

[packages/engine/src/lib/types.ts:663](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L663)

___

### WorkerData

Ƭ **WorkerData**: [`NodeData`](interfaces/NodeData.md) & { `[key: string]`: `unknown`; `console?`: `MagickConsole` ; `data?`: [`MagickNodeData`](#magicknodedata) ; `spell?`: `string`  }

#### Defined in

[packages/engine/src/lib/types.ts:411](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L411)

___

### runSpellType

Ƭ **runSpellType**<`DataType`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `DataType` | [`UnknownSpellData`](#unknownspelldata) |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `inputs` | [`MagickSpellInput`](#magickspellinput) |
| `projectId` | `string` |
| `publicVariables` | `DataType` |
| `secrets` | `Record`<`string`, `string`\> |
| `spellId` | `string` |

#### Defined in

[packages/engine/src/lib/types.ts:167](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L167)

## Variables

### API\_ROOT\_URL

• `Const` **API\_ROOT\_URL**: `string`

#### Defined in

[packages/engine/src/lib/config.ts:37](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/config.ts#L37)

___

### CachePlugin

• `Const` **CachePlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`MagickEditor`](classes/MagickEditor.md)) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/cachePlugin/index.ts:72](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/cachePlugin/index.ts#L72)

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
| `install` | (`editor`: [`IRunContextEditor`](interfaces/IRunContextEditor.md), `[{?`: [`DebuggerArgs`](#debuggerargs)) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/consolePlugin/index.ts:71](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/consolePlugin/index.ts#L71)

___

### DEFAULT\_PROJECT\_ID

• `Const` **DEFAULT\_PROJECT\_ID**: `string`

#### Defined in

[packages/engine/src/lib/config.ts:31](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/config.ts#L31)

___

### DEFAULT\_USER\_ID

• `Const` **DEFAULT\_USER\_ID**: `string`

#### Defined in

[packages/engine/src/lib/config.ts:32](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/config.ts#L32)

___

### ENABLE\_SPEECH\_SERVER

• `Const` **ENABLE\_SPEECH\_SERVER**: `string` \| ``true``

#### Defined in

[packages/engine/src/lib/config.ts:40](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/config.ts#L40)

___

### ErrorPlugin

• `Const` **ErrorPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`engine`: [`IRunContextEditor`](interfaces/IRunContextEditor.md), `__namedParameters`: { `server?`: `boolean` ; `throwError?`: (`error`: `unknown`) => `void`  }) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/errorPlugin/index.ts:36](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/errorPlugin/index.ts#L36)

___

### FILE\_SERVER\_PORT

• `Const` **FILE\_SERVER\_PORT**: `string` \| ``65530``

#### Defined in

[packages/engine/src/lib/config.ts:42](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/config.ts#L42)

___

### FILE\_SERVER\_URL

• `Const` **FILE\_SERVER\_URL**: `string`

#### Defined in

[packages/engine/src/lib/config.ts:43](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/config.ts#L43)

___

### GOOGLE\_APPLICATION\_CREDENTIALS

• `Const` **GOOGLE\_APPLICATION\_CREDENTIALS**: `any`

#### Defined in

[packages/engine/src/lib/config.ts:38](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/config.ts#L38)

___

### HistoryPlugin

• `Const` **HistoryPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: `any`, `__namedParameters`: `Object`) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/historyPlugin/index.ts:64](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/historyPlugin/index.ts#L64)

___

### IGNORE\_AUTH

• `Const` **IGNORE\_AUTH**: `boolean`

#### Defined in

[packages/engine/src/lib/config.ts:29](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/config.ts#L29)

___

### InspectorPlugin

• `Const` **InspectorPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`IRunContextEditor`](interfaces/IRunContextEditor.md)) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/inspectorPlugin/index.ts:59](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/inspectorPlugin/index.ts#L59)

___

### KeyCodePlugin

• `Const` **KeyCodePlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`IRunContextEditor`](interfaces/IRunContextEditor.md)) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/keyCodePlugin/index.ts:41](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/keyCodePlugin/index.ts#L41)

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

[packages/engine/src/lib/plugins/lifecyclePlugin/index.ts:92](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/lifecyclePlugin/index.ts#L92)

___

### ModulePlugin

• `Const` **ModulePlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`runContext`: [`ModuleIRunContextEditor`](interfaces/ModuleIRunContextEditor.md), `__namedParameters`: [`ModulePluginArgs`](#modulepluginargs)) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/index.ts:286](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/modulePlugin/index.ts#L286)

___

### MultiCopyPlugin

• `Const` **MultiCopyPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`IRunContextEditor`](interfaces/IRunContextEditor.md)) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/multiCopyPlugin/index.ts:164](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/multiCopyPlugin/index.ts#L164)

___

### MultiSocketGenerator

• `Const` **MultiSocketGenerator**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`IRunContextEditor`](interfaces/IRunContextEditor.md)) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/multiSocketGenerator/index.ts:70](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/multiSocketGenerator/index.ts#L70)

___

### NODE\_ENV

• `Const` **NODE\_ENV**: `string`

#### Defined in

[packages/engine/src/lib/config.ts:45](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/config.ts#L45)

___

### NodeClickPlugin

• `Const` **NodeClickPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`IRunContextEditor`](interfaces/IRunContextEditor.md)) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/nodeClickPlugin/index.ts:38](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/nodeClickPlugin/index.ts#L38)

___

### SERVER\_PORT

• `Const` **SERVER\_PORT**: `string` \| ``3030``

#### Defined in

[packages/engine/src/lib/config.ts:33](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/config.ts#L33)

___

### SKIP\_DB\_EXTENSIONS

• `Const` **SKIP\_DB\_EXTENSIONS**: `boolean`

#### Defined in

[packages/engine/src/lib/config.ts:30](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/config.ts#L30)

___

### SPEECH\_SERVER\_PORT

• `Const` **SPEECH\_SERVER\_PORT**: `string` \| ``65532``

#### Defined in

[packages/engine/src/lib/config.ts:39](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/config.ts#L39)

___

### SPEECH\_SERVER\_URL

• `Const` **SPEECH\_SERVER\_URL**: `string`

#### Defined in

[packages/engine/src/lib/config.ts:34](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/config.ts#L34)

___

### SelectionPlugin

• **SelectionPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: `NodeEditor`<`any`\>, `params`: `Cfg`) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/selectionPlugin/index.ts:292](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/selectionPlugin/index.ts#L292)

___

### SocketGeneratorPlugin

• `Const` **SocketGeneratorPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`IRunContextEditor`](interfaces/IRunContextEditor.md)) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/socketGenerator/index.ts:71](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/socketGenerator/index.ts#L71)

___

### SocketOverridePlugin

• `Const` **SocketOverridePlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`IRunContextEditor`](interfaces/IRunContextEditor.md)) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/socketOverridePlugin/index.ts:21](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/socketOverridePlugin/index.ts#L21)

___

### SocketPlugin

• `Const` **SocketPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`IRunContextEditor`](interfaces/IRunContextEditor.md), `__namedParameters`: [`SocketPluginArgs`](#socketpluginargs)) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/socketPlugin/index.ts:143](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/socketPlugin/index.ts#L143)

___

### TRUSTED\_PARENT\_URL

• `Const` **TRUSTED\_PARENT\_URL**: `string`

#### Defined in

[packages/engine/src/lib/config.ts:35](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/config.ts#L35)

___

### TaskPlugin

• `Const` **TaskPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`MagickEditor`](classes/MagickEditor.md)) => `void` |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/plugins/taskPlugin/index.ts:104](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugins/taskPlugin/index.ts#L104)

___

### UNTRUSTED\_IFRAME

• `Const` **UNTRUSTED\_IFRAME**: `string` \| ``false``

#### Defined in

[packages/engine/src/lib/config.ts:36](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/config.ts#L36)

___

### USESSL

• `Const` **USESSL**: `string` \| ``false``

#### Defined in

[packages/engine/src/lib/config.ts:44](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/config.ts#L44)

___

### USSSL\_SPEECH

• `Const` **USSSL\_SPEECH**: `string` \| ``true``

#### Defined in

[packages/engine/src/lib/config.ts:41](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/config.ts#L41)

___

### agentSchema

• `Const` **agentSchema**: `TObject`<{ `data`: `TOptional`<`TAny`\> ; `enabled`: `TOptional`<`TBoolean`\> ; `id`: `TString`<`string`\> ; `name`: `TString`<`string`\> ; `pingedAt`: `TOptional`<`TString`<`string`\>\> ; `projectId`: `TString`<`string`\> ; `publicVariables`: `TOptional`<`TAny`\> ; `rootSpell`: `TOptional`<`TAny`\> ; `secrets`: `TOptional`<`TString`<`string`\>\> ; `updatedAt`: `TString`<`string`\>  }\>

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

[packages/engine/src/lib/schemas.ts:51](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/schemas.ts#L51)

___

### anySocket

• `Const` **anySocket**: `Socket`

#### Defined in

[packages/engine/src/lib/sockets.ts:48](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/sockets.ts#L48)

___

### arraySocket

• `Const` **arraySocket**: `Socket`

#### Defined in

[packages/engine/src/lib/sockets.ts:51](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/sockets.ts#L51)

___

### audioSocket

• `Const` **audioSocket**: `Socket`

#### Defined in

[packages/engine/src/lib/sockets.ts:56](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/sockets.ts#L56)

___

### booleanSocket

• `Const` **booleanSocket**: `Socket`

#### Defined in

[packages/engine/src/lib/sockets.ts:50](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/sockets.ts#L50)

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

[packages/engine/src/lib/nodes/index.ts:57](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/nodes/index.ts#L57)

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

[packages/engine/src/lib/schemas.ts:83](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/schemas.ts#L83)

___

### documentSocket

• `Const` **documentSocket**: `Socket`

#### Defined in

[packages/engine/src/lib/sockets.ts:58](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/sockets.ts#L58)

___

### embeddingSocket

• `Const` **embeddingSocket**: `Socket`

#### Defined in

[packages/engine/src/lib/sockets.ts:57](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/sockets.ts#L57)

___

### eventSocket

• `Const` **eventSocket**: `Socket`

#### Defined in

[packages/engine/src/lib/sockets.ts:55](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/sockets.ts#L55)

___

### globalsManager

• `Const` **globalsManager**: `GlobalsManager`

#### Defined in

[packages/engine/src/lib/globals.ts:38](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/globals.ts#L38)

___

### numberSocket

• `Const` **numberSocket**: `Socket`

#### Defined in

[packages/engine/src/lib/sockets.ts:49](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/sockets.ts#L49)

___

### objectSocket

• `Const` **objectSocket**: `Socket`

#### Defined in

[packages/engine/src/lib/sockets.ts:53](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/sockets.ts#L53)

___

### pluginManager

• `Const` **pluginManager**: [`ClientPluginManager`](classes/ClientPluginManager.md) \| [`ServerPluginManager`](classes/ServerPluginManager.md)

#### Defined in

[packages/engine/src/lib/plugin.ts:468](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/plugin.ts#L468)

___

### socketNameMap

• `Const` **socketNameMap**: `Record`<[`SocketNameType`](#socketnametype), [`SocketType`](#sockettype)\>

#### Defined in

[packages/engine/src/lib/sockets.ts:34](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/sockets.ts#L34)

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

[packages/engine/src/lib/schemas.ts:17](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/schemas.ts#L17)

___

### stringSocket

• `Const` **stringSocket**: `Socket`

#### Defined in

[packages/engine/src/lib/sockets.ts:52](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/sockets.ts#L52)

___

### triggerSocket

• `Const` **triggerSocket**: `Socket`

#### Defined in

[packages/engine/src/lib/sockets.ts:54](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/sockets.ts#L54)

## Functions

### AsDataSocket

▸ **AsDataSocket**(`data`): [`DataSocketType`](#datasockettype)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `InputsData` \| `OutputsData` |

#### Returns

[`DataSocketType`](#datasockettype)[]

#### Defined in

[packages/engine/src/lib/types.ts:420](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L420)

___

### AsInputsAndOutputsData

▸ **AsInputsAndOutputsData**(`data`): `InputsData` & `OutputsData`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`DataSocketType`](#datasockettype)[] |

#### Returns

`InputsData` & `OutputsData`

#### Defined in

[packages/engine/src/lib/types.ts:432](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L432)

___

### AsInputsData

▸ **AsInputsData**(`data`): `InputsData`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`DataSocketType`](#datasockettype)[] |

#### Returns

`InputsData`

#### Defined in

[packages/engine/src/lib/types.ts:424](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L424)

___

### AsOutputsData

▸ **AsOutputsData**(`data`): `OutputsData`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`DataSocketType`](#datasockettype)[] |

#### Returns

`OutputsData`

#### Defined in

[packages/engine/src/lib/types.ts:428](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L428)

___

### configureManager

▸ **configureManager**(): (`app`: { `userSpellManagers?`: [`UserSpellManager`](#userspellmanager)  }) => `void`

#### Returns

`fn`

▸ (`app`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `app` | `Object` |
| `app.userSpellManagers?` | [`UserSpellManager`](#userspellmanager) |

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/spellManager/configureManager.ts:3](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/spellManager/configureManager.ts#L3)

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

[packages/engine/src/lib/spellManager/graphHelpers.ts:9](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/spellManager/graphHelpers.ts#L9)

___

### extractNodes

▸ **extractNodes**(`nodes`, `map`): [`NodeData`](interfaces/NodeData.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `nodes` | `NodesData` |
| `map` | `Map`<`string`, `unknown`\> \| `Set`<`string`\> |

#### Returns

[`NodeData`](interfaces/NodeData.md)[]

#### Defined in

[packages/engine/src/lib/engine.ts:100](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/engine.ts#L100)

___

### getNodes

▸ **getNodes**(): [`MagickComponent`](classes/MagickComponent.md)<`unknown`\>[]

#### Returns

[`MagickComponent`](classes/MagickComponent.md)<`unknown`\>[]

#### Defined in

[packages/engine/src/lib/nodes/index.ts:122](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/nodes/index.ts#L122)

___

### getTriggeredNode

▸ **getTriggeredNode**(`data`, `socketKey`, `map`): `undefined` \| [`NodeData`](interfaces/NodeData.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Data` |
| `socketKey` | `string` |
| `map` | `Map`<`string`, `unknown`\> \| `Set`<`string`\> |

#### Returns

`undefined` \| [`NodeData`](interfaces/NodeData.md)

#### Defined in

[packages/engine/src/lib/engine.ts:113](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/engine.ts#L113)

___

### initSharedEngine

▸ **initSharedEngine**(`«destructured»`): [`MagickEngine`](interfaces/MagickEngine.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`InitEngineArguments`](#initenginearguments) |

#### Returns

[`MagickEngine`](interfaces/MagickEngine.md)

#### Defined in

[packages/engine/src/lib/engine.ts:64](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/engine.ts#L64)

___

### processCode

▸ **processCode**(`code`, `inputs`, `data`, `language?`): `Promise`<`any`\>

Process the code based on the given inputs.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `code` | `unknown` | `undefined` | The code to process. |
| `inputs` | [`MagickWorkerInputs`](#magickworkerinputs) | `undefined` | The input values for the code. |
| `data` | [`UnknownData`](#unknowndata) | `undefined` | The data values required for processing the code. |
| `language` | [`SupportedLanguages`](#supportedlanguages) | `'javascript'` | The supported language for processing the code. Default is `javascript`. |

#### Returns

`Promise`<`any`\>

The result of processing the code.

#### Defined in

[packages/engine/src/lib/functions/processCode.ts:23](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/functions/processCode.ts#L23)

___

### runPython

▸ **runPython**(`code`, `entry`, `data`): `Promise`<`any`\>

Run Python code using Pyodide and return the result.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `any` | The Python code to run. |
| `entry` | `any` | The input values for the Python code. |
| `data` | `any` | Additional data to pass to the Python code. |

#### Returns

`Promise`<`any`\>

The result of the executed Python code.

#### Defined in

[packages/engine/src/lib/functions/ProcessPython.ts:17](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/functions/ProcessPython.ts#L17)

___

### saveRequest

▸ **saveRequest**(`«destructured»`): `any`

Calculate and save request details in the module.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`RequestPayload`](#requestpayload) |

#### Returns

`any`

A promise that resolves the saved request object.

#### Defined in

[packages/engine/src/lib/functions/saveRequest.ts:27](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/functions/saveRequest.ts#L27)
