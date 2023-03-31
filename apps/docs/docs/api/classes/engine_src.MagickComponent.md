---
id: "engine_src.MagickComponent"
title: "Class: MagickComponent<WorkerReturnType>"
sidebar_label: "engine/src.MagickComponent"
custom_edit_url: null
---

[engine/src](../modules/engine_src.md).MagickComponent

## Type parameters

| Name |
| :------ |
| `WorkerReturnType` |

## Hierarchy

- [`MagickEngineComponent`](engine_src.MagickEngineComponent.md)<`WorkerReturnType`\>

  ↳ **`MagickComponent`**

## Constructors

### constructor

• **new MagickComponent**<`WorkerReturnType`\>(`name`, `task`, `category`, `info`)

#### Type parameters

| Name |
| :------ |
| `WorkerReturnType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `task` | [`TaskOptions`](../modules/engine_src.md#taskoptions) |
| `category` | [`MagicComponentCategory`](../modules/engine_src.md#magiccomponentcategory) |
| `info` | `string` |

#### Overrides

[MagickEngineComponent](engine_src.MagickEngineComponent.md).[constructor](engine_src.MagickEngineComponent.md#constructor)

#### Defined in

[packages/engine/src/lib/engine.ts:141](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L141)

## Properties

### \_task

• **\_task**: [`MagickTask`](../interfaces/engine_src.MagickTask.md)

#### Defined in

[packages/engine/src/lib/engine.ts:122](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L122)

___

### cache

• **cache**: [`UnknownData`](../modules/engine_src.md#unknowndata)

#### Defined in

[packages/engine/src/lib/engine.ts:123](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L123)

___

### category

• **category**: [`MagicComponentCategory`](../modules/engine_src.md#magiccomponentcategory)

#### Defined in

[packages/engine/src/lib/engine.ts:126](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L126)

___

### contextMenuName

• **contextMenuName**: `undefined` \| `string`

#### Defined in

[packages/engine/src/lib/engine.ts:135](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L135)

___

### data

• **data**: `unknown` = `{}`

#### Overrides

[MagickEngineComponent](engine_src.MagickEngineComponent.md).[data](engine_src.MagickEngineComponent.md#data)

#### Defined in

[packages/engine/src/lib/engine.ts:125](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L125)

___

### deprecated

• `Optional` **deprecated**: `boolean` = `false`

#### Defined in

[packages/engine/src/lib/engine.ts:132](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L132)

___

### dev

• **dev**: `boolean` = `false`

#### Defined in

[packages/engine/src/lib/engine.ts:129](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L129)

___

### display

• `Optional` **display**: `boolean`

#### Defined in

[packages/engine/src/lib/engine.ts:128](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L128)

___

### displayName

• **displayName**: `undefined` \| `string`

#### Defined in

[packages/engine/src/lib/engine.ts:137](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L137)

___

### editor

• **editor**: ``null`` \| [`MagickEditor`](engine_src.MagickEditor.md) = `null`

#### Defined in

[packages/engine/src/lib/engine.ts:124](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L124)

___

### engine

• **engine**: ``null`` \| `Engine` = `null`

#### Inherited from

[MagickEngineComponent](engine_src.MagickEngineComponent.md).[engine](engine_src.MagickEngineComponent.md#engine)

#### Defined in

[packages/engine/src/lib/engine.ts:26](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L26)

___

### hide

• **hide**: `boolean` = `false`

#### Defined in

[packages/engine/src/lib/engine.ts:130](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L130)

___

### info

• **info**: `string`

#### Defined in

[packages/engine/src/lib/engine.ts:127](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L127)

___

### module

• **module**: [`ModuleOptions`](../interfaces/engine_src.ModuleOptions.md)

#### Defined in

[packages/engine/src/lib/engine.ts:134](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L134)

___

### name

• **name**: `string`

#### Inherited from

[MagickEngineComponent](engine_src.MagickEngineComponent.md).[name](engine_src.MagickEngineComponent.md#name)

#### Defined in

[packages/engine/src/lib/engine.ts:24](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L24)

___

### nodeTaskMap

• **nodeTaskMap**: `Record`<`number`, [`MagickTask`](../interfaces/engine_src.MagickTask.md)\> = `{}`

#### Defined in

[packages/engine/src/lib/engine.ts:139](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L139)

___

### onDoubleClick

• `Optional` **onDoubleClick**: (`node`: [`MagickNode`](../modules/engine_src.md#magicknode)) => `void`

#### Type declaration

▸ (`node`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`MagickNode`](../modules/engine_src.md#magicknode) |

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/engine.ts:133](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L133)

___

### runFromCache

• **runFromCache**: `boolean` = `false`

#### Defined in

[packages/engine/src/lib/engine.ts:131](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L131)

___

### task

• **task**: [`TaskOptions`](../modules/engine_src.md#taskoptions)

#### Defined in

[packages/engine/src/lib/engine.ts:121](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L121)

___

### workspaceType

• **workspaceType**: `undefined` \| ``null`` \| ``"spell"``

#### Defined in

[packages/engine/src/lib/engine.ts:136](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L136)

## Methods

### build

▸ **build**(`node`): `Promise`<[`MagickNode`](../modules/engine_src.md#magicknode)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`MagickNode`](../modules/engine_src.md#magicknode) |

#### Returns

`Promise`<[`MagickNode`](../modules/engine_src.md#magicknode)\>

#### Defined in

[packages/engine/src/lib/engine.ts:154](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L154)

___

### builder

▸ `Abstract` **builder**(`node`): `void` \| `Promise`<`void`\> \| [`MagickNode`](../modules/engine_src.md#magicknode) \| `Promise`<[`MagickNode`](../modules/engine_src.md#magicknode)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`MagickNode`](../modules/engine_src.md#magicknode) |

#### Returns

`void` \| `Promise`<`void`\> \| [`MagickNode`](../modules/engine_src.md#magicknode) \| `Promise`<[`MagickNode`](../modules/engine_src.md#magicknode)\>

#### Defined in

[packages/engine/src/lib/engine.ts:152](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L152)

___

### createNode

▸ **createNode**(`data?`): `Promise`<[`MagickNode`](../modules/engine_src.md#magicknode)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Object` |

#### Returns

`Promise`<[`MagickNode`](../modules/engine_src.md#magicknode)\>

#### Defined in

[packages/engine/src/lib/engine.ts:173](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L173)

___

### run

▸ **run**(`node`, `data?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `NodeData` |
| `data` | `Object` |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/engine/src/lib/engine.ts:160](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L160)

___

### worker

▸ `Abstract` **worker**(`node`, `inputs`, `outputs`, `context`, `...args`): `WorkerReturnType`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`WorkerData`](../modules/engine_src.md#workerdata) |
| `inputs` | [`MagickWorkerInputs`](../modules/engine_src.md#magickworkerinputs) |
| `outputs` | `WorkerOutputs` |
| `context` | `any` |
| `...args` | `unknown`[] |

#### Returns

`WorkerReturnType`

#### Inherited from

[MagickEngineComponent](engine_src.MagickEngineComponent.md).[worker](engine_src.MagickEngineComponent.md#worker)

#### Defined in

[packages/engine/src/lib/engine.ts:32](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/engine.ts#L32)
