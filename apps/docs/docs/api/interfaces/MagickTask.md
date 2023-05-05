---
id: "MagickTask"
title: "Interface: MagickTask"
sidebar_label: "MagickTask"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- [`Task`](../classes/Task.md)

  ↳ **`MagickTask`**

## Properties

### closed

• **closed**: `string`[]

#### Inherited from

[Task](../classes/Task.md).[closed](../classes/Task.md#closed)

#### Defined in

[packages/core/shared/src/plugins/taskPlugin/task.ts:44](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugins/taskPlugin/task.ts#L44)

___

### component

• **component**: [`MagickComponent`](../classes/MagickComponent.md)<`unknown`\>

#### Inherited from

[Task](../classes/Task.md).[component](../classes/Task.md#component)

#### Defined in

[packages/core/shared/src/plugins/taskPlugin/task.ts:40](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugins/taskPlugin/task.ts#L40)

___

### init

• `Optional` **init**: (`task?`: [`MagickTask`](MagickTask.md), `node?`: [`MagickNode`](../#magicknode)) => `void`

#### Type declaration

▸ (`task?`, `node?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `task?` | [`MagickTask`](MagickTask.md) |
| `node?` | [`MagickNode`](../#magicknode) |

##### Returns

`void`

#### Defined in

[packages/core/shared/src/types.ts:663](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/types.ts#L663)

___

### inputs

• **inputs**: [`MagickWorkerInputs`](../#magickworkerinputs)

#### Inherited from

[Task](../classes/Task.md).[inputs](../classes/Task.md#inputs)

#### Defined in

[packages/core/shared/src/plugins/taskPlugin/task.ts:39](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugins/taskPlugin/task.ts#L39)

___

### next

• **next**: `TaskRef`[]

#### Inherited from

[Task](../classes/Task.md).[next](../classes/Task.md#next)

#### Defined in

[packages/core/shared/src/plugins/taskPlugin/task.ts:42](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugins/taskPlugin/task.ts#L42)

___

### node

• **node**: `NodeData`

#### Inherited from

[Task](../classes/Task.md).[node](../classes/Task.md#node)

#### Defined in

[packages/core/shared/src/plugins/taskPlugin/task.ts:38](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugins/taskPlugin/task.ts#L38)

___

### onRun

• `Optional` **onRun**: (`node`: `NodeData`, `task`: [`Task`](../classes/Task.md), `data`: `unknown`, `socketInfo`: [`TaskSocketInfo`](../#tasksocketinfo)) => `void`

#### Type declaration

▸ (`node`, `task`, `data`, `socketInfo`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `NodeData` |
| `task` | [`Task`](../classes/Task.md) |
| `data` | `unknown` |
| `socketInfo` | [`TaskSocketInfo`](../#tasksocketinfo) |

##### Returns

`void`

#### Defined in

[packages/core/shared/src/types.ts:664](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/types.ts#L664)

___

### outputData

• **outputData**: ``null`` \| `Record`<`string`, `unknown`\>

#### Inherited from

[Task](../classes/Task.md).[outputData](../classes/Task.md#outputdata)

#### Defined in

[packages/core/shared/src/plugins/taskPlugin/task.ts:43](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugins/taskPlugin/task.ts#L43)

___

### outputs

• `Optional` **outputs**: `Object`

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

[packages/core/shared/src/types.ts:662](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/types.ts#L662)

___

### worker

• **worker**: `TaskWorker`

#### Inherited from

[Task](../classes/Task.md).[worker](../classes/Task.md#worker)

#### Defined in

[packages/core/shared/src/plugins/taskPlugin/task.ts:41](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugins/taskPlugin/task.ts#L41)

## Methods

### clone

▸ **clone**(`root?`, `oldTask`, `newTask`): [`Task`](../classes/Task.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `root` | `boolean` | `true` |
| `oldTask` | [`MagickTask`](MagickTask.md) | `undefined` |
| `newTask` | [`MagickTask`](MagickTask.md) | `undefined` |

#### Returns

[`Task`](../classes/Task.md)

#### Inherited from

[Task](../classes/Task.md).[clone](../classes/Task.md#clone)

#### Defined in

[packages/core/shared/src/plugins/taskPlugin/task.ts:250](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugins/taskPlugin/task.ts#L250)

___

### getInputByNodeId

▸ **getInputByNodeId**(`node`, `fromSocket`): ``null`` \| `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `any` |
| `fromSocket` | `any` |

#### Returns

``null`` \| `string`

#### Inherited from

[Task](../classes/Task.md).[getInputByNodeId](../classes/Task.md#getinputbynodeid)

#### Defined in

[packages/core/shared/src/plugins/taskPlugin/task.ts:93](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugins/taskPlugin/task.ts#L93)

___

### getInputFromConnection

▸ **getInputFromConnection**(`socketKey`): ``null``

#### Parameters

| Name | Type |
| :------ | :------ |
| `socketKey` | `string` |

#### Returns

``null``

#### Inherited from

[Task](../classes/Task.md).[getInputFromConnection](../classes/Task.md#getinputfromconnection)

#### Defined in

[packages/core/shared/src/plugins/taskPlugin/task.ts:78](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugins/taskPlugin/task.ts#L78)

___

### getInputs

▸ **getInputs**(`type`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`TaskOutputTypes`](../#taskoutputtypes) |

#### Returns

`string`[]

#### Inherited from

[Task](../classes/Task.md).[getInputs](../classes/Task.md#getinputs)

#### Defined in

[packages/core/shared/src/plugins/taskPlugin/task.ts:69](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugins/taskPlugin/task.ts#L69)

___

### reset

▸ **reset**(): `void`

#### Returns

`void`

#### Inherited from

[Task](../classes/Task.md).[reset](../classes/Task.md#reset)

#### Defined in

[packages/core/shared/src/plugins/taskPlugin/task.ts:127](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugins/taskPlugin/task.ts#L127)

___

### run

▸ **run**(`data`, `options?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `NodeData` |
| `options` | `RunOptions` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Task](../classes/Task.md).[run](../classes/Task.md#run)

#### Defined in

[packages/core/shared/src/plugins/taskPlugin/task.ts:132](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugins/taskPlugin/task.ts#L132)
