---
id: "index"
title: "@magickml/core"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Enumerations

- [ChatModel](enums/ChatModel.md)
- [EmbeddingModel](enums/EmbeddingModel.md)
- [TextModel](enums/TextModel.md)

## Classes

- [Agent](classes/Agent.md)
- [AgentManager](classes/AgentManager.md)
- [BooleanControl](classes/BooleanControl.md)
- [ClientPlugin](classes/ClientPlugin.md)
- [ClientPluginManager](classes/ClientPluginManager.md)
- [CodeControl](classes/CodeControl.md)
- [DataControl](classes/DataControl.md)
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
- [SocketGeneratorControl](classes/SocketGeneratorControl.md)
- [SpellError](classes/SpellError.md)
- [SpellManager](classes/SpellManager.md)
- [SpellRunner](classes/SpellRunner.md)
- [SwitchControl](classes/SwitchControl.md)
- [Task](classes/Task.md)
- [TextInputControl](classes/TextInputControl.md)

## Interfaces

- [EditorContext](interfaces/EditorContext.md)
- [IRunContextEditor](interfaces/IRunContextEditor.md)
- [MagickEngine](interfaces/MagickEngine.md)
- [MagickTask](interfaces/MagickTask.md)
- [ModuleIRunContextEditor](interfaces/ModuleIRunContextEditor.md)
- [ModuleOptions](interfaces/ModuleOptions.md)
- [PubSubContext](interfaces/PubSubContext.md)

## Type Aliases

### AgentInterface

Ƭ **AgentInterface**: [`AgentSchema`](#agentschema)

The interface for an agent object that's based on the `agentSchema`.

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/schemas.ts:75](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/schemas.ts#L75)
=======
[packages/core/shared/src/schemas.ts:75](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/schemas.ts#L75)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### AgentSchema

Ƭ **AgentSchema**: `Static`<typeof [`agentSchema`](#agentschema-1)\>

The type for an agent object that's based on the `agentSchema`.

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/schemas.ts:73](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/schemas.ts#L73)
=======
[packages/core/shared/src/schemas.ts:73](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/schemas.ts#L73)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### AgentTask

Ƭ **AgentTask**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `agentId?` | `string` |
| `eventData` | [`Event`](#event) |
| `id` | `number` |
| `objective` | `string` |
| `projectId` | `string` |
| `status` | `AgentTaskStatus` |
| `steps` | `string` |
| `type` | `string` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:73](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L73)
=======
[packages/core/shared/src/types.ts:73](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L73)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### AgentTaskData

Ƭ **AgentTaskData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `action` | `string` |
| `result` | `string` |
| `skill` | `string` |
| `thought` | `string` |
| `timestamp` | `number` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:84](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L84)
=======
[packages/core/shared/src/types.ts:84](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L84)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:633](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L633)
=======
[packages/core/shared/src/types.ts:633](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L633)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### AudioCompletionSubtype

Ƭ **AudioCompletionSubtype**: ``"text2speech"`` \| ``"text2audio"``

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:480](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L480)
=======
[packages/core/shared/src/types.ts:480](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L480)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:543](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L543)
=======
[packages/core/shared/src/types.ts:543](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L543)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### ChatMessage

Ƭ **ChatMessage**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `content` | `string` |
| `role` | ``"system"`` \| ``"user"`` \| ``"assistant"`` \| `string` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:538](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L538)
=======
[packages/core/shared/src/types.ts:538](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L538)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### ClassifierSchema

Ƭ **ClassifierSchema**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `examples` | `string`[] \| `string` |
| `type` | `string` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:462](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L462)
=======
[packages/core/shared/src/types.ts:462](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L462)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### CompletionHandlerInputData

