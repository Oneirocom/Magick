---
id: "ModuleManager"
title: "Class: ModuleManager"
sidebar_label: "ModuleManager"
sidebar_position: 0
custom_edit_url: null
---

## Constructors

### constructor

• **new ModuleManager**(`modules`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `modules` | `Record`<`string`, [`ModuleType`](../#moduletype)\> |

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:45](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L45)

## Properties

### engine

• `Optional` **engine**: ``null`` \| `Engine`

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:38](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L38)

___

### inputs

• **inputs**: `Map`<`string`, `Socket`\>

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:40](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L40)

___

### modules

• **modules**: `Record`<`string`, [`ModuleType`](../#moduletype)\>

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:39](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L39)

___

### outputs

• **outputs**: `Map`<`string`, `Socket`\>

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:41](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L41)

___

### triggerIns

• **triggerIns**: `Map`<`string`, `Socket`\>

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:42](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L42)

___

### triggerOuts

• **triggerOuts**: `Map`<`string`, `Socket`\>

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:43](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L43)

## Methods

### getInputs

▸ **getInputs**(`data`): [`ModuleSocketType`](../#modulesockettype)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Data` |

#### Returns

[`ModuleSocketType`](../#modulesockettype)[]

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:70](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L70)

___

### getOutputs

▸ **getOutputs**(`data`): [`ModuleSocketType`](../#modulesockettype)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Data` |

#### Returns

[`ModuleSocketType`](../#modulesockettype)[]

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:74](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L74)

___

### getSockets

▸ **getSockets**(`data`, `typeMap`, `defaultName`): [`ModuleSocketType`](../#modulesockettype)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Data` |
| `typeMap` | `Map`<`string`, `Socket`\> |
| `defaultName` | `string` |

#### Returns

[`ModuleSocketType`](../#modulesockettype)[]

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:53](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L53)

___

### getTriggerIns

▸ **getTriggerIns**(`data`): [`ModuleSocketType`](../#modulesockettype)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Data` |

#### Returns

[`ModuleSocketType`](../#modulesockettype)[]

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:82](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L82)

___

### getTriggerOuts

▸ **getTriggerOuts**(`data`): [`ModuleSocketType`](../#modulesockettype)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Data` |

#### Returns

[`ModuleSocketType`](../#modulesockettype)[]

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:78](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L78)

___

### getTriggeredNode

▸ **getTriggeredNode**(`data`, `socketKey`): `undefined` \| `NodeData`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Data` |
| `socketKey` | `string` |

#### Returns

`undefined` \| `NodeData`

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:117](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L117)

___

### registerInput

▸ **registerInput**(`name`, `socket`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `socket` | `Socket` |

#### Returns

`void`

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:101](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L101)

___

### registerOutput

▸ **registerOutput**(`name`, `socket`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `socket` | `Socket` |

#### Returns

`void`

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:113](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L113)

___

### registerTriggerIn

▸ **registerTriggerIn**(`name`, `socket`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `socket` | `Socket` |

#### Returns

`void`

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:105](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L105)

___

### registerTriggerOut

▸ **registerTriggerOut**(`name`, `socket`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `socket` | `Socket` |

#### Returns

`void`

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:109](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L109)

___

### setEngine

▸ **setEngine**(`engine`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `engine` | `Engine` |

#### Returns

`void`

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:233](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L233)

___

### socketFactory

▸ **socketFactory**(`node`, `socket`): `Socket`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `NodeData` |
| `socket` | `undefined` \| `Socket` \| (`node`: `NodeData`) => `Socket` |

#### Returns

`Socket`

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:86](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L86)

___

### workerInputs

▸ **workerInputs**(`node`, `_inputs`, `outputs`, `«destructured»`): `undefined` \| `WorkerOutputs`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `NodeData` |
| `_inputs` | [`MagickWorkerInputs`](../#magickworkerinputs) |
| `outputs` | `WorkerOutputs` |
| `«destructured»` | `Object` |
| › `module` | `Module` |

#### Returns

`undefined` \| `WorkerOutputs`

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:186](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L186)

___

### workerModule

▸ **workerModule**(`node`, `inputs`, `outputs`, `context`): `Promise`<`undefined` \| `Module`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `NodeData` |
| `inputs` | [`MagickWorkerInputs`](../#magickworkerinputs) |
| `outputs` | [`MagickWorkerOutputs`](../#magickworkeroutputs) |
| `context` | [`ModuleContext`](../#modulecontext) |

#### Returns

`Promise`<`undefined` \| `Module`\>

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:123](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L123)

___

### workerOutputs

▸ **workerOutputs**(`node`, `inputs`, `_outputs`, `«destructured»`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `NodeData` |
| `inputs` | [`MagickWorkerInputs`](../#magickworkerinputs) |
| `_outputs` | [`MagickWorkerOutputs`](../#magickworkeroutputs) |
| `«destructured»` | `Object` |
| › `module` | `Module` |

#### Returns

`void`

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:199](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L199)

___

### workerTriggerIns

▸ **workerTriggerIns**(`_node`, `_inputs`, `_outputs`, `«destructured»`): `undefined` \| `Record`<`string`, `unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_node` | `any` |
| `_inputs` | `any` |
| `_outputs` | `any` |
| `«destructured»` | `Object` |
| › `data` | `Record`<`string`, `unknown`\> |
| › `module` | `Module` |

#### Returns

`undefined` \| `Record`<`string`, `unknown`\>

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:210](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L210)

___

### workerTriggerOuts

▸ **workerTriggerOuts**(`node`, `_inputs`, `outputs`, `«destructured»`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `NodeData` |
| `_inputs` | [`MagickWorkerInputs`](../#magickworkerinputs) |
| `outputs` | [`MagickWorkerOutputs`](../#magickworkeroutputs) |
| `«destructured»` | `Object` |
| › `module` | `Module` |

#### Returns

`void`

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/module-manager.ts:222](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/modulePlugin/module-manager.ts#L222)
