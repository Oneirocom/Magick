---
id: "engine_src.MagickTask"
title: "Interface: MagickTask"
sidebar_label: "engine/src.MagickTask"
custom_edit_url: null
---

[engine/src](../modules/engine_src.md).MagickTask

## Hierarchy

- [`Task`](../classes/engine_src.Task.md)

  ↳ **`MagickTask`**

## Properties

### closed

• **closed**: `string`[]

#### Inherited from

[Task](../classes/engine_src.Task.md).[closed](../classes/engine_src.Task.md#closed)

#### Defined in

[packages/engine/src/lib/plugins/taskPlugin/task.ts:44](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/taskPlugin/task.ts#L44)

___

### component

• **component**: [`MagickComponent`](../classes/engine_src.MagickComponent.md)<`unknown`\>

#### Inherited from

[Task](../classes/engine_src.Task.md).[component](../classes/engine_src.Task.md#component)

#### Defined in

[packages/engine/src/lib/plugins/taskPlugin/task.ts:40](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/taskPlugin/task.ts#L40)

___

### init

• `Optional` **init**: (`task?`: [`MagickTask`](engine_src.MagickTask.md), `node?`: [`MagickNode`](../modules/engine_src.md#magicknode)) => `void`

#### Type declaration

▸ (`task?`, `node?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `task?` | [`MagickTask`](engine_src.MagickTask.md) |
| `node?` | [`MagickNode`](../modules/engine_src.md#magicknode) |

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/types.ts:613](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L613)

___

### inputs

• **inputs**: [`MagickWorkerInputs`](../modules/engine_src.md#magickworkerinputs)

#### Inherited from

[Task](../classes/engine_src.Task.md).[inputs](../classes/engine_src.Task.md#inputs)

#### Defined in

[packages/engine/src/lib/plugins/taskPlugin/task.ts:39](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/taskPlugin/task.ts#L39)

___

### next

• **next**: `TaskRef`[]

#### Inherited from

[Task](../classes/engine_src.Task.md).[next](../classes/engine_src.Task.md#next)

#### Defined in

[packages/engine/src/lib/plugins/taskPlugin/task.ts:42](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/taskPlugin/task.ts#L42)

___

### node

• **node**: `NodeData`

#### Inherited from

[Task](../classes/engine_src.Task.md).[node](../classes/engine_src.Task.md#node)

#### Defined in

[packages/engine/src/lib/plugins/taskPlugin/task.ts:38](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/taskPlugin/task.ts#L38)

___

### onRun

• `Optional` **onRun**: (`node`: `NodeData`, `task`: [`Task`](../classes/engine_src.Task.md), `data`: `unknown`, `socketInfo`: [`TaskSocketInfo`](../modules/engine_src.md#tasksocketinfo)) => `void`

#### Type declaration

▸ (`node`, `task`, `data`, `socketInfo`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `NodeData` |
| `task` | [`Task`](../classes/engine_src.Task.md) |
| `data` | `unknown` |
| `socketInfo` | [`TaskSocketInfo`](../modules/engine_src.md#tasksocketinfo) |

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/types.ts:614](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L614)

___

### outputData

• **outputData**: ``null`` \| `Record`<`string`, `unknown`\>

#### Inherited from

[Task](../classes/engine_src.Task.md).[outputData](../classes/engine_src.Task.md#outputdata)

#### Defined in

[packages/engine/src/lib/plugins/taskPlugin/task.ts:43](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/taskPlugin/task.ts#L43)

___

### outputs

• `Optional` **outputs**: `Object`

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

[packages/engine/src/lib/types.ts:612](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L612)

___

### worker

• **worker**: `TaskWorker`

#### Inherited from

[Task](../classes/engine_src.Task.md).[worker](../classes/engine_src.Task.md#worker)

#### Defined in

[packages/engine/src/lib/plugins/taskPlugin/task.ts:41](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/taskPlugin/task.ts#L41)

___

### x

• **x**: `any`

#### Inherited from

[Task](../classes/engine_src.Task.md).[x](../classes/engine_src.Task.md#x)

#### Defined in

[packages/engine/src/lib/plugins/taskPlugin/task.ts:68](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/taskPlugin/task.ts#L68)

## Methods

### clone

▸ **clone**(`root?`, `oldTask`, `newTask`): [`Task`](../classes/engine_src.Task.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `root` | `boolean` | `true` |
| `oldTask` | [`MagickTask`](engine_src.MagickTask.md) | `undefined` |
| `newTask` | [`MagickTask`](engine_src.MagickTask.md) | `undefined` |

#### Returns

[`Task`](../classes/engine_src.Task.md)

#### Inherited from

[Task](../classes/engine_src.Task.md).[clone](../classes/engine_src.Task.md#clone)

#### Defined in

[packages/engine/src/lib/plugins/taskPlugin/task.ts:250](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/taskPlugin/task.ts#L250)

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

[Task](../classes/engine_src.Task.md).[getInputByNodeId](../classes/engine_src.Task.md#getinputbynodeid)

#### Defined in

[packages/engine/src/lib/plugins/taskPlugin/task.ts:93](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/taskPlugin/task.ts#L93)

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

[Task](../classes/engine_src.Task.md).[getInputFromConnection](../classes/engine_src.Task.md#getinputfromconnection)

#### Defined in

[packages/engine/src/lib/plugins/taskPlugin/task.ts:78](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/taskPlugin/task.ts#L78)

___

### getInputs

▸ **getInputs**(`type`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`TaskOutputTypes`](../modules/engine_src.md#taskoutputtypes) |

#### Returns

`string`[]

#### Inherited from

[Task](../classes/engine_src.Task.md).[getInputs](../classes/engine_src.Task.md#getinputs)

#### Defined in

[packages/engine/src/lib/plugins/taskPlugin/task.ts:69](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/taskPlugin/task.ts#L69)

___

### reset

▸ **reset**(): `void`

#### Returns

`void`

#### Inherited from

[Task](../classes/engine_src.Task.md).[reset](../classes/engine_src.Task.md#reset)

#### Defined in

[packages/engine/src/lib/plugins/taskPlugin/task.ts:127](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/taskPlugin/task.ts#L127)

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

[Task](../classes/engine_src.Task.md).[run](../classes/engine_src.Task.md#run)

#### Defined in

[packages/engine/src/lib/plugins/taskPlugin/task.ts:132](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/taskPlugin/task.ts#L132)