Ƭ **CompletionHandlerInputData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `context` | [`ModuleContext`](#modulecontext) |
| `inputs` | [`MagickWorkerInputs`](#magickworkerinputs) |
| `node` | `NodeData` |
| `outputs` | [`MagickWorkerOutputs`](#magickworkeroutputs) |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:600](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L600)
=======
[packages/core/shared/src/types.ts:600](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L600)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:493](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L493)
=======
[packages/core/shared/src/types.ts:493](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L493)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### CompletionProvider

Ƭ **CompletionProvider**: `Object`

#### Index signature

▪ [x: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `handler?` | (`attrs`: { `context`: `unknown` ; `inputs`: [`MagickWorkerInputs`](#magickworkerinputs) ; `node`: [`WorkerData`](#workerdata) ; `outputs`: [`MagickWorkerOutputs`](#magickworkeroutputs)  }) => `Promise`<`HandlerResponse`\> \| `HandlerResponse` |
| `inputs` | [`CompletionSocket`](#completionsocket)[] |
| `inspectorControls?` | [`CompletionInspectorControls`](#completioninspectorcontrols)[] |
| `models` | `string`[] |
| `outputs` | [`CompletionSocket`](#completionsocket)[] |
| `subtype` | [`ImageCompletionSubtype`](#imagecompletionsubtype) \| [`TextCompletionSubtype`](#textcompletionsubtype) \| [`AudioCompletionSubtype`](#audiocompletionsubtype) \| [`DatabaseCompletionSubtype`](#databasecompletionsubtype) |
| `type` | [`CompletionType`](#completiontype) |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:507](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L507)
=======
[packages/core/shared/src/types.ts:507](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L507)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:482](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L482)
=======
[packages/core/shared/src/types.ts:482](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L482)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### CompletionType

Ƭ **CompletionType**: ``"image"`` \| ``"text"`` \| ``"audio"`` \| ``"database"``

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:474](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L474)
=======
[packages/core/shared/src/types.ts:474](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L474)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### ComponentData

Ƭ **ComponentData**<`T`\>: `Record`<`string`, `unknown`\> & { `icon?`: `string` ; `ignored?`: [`IgnoredList`](#ignoredlist) ; `socketType?`: [`SocketType`](#sockettype) ; `taskType?`: `T`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`TaskType`](#tasktype) |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:352](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L352)
=======
[packages/core/shared/src/types.ts:352](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L352)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### ConnectionType

Ƭ **ConnectionType**: ``"input"`` \| ``"output"``

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:305](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L305)
=======
[packages/core/shared/src/types.ts:305](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L305)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### CostPerToken

Ƭ **CostPerToken**<`T`\>: { [key in T]: number }

Represents the cost per token for a given model

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`TextModel`](enums/TextModel.md) \| [`EmbeddingModel`](enums/EmbeddingModel.md) \| [`ChatModel`](enums/ChatModel.md) |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/cost-calculator.ts:33](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/cost-calculator.ts#L33)
=======
[packages/core/shared/src/cost-calculator.ts:33](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/cost-calculator.ts#L33)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### CreateAgentTaskArgs

Ƭ **CreateAgentTaskArgs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `agentId?` | `string` |
| `eventData` | [`Event`](#event) |
| `objective` | `string` |
| `projectId` | `string` |
| `status` | `AgentTaskStatus` |
| `steps` | `string` |
| `type` | `string` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:63](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L63)
=======
[packages/core/shared/src/types.ts:63](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L63)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### CreateDocumentArgs

Ƭ **CreateDocumentArgs**: [`Document`](#document)

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:55](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L55)
=======
[packages/core/shared/src/types.ts:55](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L55)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### CreateEventArgs

Ƭ **CreateEventArgs**: [`Event`](#event)

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:110](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L110)
=======
[packages/core/shared/src/types.ts:110](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L110)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### CustomErrorCodes

Ƭ **CustomErrorCodes**: ``"input-failed"`` \| ``"server-error"`` \| ``"not-found"`` \| ``"already-exists"`` \| ``"authentication-error"``

The possible custom error codes to be used in the application.

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/utils/SpellError.ts:5](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/utils/SpellError.ts#L5)
=======
[packages/core/shared/src/utils/SpellError.ts:5](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/utils/SpellError.ts#L5)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:307](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L307)
=======
[packages/core/shared/src/types.ts:307](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L307)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### DebuggerArgs

Ƭ **DebuggerArgs**: `Object`

Arguments passed to the `install` function

#### Type declaration

| Name | Type |
| :------ | :------ |
| `server?` | `boolean` |
| `throwError?` | (`message`: `unknown`) => `void` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/plugins/consolePlugin/index.ts:18](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugins/consolePlugin/index.ts#L18)
=======
[packages/core/shared/src/plugins/consolePlugin/index.ts:18](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugins/consolePlugin/index.ts#L18)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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
| `projectId?` | `string` |
| `type?` | `string` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:46](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L46)
=======
[packages/core/shared/src/types.ts:46](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L46)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:557](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L557)
=======
[packages/core/shared/src/types.ts:557](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L557)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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
| `getSpell` | [`GetSpell`](#getspell) |
| `processCode?` | [`ProcessCode`](#processcode) |
| `runSpell` | [`RunSpell`](#runspell)<`DataType`\> |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:197](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L197)
=======
[packages/core/shared/src/types.ts:197](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L197)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### Env

Ƭ **Env**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `API_ROOT_URL` | `string` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:158](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L158)
=======
[packages/core/shared/src/types.ts:158](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L158)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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
| `connector?` | `string` |
| `content?` | `string` |
| `date?` | `string` |
| `embedding?` | `number`[] |
| `entities?` | `string`[] |
| `id?` | `number` |
| `observer?` | `string` |
| `projectId?` | `string` |
| `rawData?` | `string` |
| `sender?` | `string` |
| `type?` | `string` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:92](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L92)
=======
[packages/core/shared/src/types.ts:92](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L92)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### EventResponse

Ƭ **EventResponse**: [`Event`](#event)[]

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:133](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L133)
=======
[packages/core/shared/src/types.ts:133](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L133)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:284](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L284)
=======
[packages/core/shared/src/types.ts:284](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L284)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### ExFn

Ƭ **ExFn**: [``true``, `unknown`] \| [``false``, `string`]

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:455](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L455)
=======
[packages/core/shared/src/types.ts:455](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L455)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### GetDocumentArgs

Ƭ **GetDocumentArgs**: [`Document`](#document) & { `maxCount?`: `number`  }

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:57](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L57)
=======
[packages/core/shared/src/types.ts:57](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L57)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### GetEventArgs

Ƭ **GetEventArgs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `channel?` | `string` |
| `channelType?` | `string` |
| `client?` | `string` |
| `connector?` | `string` |
| `embedding?` | `string` |
| `maxCount?` | `number` |
| `observer?` | `string` |
| `projectId?` | `string` |
| `rawData?` | `string` |
| `type?` | `string` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:112](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L112)
=======
[packages/core/shared/src/types.ts:112](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L112)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:174](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L174)
=======
[packages/core/shared/src/types.ts:174](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L174)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:127](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L127)
=======
[packages/core/shared/src/types.ts:127](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L127)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### GoFn

Ƭ **GoFn**: [`boolean`, `string` \| ``null``, `unknown`]

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:448](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L448)
=======
[packages/core/shared/src/types.ts:448](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L448)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### GraphData

Ƭ **GraphData**: `Data`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:344](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L344)
=======
[packages/core/shared/src/types.ts:344](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L344)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:667](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L667)
=======
[packages/core/shared/src/types.ts:667](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L667)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### IgnoredList

Ƭ **IgnoredList**: { `name`: `string`  }[] \| `string`[]

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:346](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L346)
=======
[packages/core/shared/src/types.ts:346](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L346)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### ImageCacheResponse

Ƭ **ImageCacheResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `images` | [`ImageType`](#imagetype)[] |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:42](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L42)
=======
[packages/core/shared/src/types.ts:42](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L42)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### ImageCompletionSubtype

Ƭ **ImageCompletionSubtype**: ``"text2image"`` \| ``"image2image"`` \| ``"image2text"``

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:476](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L476)
=======
[packages/core/shared/src/types.ts:476](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L476)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:33](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L33)
=======
[packages/core/shared/src/types.ts:33](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L33)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/engine.ts:56](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/engine.ts#L56)
=======
[packages/core/shared/src/engine.ts:56](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/engine.ts#L56)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### InputComponentData

Ƭ **InputComponentData**: [`ComponentData`](#componentdata)<[`TaskType`](#tasktype)\>

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:359](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L359)
=======
[packages/core/shared/src/types.ts:359](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L359)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/plugins/inspectorPlugin/Inspector.ts:27](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugins/inspectorPlugin/Inspector.ts#L27)
=======
[packages/core/shared/src/plugins/inspectorPlugin/Inspector.ts:27](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugins/inspectorPlugin/Inspector.ts#L27)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### MagicComponentCategory

Ƭ **MagicComponentCategory**: ``"Esoterica"`` \| ``"Object"`` \| ``"Number"`` \| ``"I/O"`` \| ``"Flow"`` \| ``"Experimental"`` \| ``"Discord"`` \| ``"Embedding"`` \| ``"Document"`` \| ``"Code"`` \| ``"Boolean"`` \| ``"Array"`` \| ``"Image"`` \| ``"Generation"`` \| ``"Event"`` \| ``"Text"`` \| ``"Utility"`` \| ``"Esoterica"`` \| ``"Ethereum"`` \| ``"Pinecone"`` \| ``"Search"`` \| ``"Magick"`` \| ``"Audio"`` \| ``"Task"`` \| ``"Database"``

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/engine.ts:133](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/engine.ts#L133)
=======
[packages/core/shared/src/engine.ts:133](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/engine.ts#L133)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### MagicNodeInput

Ƭ **MagicNodeInput**: `Input` & { `socketType`: [`DataSocketType`](#datasockettype)  }

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:316](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L316)
=======
[packages/core/shared/src/types.ts:316](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L316)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### MagicNodeOutput

Ƭ **MagicNodeOutput**: `Output` & { `socketType`: [`DataSocketType`](#datasockettype) ; `taskType?`: [`TaskType`](#tasktype)  }

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:317](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L317)
=======
[packages/core/shared/src/types.ts:317](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L317)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### MagickComponentArray

Ƭ **MagickComponentArray**<`T`\>: `T`[]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`MagickComponent`](classes/MagickComponent.md)<`unknown`\> = `any` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/engine.ts:231](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/engine.ts#L231)
=======
[packages/core/shared/src/engine.ts:231](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/engine.ts#L231)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### MagickNode

Ƭ **MagickNode**: `Node` & { `category?`: `string` ; `console`: `MagickConsole` ; `data`: [`WorkerData`](#workerdata) ; `display`: (`content`: `string`) => `void` ; `displayName?`: `string` ; `info`: `string` ; `inspector`: `Inspector` ; `outputs`: [`MagicNodeOutput`](#magicnodeoutput)[] ; `subscription`: [`PubSubCallback`](#pubsubcallback)  }

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:322](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L322)
=======
[packages/core/shared/src/types.ts:322](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L322)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:379](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L379)
=======
[packages/core/shared/src/types.ts:379](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L379)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:426](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L426)
=======
[packages/core/shared/src/types.ts:426](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L426)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### MagickSpellInput

Ƭ **MagickSpellInput**: `Record`<`string`, `unknown`\>

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:418](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L418)
=======
[packages/core/shared/src/types.ts:418](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L418)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### MagickSpellOutput

Ƭ **MagickSpellOutput**: `Record`<`string`, `unknown`\>

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:419](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L419)
=======
[packages/core/shared/src/types.ts:419](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L419)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### MagickWorkerInput

Ƭ **MagickWorkerInput**: `string` \| `unknown` \| [`MagickReteInput`](#magickreteinput)

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:441](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L441)
=======
[packages/core/shared/src/types.ts:441](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L441)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### MagickWorkerInputs

Ƭ **MagickWorkerInputs**: `Object`

#### Index signature

▪ [key: `string`]: [`MagickWorkerInput`](#magickworkerinput)[]

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:442](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L442)
=======
[packages/core/shared/src/types.ts:442](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L442)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### MagickWorkerOutputs

Ƭ **MagickWorkerOutputs**: `WorkerOutputs` & { `[key: string]`: [`TaskOutput`](#taskoutput);  }

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:443](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L443)
=======
[packages/core/shared/src/types.ts:443](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L443)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### MessagingRequest

Ƭ **MessagingRequest**: `unknown`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:607](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L607)
=======
[packages/core/shared/src/types.ts:607](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L607)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:467](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L467)
=======
[packages/core/shared/src/types.ts:467](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L467)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### Method

Ƭ **Method**: ``"get"`` \| ``"head"`` \| ``"post"`` \| ``"put"`` \| ``"delete"`` \| ``"connect"`` \| ``"options"`` \| ``"trace"`` \| ``"patch"``

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:655](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L655)
=======
[packages/core/shared/src/types.ts:655](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L655)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:653](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L653)
=======
[packages/core/shared/src/types.ts:653](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L653)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:416](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L416)
=======
[packages/core/shared/src/types.ts:416](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L416)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### ModuleComponent

