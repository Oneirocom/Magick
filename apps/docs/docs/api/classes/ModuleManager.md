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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:35](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L35)

## Properties

### engine

• `Optional` **engine**: ``null`` \| `Engine`

#### Defined in

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:28](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L28)

___

### inputs

• **inputs**: `Map`<`string`, `Socket`\>

#### Defined in

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:30](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L30)

___

### modules

• **modules**: `Record`<`string`, [`ModuleType`](../#moduletype)\>

#### Defined in

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:29](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L29)

___

### outputs

• **outputs**: `Map`<`string`, `Socket`\>

#### Defined in

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:31](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L31)

___

### triggerIns

• **triggerIns**: `Map`<`string`, `Socket`\>

#### Defined in

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:32](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L32)

___

### triggerOuts

• **triggerOuts**: `Map`<`string`, `Socket`\>

#### Defined in

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:33](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L33)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:60](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L60)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:64](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L64)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:43](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L43)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:72](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L72)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:68](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L68)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:106](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L106)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:90](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L90)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:102](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L102)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:94](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L94)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:98](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L98)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:210](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L210)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:76](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L76)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:163](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L163)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:112](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L112)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:176](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L176)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:187](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L187)

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

[packages/core/shared/src/plugins/modulePlugin/module-manager.ts:199](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/modulePlugin/module-manager.ts#L199)
