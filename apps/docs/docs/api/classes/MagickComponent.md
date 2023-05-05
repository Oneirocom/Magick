---
id: "MagickComponent"
title: "Class: MagickComponent<WorkerReturnType>"
sidebar_label: "MagickComponent"
sidebar_position: 0
custom_edit_url: null
---

## Type parameters

| Name |
| :------ |
| `WorkerReturnType` |

## Hierarchy

- [`MagickEngineComponent`](MagickEngineComponent.md)<`WorkerReturnType`\>

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
| `task` | [`TaskOptions`](../#taskoptions) |
| `category` | [`MagicComponentCategory`](../#magiccomponentcategory) |
| `info` | `string` |

#### Overrides

[MagickEngineComponent](MagickEngineComponent.md).[constructor](MagickEngineComponent.md#constructor)

#### Defined in

[packages/core/shared/src/engine.ts:169](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/engine.ts#L169)

## Properties

### \_task

• **\_task**: [`MagickTask`](../interfaces/MagickTask.md)

#### Defined in

[packages/core/shared/src/engine.ts:150](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/engine.ts#L150)

___

### cache

• **cache**: [`UnknownData`](../#unknowndata)

#### Defined in

[packages/core/shared/src/engine.ts:151](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/engine.ts#L151)

___

### category

• **category**: [`MagicComponentCategory`](../#magiccomponentcategory)

#### Defined in

[packages/core/shared/src/engine.ts:154](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/engine.ts#L154)

___

### contextMenuName

• **contextMenuName**: `undefined` \| `string`

#### Defined in

[packages/core/shared/src/engine.ts:163](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/engine.ts#L163)

___

### data

• **data**: `unknown` = `{}`

#### Overrides

[MagickEngineComponent](MagickEngineComponent.md).[data](MagickEngineComponent.md#data)

#### Defined in

[packages/core/shared/src/engine.ts:153](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/engine.ts#L153)

___

### deprecated

• `Optional` **deprecated**: `boolean` = `false`

#### Defined in

[packages/core/shared/src/engine.ts:160](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/engine.ts#L160)

___

### dev

• **dev**: `boolean` = `false`

#### Defined in

[packages/core/shared/src/engine.ts:157](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/engine.ts#L157)

___

### display

• `Optional` **display**: `boolean`

#### Defined in

[packages/core/shared/src/engine.ts:156](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/engine.ts#L156)

___

### displayName

• **displayName**: `undefined` \| `string`

#### Defined in

[packages/core/shared/src/engine.ts:165](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/engine.ts#L165)

___

### editor

• **editor**: ``null`` \| [`MagickEditor`](MagickEditor.md) = `null`

#### Defined in

[packages/core/shared/src/engine.ts:152](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/engine.ts#L152)

___

### engine

• **engine**: ``null`` \| `Engine` = `null`

#### Inherited from

[MagickEngineComponent](MagickEngineComponent.md).[engine](MagickEngineComponent.md#engine)

#### Defined in

[packages/core/shared/src/engine.ts:39](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/engine.ts#L39)

___

### hide

• **hide**: `boolean` = `false`

#### Defined in

[packages/core/shared/src/engine.ts:158](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/engine.ts#L158)

___

### info

• **info**: `string`

#### Defined in

[packages/core/shared/src/engine.ts:155](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/engine.ts#L155)

___

### module

• **module**: [`ModuleOptions`](../interfaces/ModuleOptions.md)

#### Defined in

[packages/core/shared/src/engine.ts:162](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/engine.ts#L162)

___

### name

• **name**: `string`

#### Inherited from

[MagickEngineComponent](MagickEngineComponent.md).[name](MagickEngineComponent.md#name)

#### Defined in

[packages/core/shared/src/engine.ts:37](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/engine.ts#L37)

___

### nodeTaskMap

• **nodeTaskMap**: `Record`<`number`, [`MagickTask`](../interfaces/MagickTask.md)\> = `{}`

#### Defined in

[packages/core/shared/src/engine.ts:167](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/engine.ts#L167)

___

### onDoubleClick

• `Optional` **onDoubleClick**: (`node`: [`MagickNode`](../#magicknode)) => `void`

#### Type declaration

▸ (`node`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`MagickNode`](../#magicknode) |

##### Returns

`void`

#### Defined in

[packages/core/shared/src/engine.ts:161](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/engine.ts#L161)

___

### runFromCache

• **runFromCache**: `boolean` = `false`

#### Defined in

[packages/core/shared/src/engine.ts:159](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/engine.ts#L159)

___

### task

• **task**: [`TaskOptions`](../#taskoptions)

#### Defined in

[packages/core/shared/src/engine.ts:149](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/engine.ts#L149)

___

### workspaceType

• **workspaceType**: `undefined` \| ``null`` \| ``"spell"``

#### Defined in

[packages/core/shared/src/engine.ts:164](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/engine.ts#L164)

## Methods

### build

▸ **build**(`node`): `Promise`<[`MagickNode`](../#magicknode)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`MagickNode`](../#magicknode) |

#### Returns

`Promise`<[`MagickNode`](../#magicknode)\>

#### Defined in

[packages/core/shared/src/engine.ts:188](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/engine.ts#L188)

___

### builder

▸ `Abstract` **builder**(`node`): `void` \| [`MagickNode`](../#magicknode) \| `Promise`<`void`\> \| `Promise`<[`MagickNode`](../#magicknode)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`MagickNode`](../#magicknode) |

#### Returns

`void` \| [`MagickNode`](../#magicknode) \| `Promise`<`void`\> \| `Promise`<[`MagickNode`](../#magicknode)\>

#### Defined in

[packages/core/shared/src/engine.ts:184](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/engine.ts#L184)

___

### createNode

▸ **createNode**(`data?`): `Promise`<[`MagickNode`](../#magicknode)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Object` |

#### Returns

`Promise`<[`MagickNode`](../#magicknode)\>

#### Defined in

[packages/core/shared/src/engine.ts:206](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/engine.ts#L206)

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

[packages/core/shared/src/engine.ts:193](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/engine.ts#L193)

___

### worker

▸ `Abstract` **worker**(`node`, `inputs`, `outputs`, `context`, `...args`): `WorkerReturnType`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`WorkerData`](../#workerdata) |
| `inputs` | [`MagickWorkerInputs`](../#magickworkerinputs) |
| `outputs` | `WorkerOutputs` |
| `context` | `unknown` |
| `...args` | `unknown`[] |

#### Returns

`WorkerReturnType`

#### Inherited from

[MagickEngineComponent](MagickEngineComponent.md).[worker](MagickEngineComponent.md#worker)

#### Defined in

[packages/core/shared/src/engine.ts:45](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/engine.ts#L45)