Ƭ **ModuleComponent**: [`MagickComponent`](classes/MagickComponent.md)<`unknown`\> & { `run`: (`node`: [`MagickNode`](#magicknode), `data?`: `unknown`) => `Promise`<`void`\>  }

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:362](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L362)
=======
[packages/core/shared/src/types.ts:362](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L362)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### ModuleContext

Ƭ **ModuleContext**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `agent` | [`Agent`](classes/Agent.md) |
| `app` | `Application` |
| `context` | [`EngineContext`](#enginecontext) |
| `currentSpell` | `Spell` |
| `data` | { `[key: string]`: `unknown`;  } |
| `module` | { `app?`: `Application` ; `inputs`: `Record`<`string`, `unknown`\> ; `outputs`: `Record`<`string`, `unknown`\> ; `publicVariables?`: `Record`<`string`, `string`\> ; `secrets?`: `Record`<`string`, `string`\>  } |
| `module.app?` | `Application` |
| `module.inputs` | `Record`<`string`, `unknown`\> |
| `module.outputs` | `Record`<`string`, `unknown`\> |
| `module.publicVariables?` | `Record`<`string`, `string`\> |
| `module.secrets?` | `Record`<`string`, `string`\> |
| `projectId` | `string` |
| `socketInfo` | { `targetNode`: [`MagickNode`](#magicknode) ; `targetSocket`: `string`  } |
| `socketInfo.targetNode` | [`MagickNode`](#magicknode) |
| `socketInfo.targetSocket` | `string` |
| `spellManager` | [`SpellManager`](classes/SpellManager.md) |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:577](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L577)
=======
[packages/core/shared/src/types.ts:577](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L577)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### ModuleGraphData

Ƭ **ModuleGraphData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `nodes` | `Record`<`string`, [`MagickNode`](#magicknode)\> |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:26](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L26)
=======
[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:26](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L26)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### ModulePluginArgs

Ƭ **ModulePluginArgs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `engine` | [`MagickEngine`](interfaces/MagickEngine.md) |
| `modules?` | `Record`<`string`, [`ModuleType`](#moduletype)\> |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/plugins/modulePlugin/index.ts:42](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugins/modulePlugin/index.ts#L42)
=======
[packages/core/shared/src/plugins/modulePlugin/index.ts:42](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugins/modulePlugin/index.ts#L42)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:19](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L19)
=======
[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:19](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L19)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:334](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L334)
=======
[packages/core/shared/src/types.ts:334](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L334)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### ModuleWorkerOutput

Ƭ **ModuleWorkerOutput**: `WorkerOutputs`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:439](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L439)
=======
[packages/core/shared/src/types.ts:439](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L439)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### NewSpellArgs

Ƭ **NewSpellArgs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `graph` | `Data` |
| `name` | `string` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:421](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L421)
=======
[packages/core/shared/src/types.ts:421](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L421)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:366](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L366)
=======
[packages/core/shared/src/types.ts:366](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L366)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### NodeOutputs

Ƭ **NodeOutputs**: `Object`

#### Index signature

▪ [outputKey: `string`]: { `connections`: [`NodeConnections`](#nodeconnections)[]  }

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:373](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L373)
=======
[packages/core/shared/src/types.ts:373](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L373)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:262](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L262)
=======
[packages/core/shared/src/types.ts:262](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L262)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:261](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L261)
=======
[packages/core/shared/src/types.ts:261](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L261)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:260](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L260)
=======
[packages/core/shared/src/types.ts:260](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L260)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:256](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L256)
=======
[packages/core/shared/src/types.ts:256](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L256)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:255](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L255)
=======
[packages/core/shared/src/types.ts:255](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L255)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:135](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L135)
=======
[packages/core/shared/src/types.ts:135](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L135)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### OutputComponentData

Ƭ **OutputComponentData**: [`ComponentData`](#componentdata)<[`TaskType`](#tasktype)\>

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:360](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L360)
=======
[packages/core/shared/src/types.ts:360](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L360)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### PageLayout

