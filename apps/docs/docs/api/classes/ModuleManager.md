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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:36](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L36)

## Properties

### engine

• `Optional` **engine**: ``null`` \| `Engine`

#### Defined in

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:29](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L29)

___

### inputs

• **inputs**: `Map`<`string`, `Socket`\>

#### Defined in

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:31](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L31)

___

### modules

• **modules**: `Record`<`string`, [`ModuleType`](../#moduletype)\>

#### Defined in

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:30](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L30)

___

### outputs

• **outputs**: `Map`<`string`, `Socket`\>

#### Defined in

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:32](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L32)

___

### triggerIns

• **triggerIns**: `Map`<`string`, `Socket`\>

#### Defined in

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:33](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L33)

___

### triggerOuts

• **triggerOuts**: `Map`<`string`, `Socket`\>

#### Defined in

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:34](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L34)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:61](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L61)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:65](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L65)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:44](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L44)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:73](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L73)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:69](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L69)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:108](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L108)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:92](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L92)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:104](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L104)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:96](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L96)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:100](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L100)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:220](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L220)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:77](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L77)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:173](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L173)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:114](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L114)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:186](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L186)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:197](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L197)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:209](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L209)