Ƭ **PageLayout**: `LazyExoticComponent`<() => `JSX.Element`\> \| ``null``

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/plugin.ts:67](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugin.ts#L67)
=======
[packages/core/shared/src/plugin.ts:67](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugin.ts#L67)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/plugin.ts:18](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugin.ts#L18)
=======
[packages/core/shared/src/plugin.ts:18](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugin.ts#L18)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/plugin.ts:12](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugin.ts#L12)
=======
[packages/core/shared/src/plugin.ts:12](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugin.ts#L12)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/plugin.ts:27](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugin.ts#L27)
=======
[packages/core/shared/src/plugin.ts:27](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugin.ts#L27)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/plugin.ts:5](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugin.ts#L5)
=======
[packages/core/shared/src/plugin.ts:5](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugin.ts#L5)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### PluginServerRoute

Ƭ **PluginServerRoute**: [`Route`](#route)

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/plugin.ts:25](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugin.ts#L25)
=======
[packages/core/shared/src/plugin.ts:25](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugin.ts#L25)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:182](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L182)
=======
[packages/core/shared/src/types.ts:182](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L182)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:253](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L253)
=======
[packages/core/shared/src/types.ts:253](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L253)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### PubSubData

Ƭ **PubSubData**: `Record`<`string`, `unknown`\> \| `string` \| `unknown`[]

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:252](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L252)
=======
[packages/core/shared/src/types.ts:252](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L252)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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
| `$CREATE_MEDIAWINDOW` | (`tabId`: `string`) => `string` |
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
| `$RUN_SPELL` | (`tabId?`: `string`) => `string` |
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
| `TOGGLE_SNAP` | `string` |
| `UPDATE_SUBSPELL` | `string` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:203](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L203)
=======
[packages/core/shared/src/types.ts:203](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L203)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:267](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L267)
=======
[packages/core/shared/src/types.ts:267](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L267)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:627](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L627)
=======
[packages/core/shared/src/types.ts:627](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L627)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:609](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L609)
=======
[packages/core/shared/src/types.ts:609](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L609)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:669](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L669)
=======
[packages/core/shared/src/types.ts:669](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L669)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:189](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L189)
=======
[packages/core/shared/src/types.ts:189](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L189)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### RunSpellArgs

Ƭ **RunSpellArgs**: `Object`

Type definition for the arguments of the `runSpell` function.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `agent?` | `any` |
| `app?` | `any` |
| `inputFormatter?` | (`graph`: [`GraphData`](#graphdata)) => `Record`<`string`, `unknown`\> |
| `inputs?` | `Record`<`string`, `unknown`\> |
| `projectId` | `string` |
| `publicVariables?` | `Record`<`string`, `unknown`\> |
| `secrets` | `Record`<`string`, `string`\> |
| `spellId` | `string` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/utils/runSpell.ts:10](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/utils/runSpell.ts#L10)
=======
[packages/core/shared/src/utils/runSpell.ts:10](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/utils/runSpell.ts#L10)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### SearchSchema

Ƭ **SearchSchema**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `description` | `string` |
| `title` | `string` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:457](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L457)
=======
[packages/core/shared/src/types.ts:457](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L457)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### ServerInit

Ƭ **ServerInit**: () => `Promise`<`void`\> \| ``null`` \| `void`

#### Type declaration

▸ (): `Promise`<`void`\> \| ``null`` \| `void`

##### Returns

`Promise`<`void`\> \| ``null`` \| `void`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/plugin.ts:114](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugin.ts#L114)
=======
[packages/core/shared/src/plugin.ts:114](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugin.ts#L114)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### ServerInits

Ƭ **ServerInits**: `Record`<`string`, [`ServerInit`](#serverinit)\>

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/plugin.ts:115](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugin.ts#L115)
=======
[packages/core/shared/src/plugin.ts:115](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugin.ts#L115)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### SocketData

Ƭ **SocketData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `error?` | { `message`: `string` ; `stack`: `string`  } |
| `error.message` | `string` |
| `error.stack` | `string` |
| `input?` | [`MagickWorkerInputs`](#magickworkerinputs) |
| `output?` | `WorkerOutputs` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/plugins/socketPlugin/index.ts:20](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugins/socketPlugin/index.ts#L20)
=======
[packages/core/shared/src/plugins/socketPlugin/index.ts:20](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugins/socketPlugin/index.ts#L20)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### SocketNameType

Ƭ **SocketNameType**: ``"Any"`` \| ``"Number"`` \| ``"Boolean"`` \| ``"Array"`` \| ``"String"`` \| ``"Object"`` \| ``"Trigger"`` \| ``"Event"`` \| ``"Task"`` \| ``"Audio"`` \| ``"Image"`` \| ``"Document"`` \| ``"Embedding"``

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/sockets.ts:8](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/sockets.ts#L8)
=======
[packages/core/shared/src/sockets.ts:8](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/sockets.ts#L8)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/plugins/socketPlugin/index.ts:13](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugins/socketPlugin/index.ts#L13)
=======
[packages/core/shared/src/plugins/socketPlugin/index.ts:13](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugins/socketPlugin/index.ts#L13)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### SocketType

Ƭ **SocketType**: ``"anySocket"`` \| ``"numberSocket"`` \| ``"booleanSocket"`` \| ``"arraySocket"`` \| ``"stringSocket"`` \| ``"objectSocket"`` \| ``"triggerSocket"`` \| ``"eventSocket"`` \| ``"taskSocket"`` \| ``"audioSocket"`` \| ``"imageSocket"`` \| ``"embeddingSocket"`` \| ``"taskSocket"`` \| ``"documentSocket"``

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/sockets.ts:23](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/sockets.ts#L23)
=======
[packages/core/shared/src/sockets.ts:23](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/sockets.ts#L23)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### SpellInterface

Ƭ **SpellInterface**: `Static`<typeof [`spellSchema`](#spellschema)\>

The interface for a spell object that's based on the `spellSchema`.

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/schemas.ts:37](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/schemas.ts#L37)
=======
[packages/core/shared/src/schemas.ts:37](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/schemas.ts#L37)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:342](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L342)
=======
[packages/core/shared/src/types.ts:342](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L342)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### SupportedLanguages

Ƭ **SupportedLanguages**: ``"python"`` \| ``"javascript"``

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:172](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L172)
=======
[packages/core/shared/src/types.ts:172](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L172)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### TaskOptions

Ƭ **TaskOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `init?` | (`task`: [`Task`](classes/Task.md) \| `undefined`, `node`: `NodeData`) => `void` |
| `onRun?` | (`node`: `NodeData`, `task`: [`Task`](classes/Task.md), `data`: `unknown`, `socketInfo`: [`TaskSocketInfo`](#tasksocketinfo)) => `void` |
| `outputs` | `Record`<`string`, `unknown`\> |
| `runOneInput?` | `boolean` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/plugins/taskPlugin/task.ts:18](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugins/taskPlugin/task.ts#L18)
=======
[packages/core/shared/src/plugins/taskPlugin/task.ts:18](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugins/taskPlugin/task.ts#L18)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:433](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L433)
=======
[packages/core/shared/src/types.ts:433](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L433)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### TaskOutputTypes

Ƭ **TaskOutputTypes**: ``"option"`` \| ``"output"``

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/plugins/taskPlugin/task.ts:39](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugins/taskPlugin/task.ts#L39)
=======
[packages/core/shared/src/plugins/taskPlugin/task.ts:39](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugins/taskPlugin/task.ts#L39)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### TaskSocketInfo

Ƭ **TaskSocketInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `targetNode` | `NodeData` \| ``null`` |
| `targetSocket` | `string` \| ``null`` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/plugins/taskPlugin/task.ts:13](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugins/taskPlugin/task.ts#L13)
=======
[packages/core/shared/src/plugins/taskPlugin/task.ts:13](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugins/taskPlugin/task.ts#L13)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### TaskType

Ƭ **TaskType**: ``"output"`` \| ``"option"``

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:304](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L304)
=======
[packages/core/shared/src/types.ts:304](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L304)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:526](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L526)
=======
[packages/core/shared/src/types.ts:526](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L526)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### TextCompletionSubtype

Ƭ **TextCompletionSubtype**: ``"text"`` \| ``"embedding"`` \| ``"chat"``

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:478](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L478)
=======
[packages/core/shared/src/types.ts:478](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L478)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### UnknownData

Ƭ **UnknownData**: `Record`<`string`, `unknown`\>

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:162](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L162)
=======
[packages/core/shared/src/types.ts:162](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L162)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### UnknownSpellData

Ƭ **UnknownSpellData**: [`UnknownData`](#unknowndata)

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:163](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L163)
=======
[packages/core/shared/src/types.ts:163](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L163)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/plugins/modulePlugin/index.ts:31](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugins/modulePlugin/index.ts#L31)
=======
[packages/core/shared/src/plugins/modulePlugin/index.ts:31](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugins/modulePlugin/index.ts#L31)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### UserSpellManager

Ƭ **UserSpellManager**: `Map`<`string`, [`SpellManager`](classes/SpellManager.md)\>

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:683](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L683)
=======
[packages/core/shared/src/types.ts:683](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L683)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### WorkerData

Ƭ **WorkerData**: `NodeData` & { `[key: string]`: `unknown`; `console?`: `MagickConsole` ; `data?`: [`MagickNodeData`](#magicknodedata) ; `spell?`: `string`  }

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/types.ts:389](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L389)
=======
[packages/core/shared/src/types.ts:389](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L389)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:165](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L165)
=======
[packages/core/shared/src/types.ts:165](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L165)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

## Variables

### AGENT\_UPDATE\_TIME\_MSEC

• `Const` **AGENT\_UPDATE\_TIME\_MSEC**: `number`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:76](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L76)
=======
[packages/core/shared/src/config.ts:82](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L82)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### API\_ROOT\_URL

• `Const` **API\_ROOT\_URL**: `string`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:45](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L45)
=======
[packages/core/shared/src/config.ts:45](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L45)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### COST\_PER\_TOKEN

• `Const` **COST\_PER\_TOKEN**: [`CostPerToken`](#costpertoken)<[`TextModel`](enums/TextModel.md) \| [`EmbeddingModel`](enums/EmbeddingModel.md) \| [`ChatModel`](enums/ChatModel.md)\>

The cost per token for each TextModel, EmbeddingModel and ChatModel

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/cost-calculator.ts:40](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/cost-calculator.ts#L40)
=======
[packages/core/shared/src/cost-calculator.ts:40](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/cost-calculator.ts#L40)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### CachePlugin

• `Const` **CachePlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`MagickEditor`](classes/MagickEditor.md)) => `void` |
| `name` | `string` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/plugins/cachePlugin/index.ts:90](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugins/cachePlugin/index.ts#L90)
=======
[packages/core/shared/src/plugins/cachePlugin/index.ts:90](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugins/cachePlugin/index.ts#L90)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### ConsolePlugin

• `Const` **ConsolePlugin**: `Object`

Default export object

**`Memberof`**

module:consolePlugin

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`IRunContextEditor`](interfaces/IRunContextEditor.md), `[{?`: [`DebuggerArgs`](#debuggerargs)) => `void` |
| `name` | `string` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/plugins/consolePlugin/index.ts:80](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugins/consolePlugin/index.ts#L80)
=======
[packages/core/shared/src/plugins/consolePlugin/index.ts:80](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugins/consolePlugin/index.ts#L80)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### DATABASE\_URL

• `Const` **DATABASE\_URL**: `undefined` \| `string`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:30](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L30)
=======
[packages/core/shared/src/config.ts:30](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L30)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### DEFAULT\_PROJECT\_ID

• `Const` **DEFAULT\_PROJECT\_ID**: `string`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:31](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L31)
=======
[packages/core/shared/src/config.ts:31](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L31)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### DEFAULT\_USER\_ID

• `Const` **DEFAULT\_USER\_ID**: `string`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:33](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L33)
=======
[packages/core/shared/src/config.ts:33](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L33)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### DEFAULT\_USER\_TOKEN

• `Const` **DEFAULT\_USER\_TOKEN**: `string`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:34](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L34)
=======
[packages/core/shared/src/config.ts:34](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L34)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### ELEVENLABS\_API\_KEY

• `Const` **ELEVENLABS\_API\_KEY**: `string`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:70](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L70)
=======
[packages/core/shared/src/config.ts:76](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L76)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### ENABLE\_SPEECH\_SERVER

• `Const` **ENABLE\_SPEECH\_SERVER**: `string` \| ``true``

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:51](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L51)
=======
[packages/core/shared/src/config.ts:51](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L51)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### ErrorPlugin

• `Const` **ErrorPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`engine`: [`IRunContextEditor`](interfaces/IRunContextEditor.md), `options`: { `server?`: `boolean` ; `throwError?`: (`error`: `unknown`) => `void`  }) => `void` |
| `name` | `string` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/plugins/errorPlugin/index.ts:48](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugins/errorPlugin/index.ts#L48)
=======
[packages/core/shared/src/plugins/errorPlugin/index.ts:48](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugins/errorPlugin/index.ts#L48)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### FILE\_SERVER\_PORT

• `Const` **FILE\_SERVER\_PORT**: `string` \| ``65530``

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:54](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L54)
=======
[packages/core/shared/src/config.ts:54](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L54)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### FILE\_SERVER\_URL

• `Const` **FILE\_SERVER\_URL**: `string`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:56](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L56)
=======
[packages/core/shared/src/config.ts:56](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L56)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### GOOGLE\_APPLICATION\_CREDENTIALS

• `Const` **GOOGLE\_APPLICATION\_CREDENTIALS**: `any`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:47](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L47)
=======
[packages/core/shared/src/config.ts:47](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L47)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### HistoryPlugin

• `Const` **HistoryPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: `any`, `options`: `Object`) => `void` |
| `name` | `string` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/plugins/historyPlugin/index.ts:77](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugins/historyPlugin/index.ts#L77)
=======
[packages/core/shared/src/plugins/historyPlugin/index.ts:77](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugins/historyPlugin/index.ts#L77)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### IGNORE\_AUTH

• `Const` **IGNORE\_AUTH**: `boolean`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:29](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L29)
=======
[packages/core/shared/src/config.ts:29](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L29)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### InspectorPlugin

• `Const` **InspectorPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`IRunContextEditor`](interfaces/IRunContextEditor.md)) => `void` |
| `name` | `string` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/plugins/inspectorPlugin/index.ts:63](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugins/inspectorPlugin/index.ts#L63)
=======
[packages/core/shared/src/plugins/inspectorPlugin/index.ts:63](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugins/inspectorPlugin/index.ts#L63)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### JWT\_SECRET

• `Const` **JWT\_SECRET**: `string`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:63](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L63)
=======
[packages/core/shared/src/config.ts:63](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L63)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### KeyCodePlugin

• `Const` **KeyCodePlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`IRunContextEditor`](interfaces/IRunContextEditor.md)) => `void` |
| `name` | `string` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/plugins/keyCodePlugin/index.ts:41](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugins/keyCodePlugin/index.ts#L41)
=======
[packages/core/shared/src/plugins/keyCodePlugin/index.ts:41](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugins/keyCodePlugin/index.ts#L41)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/plugins/lifecyclePlugin/index.ts:92](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugins/lifecyclePlugin/index.ts#L92)
=======
[packages/core/shared/src/plugins/lifecyclePlugin/index.ts:92](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugins/lifecyclePlugin/index.ts#L92)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### ModulePlugin

• `Const` **ModulePlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`runContext`: [`ModuleIRunContextEditor`](interfaces/ModuleIRunContextEditor.md), `__namedParameters`: [`ModulePluginArgs`](#modulepluginargs)) => `void` |
| `name` | `string` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/plugins/modulePlugin/index.ts:279](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugins/modulePlugin/index.ts#L279)
=======
[packages/core/shared/src/plugins/modulePlugin/index.ts:279](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugins/modulePlugin/index.ts#L279)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### MultiCopyPlugin

• `Const` **MultiCopyPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`IRunContextEditor`](interfaces/IRunContextEditor.md)) => `void` |
| `name` | `string` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/plugins/multiCopyPlugin/index.ts:164](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugins/multiCopyPlugin/index.ts#L164)
=======
[packages/core/shared/src/plugins/multiCopyPlugin/index.ts:164](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugins/multiCopyPlugin/index.ts#L164)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### MultiSocketGenerator

• `Const` **MultiSocketGenerator**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`IRunContextEditor`](interfaces/IRunContextEditor.md)) => `void` |
| `name` | `string` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/plugins/multiSocketGenerator/index.ts:70](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugins/multiSocketGenerator/index.ts#L70)
=======
[packages/core/shared/src/plugins/multiSocketGenerator/index.ts:70](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugins/multiSocketGenerator/index.ts#L70)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### NODE\_ENV

• `Const` **NODE\_ENV**: `string`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:59](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L59)
=======
[packages/core/shared/src/config.ts:59](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L59)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### NodeClickPlugin

• `Const` **NodeClickPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`IRunContextEditor`](interfaces/IRunContextEditor.md)) => `void` |
| `name` | `string` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/plugins/nodeClickPlugin/index.ts:38](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugins/nodeClickPlugin/index.ts#L38)
=======
[packages/core/shared/src/plugins/nodeClickPlugin/index.ts:38](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugins/nodeClickPlugin/index.ts#L38)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### PAGINATE\_DEFAULT

• `Const` **PAGINATE\_DEFAULT**: `string`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:61](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L61)
=======
[packages/core/shared/src/config.ts:61](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L61)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### PAGINATE\_MAX

• `Const` **PAGINATE\_MAX**: `string`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:62](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L62)
=======
[packages/core/shared/src/config.ts:62](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L62)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### PING\_AGENT\_TIME\_MSEC

• `Const` **PING\_AGENT\_TIME\_MSEC**: `number`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:79](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L79)
=======
[packages/core/shared/src/config.ts:85](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L85)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### POSTHOG\_API\_KEY

• `Const` **POSTHOG\_API\_KEY**: `string`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:67](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L67)
=======
[packages/core/shared/src/config.ts:67](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L67)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### POSTHOG\_ENABLED

• `Const` **POSTHOG\_ENABLED**: `boolean`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:65](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L65)
=======
[packages/core/shared/src/config.ts:65](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L65)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### PRODUCTION

• `Const` **PRODUCTION**: `boolean`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:38](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L38)
=======
[packages/core/shared/src/config.ts:38](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L38)

___

### REDISCLOUD\_DB

• `Const` **REDISCLOUD\_DB**: `number`

#### Defined in

[packages/core/shared/src/config.ts:72](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L72)

___

### REDISCLOUD\_HOST

• `Const` **REDISCLOUD\_HOST**: `string`

#### Defined in

[packages/core/shared/src/config.ts:68](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L68)

___

### REDISCLOUD\_PASSWORD

• `Const` **REDISCLOUD\_PASSWORD**: `undefined` \| `string`

#### Defined in

[packages/core/shared/src/config.ts:73](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L73)

___

### REDISCLOUD\_PORT

• `Const` **REDISCLOUD\_PORT**: `number`

#### Defined in

[packages/core/shared/src/config.ts:69](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L69)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### REDISCLOUD\_URL

• `Const` **REDISCLOUD\_URL**: `string`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:68](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L68)
=======
[packages/core/shared/src/config.ts:70](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L70)

___

### REDISCLOUD\_USERNAME

• `Const` **REDISCLOUD\_USERNAME**: `undefined` \| `string`

#### Defined in

[packages/core/shared/src/config.ts:74](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L74)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### SERVER\_HOST

• `Const` **SERVER\_HOST**: `string`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:40](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L40)
=======
[packages/core/shared/src/config.ts:40](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L40)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### SERVER\_PORT

• `Const` **SERVER\_PORT**: `string`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:39](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L39)
=======
[packages/core/shared/src/config.ts:39](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L39)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### SPEECH\_SERVER\_PORT

• `Const` **SPEECH\_SERVER\_PORT**: `string` \| ``65532``

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:49](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L49)
=======
[packages/core/shared/src/config.ts:49](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L49)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### SPEECH\_SERVER\_URL

• `Const` **SPEECH\_SERVER\_URL**: `string`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:41](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L41)
=======
[packages/core/shared/src/config.ts:41](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L41)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### STANDALONE

• `Const` **STANDALONE**: `boolean`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:37](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L37)
=======
[packages/core/shared/src/config.ts:37](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L37)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### SelectionPlugin

• **SelectionPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: `NodeEditor`<`any`\>, `params`: `Cfg`) => `void` |
| `name` | `string` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/plugins/selectionPlugin/index.ts:292](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugins/selectionPlugin/index.ts#L292)
=======
[packages/core/shared/src/plugins/selectionPlugin/index.ts:292](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugins/selectionPlugin/index.ts#L292)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### SocketGeneratorPlugin

• `Const` **SocketGeneratorPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`IRunContextEditor`](interfaces/IRunContextEditor.md)) => `void` |
| `name` | `string` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/plugins/socketGenerator/index.ts:71](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugins/socketGenerator/index.ts#L71)
=======
[packages/core/shared/src/plugins/socketGenerator/index.ts:71](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugins/socketGenerator/index.ts#L71)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### SocketOverridePlugin

• `Const` **SocketOverridePlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`IRunContextEditor`](interfaces/IRunContextEditor.md)) => `void` |
| `name` | `string` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/plugins/socketOverridePlugin/index.ts:24](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugins/socketOverridePlugin/index.ts#L24)
=======
[packages/core/shared/src/plugins/socketOverridePlugin/index.ts:24](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugins/socketOverridePlugin/index.ts#L24)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### SocketPlugin

• `Const` **SocketPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`IRunContextEditor`](interfaces/IRunContextEditor.md), `__namedParameters`: [`SocketPluginArgs`](#socketpluginargs)) => `void` |
| `name` | `string` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/plugins/socketPlugin/index.ts:134](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugins/socketPlugin/index.ts#L134)
=======
[packages/core/shared/src/plugins/socketPlugin/index.ts:134](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugins/socketPlugin/index.ts#L134)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### TRUSTED\_PARENT\_URL

• `Const` **TRUSTED\_PARENT\_URL**: ``null`` \| `string`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:43](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L43)
=======
[packages/core/shared/src/config.ts:43](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L43)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### TaskPlugin

• `Const` **TaskPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`editor`: [`MagickEditor`](classes/MagickEditor.md)) => `void` |
| `name` | `string` |

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/plugins/taskPlugin/index.ts:108](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugins/taskPlugin/index.ts#L108)
=======
[packages/core/shared/src/plugins/taskPlugin/index.ts:108](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugins/taskPlugin/index.ts#L108)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### USESSL

• `Const` **USESSL**: `string` \| ``false``

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:58](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L58)
=======
[packages/core/shared/src/config.ts:58](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L58)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### USSSL\_SPEECH

• `Const` **USSSL\_SPEECH**: `string` \| ``true``

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:53](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L53)
=======
[packages/core/shared/src/config.ts:53](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L53)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### VITE\_APP\_TRUSTED\_PARENT\_URL

• `Const` **VITE\_APP\_TRUSTED\_PARENT\_URL**: `string`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/config.ts:73](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/config.ts#L73)
=======
[packages/core/shared/src/config.ts:79](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L79)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### agentSchema

• `Const` **agentSchema**: `TObject`<{ `data`: `TOptional`<`TAny`\> ; `enabled`: `TOptional`<`TBoolean`\> ; `id`: `TString`<`string`\> ; `name`: `TString`<`string`\> ; `pingedAt`: `TOptional`<`TString`<`string`\>\> ; `projectId`: `TString`<`string`\> ; `publicVariables`: `TOptional`<`TAny`\> ; `rootSpell`: `TOptional`<`TAny`\> ; `secrets`: `TOptional`<`TString`<`string`\>\> ; `updatedAt`: `TOptional`<`TString`<`string`\>\>  }\>

Full data model schema for an agent.

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/schemas.ts:53](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/schemas.ts#L53)
=======
[packages/core/shared/src/schemas.ts:53](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/schemas.ts#L53)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### anySocket

• `Const` **anySocket**: `Socket`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/sockets.ts:55](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/sockets.ts#L55)
=======
[packages/core/shared/src/sockets.ts:55](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/sockets.ts#L55)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### arraySocket

• `Const` **arraySocket**: `Socket`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/sockets.ts:58](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/sockets.ts#L58)
=======
[packages/core/shared/src/sockets.ts:58](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/sockets.ts#L58)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### audioSocket

• `Const` **audioSocket**: `Socket`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/sockets.ts:63](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/sockets.ts#L63)
=======
[packages/core/shared/src/sockets.ts:63](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/sockets.ts#L63)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### booleanSocket

• `Const` **booleanSocket**: `Socket`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/sockets.ts:57](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/sockets.ts#L57)
=======
[packages/core/shared/src/sockets.ts:57](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/sockets.ts#L57)

___

### bullMQConnection

• `Const` **bullMQConnection**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `db` | `number` |
| `host` | `string` |
| `password` | `undefined` \| `string` |
| `port` | `number` |
| `username` | `undefined` \| `string` |

#### Defined in

[packages/core/shared/src/config.ts:89](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/config.ts#L89)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### components

• `Const` **components**: `Record`<`string`, () => [`MagickComponent`](classes/MagickComponent.md)<`unknown`\>\>

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/nodes/index.ts:71](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/nodes/index.ts#L71)
=======
[packages/core/shared/src/nodes/index.ts:71](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/nodes/index.ts#L71)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### documentSchema

• `Const` **documentSchema**: `TObject`<{ `content`: `TOptional`<`TString`<`string`\>\> ; `date`: `TOptional`<`TString`<`string`\>\> ; `embedding`: `TOptional`<`TAny`\> ; `id`: `TString`<`string`\> ; `projectId`: `TString`<`string`\> ; `type`: `TOptional`<`TString`<`string`\>\>  }\>

Full data model schema for a document.

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/schemas.ts:87](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/schemas.ts#L87)
=======
[packages/core/shared/src/schemas.ts:87](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/schemas.ts#L87)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### documentSocket

• `Const` **documentSocket**: `Socket`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/sockets.ts:64](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/sockets.ts#L64)
=======
[packages/core/shared/src/sockets.ts:64](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/sockets.ts#L64)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### embeddingSocket

• `Const` **embeddingSocket**: `Socket`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/sockets.ts:65](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/sockets.ts#L65)
=======
[packages/core/shared/src/sockets.ts:65](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/sockets.ts#L65)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### eventSocket

• `Const` **eventSocket**: `Socket`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/sockets.ts:62](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/sockets.ts#L62)
=======
[packages/core/shared/src/sockets.ts:62](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/sockets.ts#L62)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### globalsManager

• `Const` **globalsManager**: `GlobalsManager`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/globals.ts:38](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/globals.ts#L38)
=======
[packages/core/shared/src/globals.ts:38](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/globals.ts#L38)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### imageSocket

• `Const` **imageSocket**: `Socket`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/sockets.ts:67](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/sockets.ts#L67)
=======
[packages/core/shared/src/sockets.ts:67](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/sockets.ts#L67)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### numberSocket

• `Const` **numberSocket**: `Socket`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/sockets.ts:56](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/sockets.ts#L56)
=======
[packages/core/shared/src/sockets.ts:56](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/sockets.ts#L56)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### objectSocket

• `Const` **objectSocket**: `Socket`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/sockets.ts:60](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/sockets.ts#L60)
=======
[packages/core/shared/src/sockets.ts:60](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/sockets.ts#L60)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### pluginManager

• `Const` **pluginManager**: [`ClientPluginManager`](classes/ClientPluginManager.md) \| [`ServerPluginManager`](classes/ServerPluginManager.md)

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/plugin.ts:463](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/plugin.ts#L463)
=======
[packages/core/shared/src/plugin.ts:463](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/plugin.ts#L463)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### socketNameMap

• `Const` **socketNameMap**: `Record`<[`SocketNameType`](#socketnametype), [`SocketType`](#sockettype)\>

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/sockets.ts:39](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/sockets.ts#L39)
=======
[packages/core/shared/src/sockets.ts:39](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/sockets.ts#L39)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### spellSchema

• `Const` **spellSchema**: `TObject`<{ `createdAt`: `TOptional`<`TString`<`string`\>\> ; `graph`: `TObject`<{ `id`: `TString`<`string`\> ; `nodes`: `TAny`  }\> ; `hash`: `TString`<`string`\> ; `id`: `TString`<`string`\> ; `name`: `TString`<`string`\> ; `projectId`: `TString`<`string`\> ; `updatedAt`: `TOptional`<`TString`<`string`\>\>  }\>

Full data model schema for a spell.

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/schemas.ts:17](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/schemas.ts#L17)
=======
[packages/core/shared/src/schemas.ts:17](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/schemas.ts#L17)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### stringSocket

• `Const` **stringSocket**: `Socket`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/sockets.ts:59](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/sockets.ts#L59)
=======
[packages/core/shared/src/sockets.ts:59](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/sockets.ts#L59)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### taskSocket

• `Const` **taskSocket**: `Socket`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/sockets.ts:66](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/sockets.ts#L66)
=======
[packages/core/shared/src/sockets.ts:66](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/sockets.ts#L66)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### triggerSocket

• `Const` **triggerSocket**: `Socket`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/sockets.ts:61](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/sockets.ts#L61)
=======
[packages/core/shared/src/sockets.ts:61](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/sockets.ts#L61)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:398](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L398)
=======
[packages/core/shared/src/types.ts:398](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L398)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:410](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L410)
=======
[packages/core/shared/src/types.ts:410](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L410)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:402](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L402)
=======
[packages/core/shared/src/types.ts:402](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L402)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/types.ts:406](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/types.ts#L406)
=======
[packages/core/shared/src/types.ts:406](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/types.ts#L406)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### calculateCompletionCost

▸ **calculateCompletionCost**(`params`): `number`

Calculates the cost of completing a given number of tokens
for a given TextModel or ChatModel

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The parameters for the function |
| `params.model` | [`TextModel`](enums/TextModel.md) \| [`ChatModel`](enums/ChatModel.md) | The model to be used |
| `params.totalTokens` | `number` | The total number of tokens |

#### Returns

`number`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/cost-calculator.ts:62](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/cost-calculator.ts#L62)
=======
[packages/core/shared/src/cost-calculator.ts:62](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/cost-calculator.ts#L62)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### calculateEmbeddingCost

▸ **calculateEmbeddingCost**(`params`): `number`

Calculates the cost for a given number of tokens
for a given EmbeddingModel

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The parameters for the function |
| `params.model` | [`EmbeddingModel`](enums/EmbeddingModel.md) | The model to be used |
| `params.tokens` | `number` | The number of tokens |

#### Returns

`number`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/cost-calculator.ts:80](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/cost-calculator.ts#L80)
=======
[packages/core/shared/src/cost-calculator.ts:80](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/cost-calculator.ts#L80)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/spellManager/configureManager.ts:3](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/spellManager/configureManager.ts#L3)
=======
[packages/core/shared/src/spellManager/configureManager.ts:3](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/spellManager/configureManager.ts#L3)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/spellManager/graphHelpers.ts:9](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/spellManager/graphHelpers.ts#L9)
=======
[packages/core/shared/src/spellManager/graphHelpers.ts:9](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/spellManager/graphHelpers.ts#L9)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/engine.ts:110](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/engine.ts#L110)
=======
[packages/core/shared/src/engine.ts:110](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/engine.ts#L110)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### getLogger

▸ **getLogger**(): `Logger`<`LoggerOptions`\>

#### Returns

`Logger`<`LoggerOptions`\>

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/logger/index.ts:27](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/logger/index.ts#L27)
=======
[packages/core/shared/src/logger/index.ts:27](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/logger/index.ts#L27)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### getNodes

▸ **getNodes**(): [`MagickComponent`](classes/MagickComponent.md)<`unknown`\>[]

Returns a sorted array of MagickComponents including in-built and plugin components.

#### Returns

[`MagickComponent`](classes/MagickComponent.md)<`unknown`\>[]

An array of sorted MagickComponents.

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/nodes/index.ts:163](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/nodes/index.ts#L163)
=======
[packages/core/shared/src/nodes/index.ts:163](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/nodes/index.ts#L163)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### getSpell

▸ **getSpell**(`input`): `Promise`<`any`\>

Fetch a specific spell from the project's spells based on its id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `GetSpell` | Object containing the app, id of the spell and projectId |

#### Returns

`Promise`<`any`\>

- Returns the fetched spell data

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/utils/getSpell.ts:18](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/utils/getSpell.ts#L18)
=======
[packages/core/shared/src/utils/getSpell.ts:18](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/utils/getSpell.ts#L18)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/engine.ts:123](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/engine.ts#L123)
=======
[packages/core/shared/src/engine.ts:123](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/engine.ts#L123)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### initLogger

▸ **initLogger**(`opts?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `opts` | `object` | `defaultLoggerOpts` |

#### Returns

`void`

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/logger/index.ts:8](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/logger/index.ts#L8)
=======
[packages/core/shared/src/logger/index.ts:8](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/logger/index.ts#L8)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/engine.ts:66](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/engine.ts#L66)
=======
[packages/core/shared/src/engine.ts:66](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/engine.ts#L66)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### mapStatusCode

▸ **mapStatusCode**(`customErrorCode`): ``400`` \| ``401`` \| ``404`` \| ``500`` \| ``239``

Maps the custom error code to its corresponding HTTP status code.

**`Function`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customErrorCode` | [`CustomErrorCodes`](#customerrorcodes) | The code of the custom error |

#### Returns

``400`` \| ``401`` \| ``404`` \| ``500`` \| ``239``

The corresponding HTTP status code

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/utils/SpellError.ts:51](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/utils/SpellError.ts#L51)
=======
[packages/core/shared/src/utils/SpellError.ts:51](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/utils/SpellError.ts#L51)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/functions/processCode.ts:23](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/functions/processCode.ts#L23)
=======
[packages/core/shared/src/functions/processCode.ts:23](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/functions/processCode.ts#L23)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/functions/ProcessPython.ts:17](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/functions/ProcessPython.ts#L17)
=======
[packages/core/shared/src/functions/ProcessPython.ts:17](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/functions/ProcessPython.ts#L17)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

___

### runSpell

▸ **runSpell**(`params`): `Promise`<{ `name`: `string` ; `outputs`: `Record`<`string`, `unknown`\>  }\>

Run a spell with the given parameters.

**`Throws`**

- If the spell is not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`RunSpellArgs`](#runspellargs) | The parameters needed to run a spell. |

#### Returns

`Promise`<{ `name`: `string` ; `outputs`: `Record`<`string`, `unknown`\>  }\>

- The outputs from the spell and its name.

#### Defined in

<<<<<<< HEAD
[packages/core/shared/src/utils/runSpell.ts:28](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/utils/runSpell.ts#L28)
=======
[packages/core/shared/src/utils/runSpell.ts:28](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/utils/runSpell.ts#L28)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool

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

<<<<<<< HEAD
[packages/core/shared/src/functions/saveRequest.ts:27](https://github.com/Oneirocom/Magick/blob/dbd53981/packages/core/shared/src/functions/saveRequest.ts#L27)
=======
[packages/core/shared/src/functions/saveRequest.ts:27](https://github.com/Oneirocom/Magick/blob/54607bbd/packages/core/shared/src/functions/saveRequest.ts#L27)
>>>>>>> 783d5c22... update AppConfig to handle posthogEnabled bool
